import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { msg } from "libs/socket/message";
import { WebSocket } from "ws";

export class Channel {
	public password?: string
	readonly passwordEntered?= new Set<Client>()
	readonly clients = new Set<Client>()
	readonly admins = new Set<Client>()
	readonly creator = new Set<Client>()
	readonly muteds = new Set<Client>()
	readonly banneds = new Set<Client>()

	constructor(readonly name: string) { }
}

export class Client {
	constructor(readonly name: string, readonly socket: WebSocket) { }
}

@WebSocketGateway({ path: "/chat" })
export class ChatController {
	readonly clients = new Map<WebSocket, Client>()
	readonly names = new Map<string, Client>()
	readonly channels = new Map<string, Channel>()
	i = 0;

	getOrCreateChannel(name: string, client: Client) {
		let channel = this.channels.get(name)
		if (!channel) {
			channel = new Channel(name);
			this.channels.set(channel.name, channel);
			channel.creator.add(client)
			channel.admins.add(client)
			const channels = [...this.channels.keys()]
			for (const client of this.clients.values())
				client.socket.send(msg("channels", channels))
		}
		return channel
	}


	getChannelByName(name: string) {
		return (this.channels.get(name) ? this.channels.get(name) : 0);
	}

	sendToAll(channel: Channel, dataPackage: Object) {
		for (const client of channel.clients.values())
			client.socket.send(dataPackage)
	}

	handleConnection(socket: WebSocket, req: Request) {
		const client = new Client("chad" + this.i++, socket);
		this.clients.set(client.socket, client);
		this.names.set(client.name, client)
	}

	handleDisconnect(socket: WebSocket) {
		if (!this.clients.has(socket))
			return
		this.clients.delete(socket);
	}

	@SubscribeMessage("channels")
	onchannels(socket: WebSocket, data: {}) {
		const channels = [...this.channels.keys()]
		socket.send(msg("channels", channels))
	}

	@SubscribeMessage("join")
	onjoin(socket: WebSocket, data: {
		channel: string,
	}) {

		if (!this.clients.has(socket))
			throw new Error("Did not say hello")
		const client = this.clients.get(socket)
		console.log("Entre dans join, username : " + client.name)
		if (!data.channel)
			throw new Error("Empty channel string")

		const channel = this.getOrCreateChannel(data.channel, client)

		if (channel.clients.has(client))
			return;
		if (channel.banneds.has(client)) {
			console.log("rentre dans le if banned dans le join")
			socket.send(msg("banButTry", {
				channel: channel.name,
				message: "📛 Since you have been banned, you no longer can access to the channel"
			}))
			throw new Error("Ban but try")
		}
		channel.clients.add(client)
		socket.send(msg("clientName", { nickname: client.name }))
		socket.send(msg("join", data))
		if (channel.passwordEntered.size && !channel.passwordEntered.has(client)) {
			socket.send(msg("noPwdButTry", {
				channel: channel.name,
				nickname: client.name,
				message: "❗ Please enter '/putpassword CHANPASSWORD' to access the channel"
			}))
			return;
		}
		const packet = msg("joined", {
			channel: data.channel,
			message: "👋 " + client.name + " joined " + data.channel
		})
		this.sendToAll(channel, packet);
	}

	@SubscribeMessage("message")
	onmessage(socket: WebSocket, data: {
		channel: string,
		message: string
	}) {
		console.log("channel : " + data.channel)
		if (!this.clients.has(socket))
			throw new Error("Did not say hello")
		const client = this.clients.get(socket)
		if (!this.channels.has(data.channel))
			throw new Error("No such channel")
		if (!data.message)
			throw new Error("Empty message")
		console.log(data.message);
		const channel = this.channels.get(data.channel)
		if (!channel.clients.has(client))
			throw new Error("Not in channel")
		if (channel.muteds.has(client)) {
			socket.send(msg("mutedButTry", {
				channel: channel.name,
				message: "Since you are muted, you cannot talk."
			}))
			throw new Error("mutedButTry")
		}
		const packet = msg("message", {
			channel: channel.name,
			nickname: client.name,
			message: data.message
		})
		this.sendToAll(channel, packet);
	}


	@SubscribeMessage("leave")
	onleave(socket: WebSocket, data: {
		channel: string,
	}) {
		const client = this.clients.get(socket)

		if (!data.channel)
			throw new Error("Empty channel string")

		const channel = this.getChannelByName(data.channel)
		if (!channel)
			throw new Error("Channel do not exists")

		if (!channel.clients.has(client))
			throw new Error("Client not inside this channel")
		const packet = msg("leave", {
			channel: channel.name,
			message: "😞 " + client.name + " has left the channel"
		})
		client.socket.send(packet);
		channel.clients.delete(client);
		if (channel.passwordEntered.has(client))
			channel.passwordEntered.delete(client);
		this.sendToAll(channel, packet);
	}


	@SubscribeMessage("rmpassword")
	onrmpassword(socket: WebSocket, data: {
		channel: string,
	}) {
		const client = this.clients.get(socket)

		if (!data.channel)
			throw new Error("Empty channel string")

		const channel = this.getChannelByName(data.channel)
		if (!channel)
			throw new Error("Channel do not exists")

		if (!channel.admins.has(client))
			throw new Error(client.name + " is trying to remove the password without admin privileges")
		channel.password = "";
		for (const cli of channel.clients.values())
			channel.passwordEntered.delete(cli);
		const packet = msg("rmpassword", {
			channel: channel.name,
			message: "🔓 Password has been removed on " + channel.name
		})
		this.sendToAll(channel, packet);
	}


	@SubscribeMessage("password")
	onpassword(socket: WebSocket, data: {
		channel: string,
		message: string
	}) {
		const client = this.clients.get(socket)

		if (!data.channel)
			throw new Error("Empty channel string")

		const channel = this.getChannelByName(data.channel)
		if (!channel)
			throw new Error("Channel do not exists")

		if (!channel.admins.has(client))
			throw new Error(client.name + " is trying to add a password without admin privileges")
		const messageSplit = data.message.split(" ");
		if (messageSplit.length != 2)
			throw new Error(client.name + " just tried to add a password with the wrong format")
		channel.password = messageSplit[1];
		for (const cli of channel.clients.values())
			channel.passwordEntered.add(cli);
		const packet = msg("password", {
			channel: channel.name,
			message: "🔒 A password has been set on " + channel.name
		})
		this.sendToAll(channel, packet);
	}

	@SubscribeMessage("putpassword")
	onputpassword(socket: WebSocket, data: {
		channel: string,
		message: string
	}) {
		const client = this.clients.get(socket)

		if (!data.channel)
			throw new Error("Empty channel string")

		const channel = this.getChannelByName(data.channel)
		if (!channel)
			throw new Error("Channel do not exists")

		if (channel.passwordEntered.has(client))
			throw new Error(client.name + " is trying to enter a password but is already inside the channel")
		const messageSplit = data.message.split(" ");
		if (messageSplit.length != 2)
			throw new Error(client.name + " just tried to put the password with the wrong format")
		if (messageSplit[1] != channel.password) {
			console.log("Entre dans le fameux wrong password")
			client.socket.send(msg("wrongPwd", {
				channel: channel.name,
				message: "📛 Wrong password, try again."
			}))
			throw new Error("Wrong password")
		}
		console.log("add client dans la liste des granted pwd")
		channel.passwordEntered.add(client);
		for (const cli of channel.clients.values())
			channel.passwordEntered.add(cli);
		console.log("Envoie le msg de join")
		const packet = msg("joined", {
			channel: data.channel,
			message: "👋 " + client.name + " joined " + data.channel
		})
		this.sendToAll(channel, packet);
	}

	@SubscribeMessage("kick")
	onkick(socket: WebSocket, data: {
		channel: string,
		message: string
	}) {
		const client = this.clients.get(socket)

		if (!data.channel)
			throw new Error("Empty channel string")

		const channel = this.getChannelByName(data.channel)
		if (!channel)
			throw new Error("Channel do not exists")

		const messageSplit = data.message.split(" ");
		if (messageSplit.length != 2)
			throw new Error(client.name + " just tried to kick with the wrong format")
		if (!channel.admins.has(client))
			throw new Error(client.name + " is trying to kick " + messageSplit[1] + " without admin privileges")
		const target = this.names.get(messageSplit[1]);
		if (!channel.clients.has(target))
			throw new Error(client.name + " is trying to kick " + messageSplit[1] + " which is not member of the channel")
		if (channel.admins.has(target))
			throw new Error(client.name + " is trying to kick " + messageSplit[1] + " which is admin of the channel")
		if (target == client)
			throw new Error(client.name + " is trying to kick himself")
		const packet = msg("kicked", {
			channel: channel.name,
			message: "❗ " + messageSplit[1] + " has been kicked from " + channel.name
		})
		this.sendToAll(channel, packet);
		channel.clients.delete(target);
	}

	@SubscribeMessage("ban")
	onban(socket: WebSocket, data: {
		channel: string,
		message: string
	}) {
		const client = this.clients.get(socket)

		if (!data.channel)
			throw new Error("Empty channel string")

		const channel = this.getChannelByName(data.channel)
		if (!channel)
			throw new Error("Channel do not exists")

		const messageSplit = data.message.split(" ");
		if (messageSplit.length != 2)
			throw new Error(client.name + " just tried to ban with the wrong format")
		if (!channel.admins.has(client))
			throw new Error(client.name + " is trying to ban " + messageSplit[1] + " without admin privileges")

		const target = this.names.get(messageSplit[1]);
		if (!this.clients.has(target.socket))
			throw new Error(client.name + " is trying to ban " + messageSplit[1] + " which is not a created member")
		if (channel.admins.has(target))
			throw new Error(client.name + " is trying to ban " + messageSplit[1] + " which is admin of the channel")
		if (channel.banneds.has(target))
			throw new Error(client.name + " is trying to ban " + messageSplit[1] + " which is already banned")
		if (target == client)
			throw new Error(client.name + " is trying to ban himself")
		const packet = msg("banned", {
			channel: channel.name,
			message: "📛 " + messageSplit[1] + " has been banned from " + channel.name
		})
		this.sendToAll(channel, packet);
		channel.clients.delete(target);
		channel.banneds.add(target);
	}

	@SubscribeMessage("unban")
	onunban(socket: WebSocket, data: {
		channel: string,
		message: string
	}) {
		const client = this.clients.get(socket)
		if (!data.channel)
			throw new Error("Empty channel string")

		const channel = this.getChannelByName(data.channel)
		if (!channel)
			throw new Error("Channel do not exists")

		const messageSplit = data.message.split(" ");
		if (messageSplit.length != 2)
			throw new Error(client.name + " just tried to unban with the wrong format")
		if (!channel.admins.has(client))
			throw new Error(client.name + " is trying to unban " + messageSplit[1] + " without admin privileges")
		const target = this.names.get(messageSplit[1]);
		if (!channel.banneds.has(target))
			throw new Error(client.name + " is trying to unban " + messageSplit[1] + " which is not banned")
		if (target == client)
			throw new Error(client.name + " is trying to unban himself")
		const packet = msg("unbanned", {
			channel: channel.name,
			message: "😎 " + messageSplit[1] + " has been unbanned from " + channel.name
		})
		this.sendToAll(channel, packet);
		channel.banneds.delete(target);
	}



	@SubscribeMessage("mute")
	onmute(socket: WebSocket, data: {
		channel: string,
		message: string
	}) {
		const client = this.clients.get(socket)

		if (!data.channel)
			throw new Error("Empty channel string")

		const channel = this.getChannelByName(data.channel)
		if (!channel)
			throw new Error("Channel do not exists")

		const messageSplit = data.message.split(" ");
		if (messageSplit.length != 2)
			throw new Error(client.name + " just tried to mute with the wrong format")
		if (!channel.admins.has(client))
			throw new Error(client.name + " is trying to mute " + messageSplit[1] + " without admin privileges")

		const target = this.names.get(messageSplit[1]);
		if (!channel.clients.has(target))
			throw new Error(client.name + " is trying to mute " + messageSplit[1] + " which is not member of the channel")
		if (channel.admins.has(target))
			throw new Error(client.name + " is trying to mute " + messageSplit[1] + " which is admin of the channel")
		if (channel.banneds.has(target))
			throw new Error(client.name + " is trying to mute " + messageSplit[1] + " which is already muted")
		if (target == client)
			throw new Error(client.name + " is trying to mute himself")
		const packet = msg("muted", {
			channel: channel.name,
			message: "🤫 " + messageSplit[1] + " has been muted from " + channel.name
		})
		this.sendToAll(channel, packet);
		channel.muteds.add(target);
	}


	@SubscribeMessage("unmute")
	onunmute(socket: WebSocket, data: {
		channel: string,
		message: string
	}) {
		const client = this.clients.get(socket)
		if (!data.channel)
			throw new Error("Empty channel string")

		const channel = this.getChannelByName(data.channel)
		if (!channel)
			throw new Error("Channel do not exists")

		const messageSplit = data.message.split(" ");
		if (messageSplit.length != 2)
			throw new Error(client.name + " just tried to unmute with the wrong format")
		if (!channel.admins.has(client))
			throw new Error(client.name + " is trying to unmute " + messageSplit[1] + " without admin privileges")
		const target = this.names.get(messageSplit[1]);
		if (!channel.clients.has(target))
			throw new Error(client.name + " is trying to un " + messageSplit[1] + " which is not member of the channel")
		if (target == client)
			throw new Error(client.name + " is trying to unmute himself")
		const packet = msg("unmuted", {
			channel: channel.name,
			message: "🗣️ " + messageSplit[1] + " has been unmuted from " + channel.name
		})
		this.sendToAll(channel, packet);
		channel.muteds.delete(target);
	}

	@SubscribeMessage("admin")
	onadmin(socket: WebSocket, data: {
		channel: string,
		message: string
	}) {
		const client = this.clients.get(socket)

		if (!data.channel)
			throw new Error("Empty channel string")

		const channel = this.getChannelByName(data.channel)
		if (!channel)
			throw new Error("Channel do not exists")

		const messageSplit = data.message.split(" ");
		if (messageSplit.length != 2)
			throw new Error(client.name + " just tried to promote with the wrong format")
		if (!channel.admins.has(client))
			throw new Error(client.name + " is trying to promote " + messageSplit[1] + " without admin privileges")
		const target = this.names.get(messageSplit[1]);
		if (!channel.clients.has(target))
			throw new Error(client.name + " is trying to promote " + messageSplit[1] + " which is not member of the channel")
		if (channel.admins.has(target))
			throw new Error(client.name + " is trying to promote " + messageSplit[1] + " which is already admin of the channel")
		if (target == client)
			throw new Error(client.name + " is trying to promote himself")
		const packet = msg("admin", {
			channel: channel.name,
			message: "👑 " + messageSplit[1] + " has been promoted as admin on " + channel.name
		})
		this.sendToAll(channel, packet);
		channel.admins.add(target);
	}

	@SubscribeMessage("rmadmin")
	onrmadmin(socket: WebSocket, data: {
		channel: string,
		message: string
	}) {
		const client = this.clients.get(socket)

		if (!data.channel)
			throw new Error("Empty channel string")

		const channel = this.getChannelByName(data.channel)
		if (!channel)
			throw new Error("Channel do not exists")

		const messageSplit = data.message.split(" ");
		if (messageSplit.length != 2)
			throw new Error(client.name + " just tried to downgrade with the wrong format")
		if (!channel.admins.has(client))
			throw new Error(client.name + " is trying to downgrade " + messageSplit[1] + " without admin privileges")
		const target = this.names.get(messageSplit[1]);
		if (!channel.clients.has(target))
			throw new Error(client.name + " is trying to downgrade " + messageSplit[1] + " which is not member of the channel")
		if (channel.creator.has(target))
			throw new Error(client.name + " is trying to downgrade " + messageSplit[1] + " which is creator of the channel")
		if (target == client)
			throw new Error(client.name + " is trying to downgrade himself")
		const packet = msg("rmadmin", {
			channel: channel.name,
			message: "💔 " + messageSplit[1] + " has been downgraded to simple channel member of " + channel.name
		})
		this.sendToAll(channel, packet);
		channel.admins.delete(target);
	}

	@SubscribeMessage("help")
	onhelp(socket: WebSocket, data: {
		channel: string,
	}) {
		const client = this.clients.get(socket)
		if (!data.channel)
			throw new Error("Empty channel string")
		const channel = this.getChannelByName(data.channel)
		if (!channel)
			throw new Error("Channel do not exists")
		client.socket.send(msg("help", {
			channel: channel.name,
			message: "👨‍🎓\n/leave \n/kick [NAME]\n/ban [NAME]\n/unban [NAME]\n/mute [NAME]\n/unmute [NAME]\n/admin [NAME]\n/rmadmin [NAME]\n/msg [NAME] [MESSAGE]",
		}))
	}

	@SubscribeMessage("msg")
	onmsg(socket: WebSocket, data: {
		channel: string,
		message: string
	}) {
		const client = this.clients.get(socket)
		if (!data.channel)
			throw new Error("Empty channel string")
		const channel = this.getChannelByName(data.channel)
		if (!channel)
			throw new Error("Channel do not exists")
		const messageSplit = data.message.split(" ");
		if (messageSplit.length != 3) {
			client.socket.send(msg("msg", {
				channel: channel.name,
				nickname: "system",
				message: "❗ Please enter '/msg NAME MESSAGE' to send a private message"
			}))
			throw new Error("Wrong format for private msg")
		}
		const target = this.names.get(messageSplit[1]);
		if (!channel.clients.has(target))
			throw new Error(client.name + " is trying to send a private message to " + messageSplit[1] + " which is not member of the channel")
		if (client == target)
			throw new Error(client.name + " is trying to send a private message to himself.")

		const content = messageSplit[2]
		console.log("sender: " + client.name)
		console.log("receiver: " + target.name)
		client.socket.send(msg("pmsg", {
			channel: channel.name,
			private: true,
			sender: true,
			nickname: target.name,
			message: content
		}))
		target.socket.send(msg("pmsg", {
			channel: channel.name,
			private: true,
			sender: false,
			nickname: client.name,
			message: content
		}))
	}
}