import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { msg } from "libs/socket/message";
import { WebSocket } from "ws";

export class Channel {
  public password?: string
  public private: boolean = false
  readonly passwordEntered?= new Set<Client>()
  readonly clients = new Set<Client>()
  readonly pending = new Set<Client>()
  readonly admins = new Set<Client>()
  readonly creator = new Set<Client>()

  constructor(readonly name: string) { }
}

export class Client {
  muted?: number;
  banned?: number;
  readonly blockeds?= new Set<Client>()
  constructor(readonly name: string, readonly socket: WebSocket) { }
}

@WebSocketGateway({ path: "/api/chat" })
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
      this.sendChannelsAll()
    }
    return channel
  }

  getChannelByName(name: string) {
    return (this.channels.get(name) ? this.channels.get(name) : 0);
  }

  sendToAll(channel: Channel, dataPackage: any, from?: Client) {
    for (const client of channel.clients.values()) {
      if (!client.blockeds.has(from)) {
        client.socket.send(dataPackage)
      }
    }
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

  sendChannels(client: Client) {
    const channels = Array.from(this.channels).filter(([name, channel]) => {
      if (!channel.private)
        return (true)
      if (channel.private && channel.clients.has(client))
        return (true)
      if (channel.private && channel.pending.has(client))
        return (true)
      return (false)
    }).map(([name, channel]) => name);
    client.socket.send(msg("channels", channels))
  }

  sendChannelsAll() {
    for (const client of this.clients.values())
      this.sendChannels(client)
  }

  @SubscribeMessage("channels")
  onchannels(socket: WebSocket, data: {}) {
    if (!this.clients.has(socket))
      throw new Error("Did not say hello")
    const client = this.clients.get(socket)
    this.sendChannels(client)
  }

  @SubscribeMessage("join")
  onjoin(socket: WebSocket, data: {
    channel: string,
  }) {
    if (!this.clients.has(socket))
      throw new Error("Did not say hello")
    const client = this.clients.get(socket)
    if (!data.channel)
      throw new Error("Empty channel string")

    const channel = this.getOrCreateChannel(data.channel, client)

    if (channel.clients.has(client))
      return;
    if (channel.private && (!channel.clients.has(client) && !channel.pending.has(client))) {
      socket.send(msg("notInvitedButTry", {
        channel: channel.name,
        message: "📛 You cannot join this channel, as you have not been invited."
      }))
      throw new Error("notInvitedButTry")
    }
    if (client.banned && client.banned > Date.now()) {
      socket.send(msg("banButTry", {
        channel: channel.name,
        message: "📛 You cannot join this channel, since you are ban from it during " + ((client.banned - Date.now()) / 1000).toFixed() + " seconds"
      }))
      throw new Error("banButTry")
    }
    channel.clients.add(client)
    if (channel.pending.has(client))
      channel.pending.delete(client)
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
    if (!this.clients.has(socket))
      throw new Error("Did not say hello")
    const client = this.clients.get(socket)
    if (!this.channels.has(data.channel))
      throw new Error("No such channel")
    if (!data.message)
      throw new Error("Empty message")
    const channel = this.channels.get(data.channel)
    if (!channel.clients.has(client))
      throw new Error("Not in channel")
    if (client.muted && client.muted > Date.now()) {
      socket.send(msg("mutedButTry", {
        channel: channel.name,
        message: "Since you are muted, you cannot talk during " + ((client.muted - Date.now()) / 1000).toFixed() + " seconds"
      }))
      throw new Error("mutedButTry")
    }
    const packet = msg("message", {
      channel: channel.name,
      nickname: client.name,
      message: data.message
    })
    this.sendToAll(channel, packet, client);
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

    if (!channel.creator.has(client))
      throw new Error(client.name + " is trying to remove the password without creator privileges")
    channel.password = "";
    for (const cli of channel.clients.values())
      channel.passwordEntered.delete(cli);
    const packet = msg("rmpassword", {
      channel: channel.name,
      message: "🔓 Password has been removed on " + channel.name
    })
    this.sendToAll(channel, packet);
  }

  @SubscribeMessage("invite")
  oninvite(socket: WebSocket, data: {
    channel: string,
    message: string
  }) {
    const client = this.clients.get(socket)

    if (!data.channel)
      throw new Error("Empty channel string")

    const channel = this.getChannelByName(data.channel)
    if (!channel)
      throw new Error("Channel do not exists")

    if (!channel.creator.has(client))
      throw new Error(client.name + " is trying to invite someone in the channel without creator privileges")
    if (!channel.private)
      throw new Error(client.name + " just tried to invite someone in the channel but it is a public channel")
    const messageSplit = data.message.split(" ");
    if (messageSplit.length != 2)
      throw new Error(client.name + " just tried to invite someone with the wrong format")
    const target = this.names.get(messageSplit[1]);
    if (!target || !this.clients.has(target.socket))
      throw new Error(client.name + " is trying to invite " + messageSplit[1] + " which does not seems to exists")
    if (channel.clients.has(target))
      throw new Error(client.name + " tried to invite " + target.name + " to join the channel, but this person is already in the channel")
    const packet = msg("invite", {
      channel: channel.name,
      message: "👐 " + target.name + " has been invited to join the channel"
    })
    this.sendToAll(channel, packet);
    target.socket.send(msg("invite", {
      channel: channel.name,
      message: "👐 " + client.name + " invited you to join the channel [" + channel.name + "]"
    }))
    channel.pending.add(target);
    this.sendChannelsAll()
  }

  @SubscribeMessage("private")
  onprivate(socket: WebSocket, data: {
    channel: string
  }) {
    const client = this.clients.get(socket)

    if (!data.channel)
      throw new Error("Empty channel string")

    const channel = this.getChannelByName(data.channel)
    if (!channel)
      throw new Error("Channel do not exists")

    if (!channel.creator.has(client))
      throw new Error(client.name + " is trying to privatize channel without creator privileges")
    if (channel.private)
      throw new Error(client.name + " just tried to privatize the channel but it is already privatized")
    channel.private = true;
    const packet = msg("private", {
      channel: channel.name,
      message: "🔒 Channel is now private"
    })
    this.sendToAll(channel, packet);
    this.sendChannelsAll()
  }


  @SubscribeMessage("public")
  onpublic(socket: WebSocket, data: {
    channel: string
  }) {
    const client = this.clients.get(socket)

    if (!data.channel)
      throw new Error("Empty channel string")

    const channel = this.getChannelByName(data.channel)
    if (!channel)
      throw new Error("Channel do not exists")

    if (!channel.creator.has(client))
      throw new Error(client.name + " is trying to make channel public without creator privileges")
    if (!channel.private)
      throw new Error(client.name + " just tried to make channel public but it is already public")
    channel.private = false;
    const packet = msg("public", {
      channel: channel.name,
      message: "🔓 Channel is now public"
    })
    this.sendToAll(channel, packet);
    this.sendChannelsAll()
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

    if (!channel.creator.has(client))
      throw new Error(client.name + " is trying to add a password without creator privileges")
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
      client.socket.send(msg("wrongPwd", {
        channel: channel.name,
        message: "📛 Wrong password, try again."
      }))
      throw new Error("Wrong password")
    }
    channel.passwordEntered.add(client);
    for (const cli of channel.clients.values())
      channel.passwordEntered.add(cli);
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
    if (!target || !channel.clients.has(target))
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
    this.sendChannelsAll()
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
    if (messageSplit.length != 3) {
      client.socket.send(msg("banFormat", {
        channel: channel.name,
        message: "❗ Please enter '/ban NAME DURATIONINSECONDS' to ban someone in the channel"
      }))
      throw new Error(client.name + " just tried to ban with the wrong format")
    }

    if (!channel.admins.has(client))
      throw new Error(client.name + " is trying to ban " + messageSplit[1] + " without admin privileges")

    const target = this.names.get(messageSplit[1]);
    if (!target || !channel.clients.has(target))
      throw new Error(client.name + " is trying to ban " + messageSplit[1] + " which is not member of the channel")
    if (channel.admins.has(target))
      throw new Error(client.name + " is trying to ban " + messageSplit[1] + " which is admin of the channel")
    if (target == client)
      throw new Error(client.name + " is trying to ban himself")

    if (!(/^\d+$/.test(messageSplit[2]))) {
      client.socket.send(msg("banFormat", {
        channel: channel.name,
        message: "❗ Please enter '/ban NAME DURATIONINSECONDS' to ban someone in the channel"
      }))
      throw new Error(client.name + " just tried to ban with the wrong format")
    }
    const duration = Number(messageSplit[2])
    const packet = msg("banned", {
      channel: channel.name,
      message: "🤫 " + messageSplit[1] + " has been banned from " + channel.name + " during " + (duration).toString() + " seconds"
    })
    this.sendToAll(channel, packet);
    target.banned = Date.now() + (duration * 1000);
    channel.clients.delete(target);
    this.sendChannelsAll()
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
    if (target == client)
      throw new Error(client.name + " is trying to unban himself")
    const packet = msg("unbanned", {
      channel: channel.name,
      message: "😎 " + messageSplit[1] + " has been unbanned from " + channel.name
    })
    this.sendToAll(channel, packet);
    target.socket.send(msg("unbanned", {
      channel: channel.name,
      message: "😎 you have been unbanned from " + channel.name
    }))
    target.banned = undefined
  }

  @SubscribeMessage("block")
  onblock(socket: WebSocket, data: {
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
    if (messageSplit.length != 2) {
      client.socket.send(msg("blockFormat", {
        channel: channel.name,
        message: "❗ Please enter '/block NAME' to block someone"
      }))
      throw new Error(client.name + " just tried to block with the wrong format")
    }
    const target = this.names.get(messageSplit[1]);
    if (!target || !this.clients.has(target.socket))
      throw new Error(client.name + " is trying to block " + messageSplit[1] + " which does not exists")
    if (target == client)
      throw new Error(client.name + " is trying to block himself")
    if (client.blockeds.has(target))
      throw new Error(client.name + " is trying to block " + messageSplit[1] + " which is already blocked")
    if (!target || channel.admins.has(target))
      throw new Error(client.name + " is trying to block " + messageSplit[1] + " which is admin of the channel")
    socket.send(msg("blocked", {
      channel: channel.name,
      message: "❌ You blocked " + messageSplit[1]
    }))
    client.blockeds.add(target);
  }

  @SubscribeMessage("unblock")
  onunblock(socket: WebSocket, data: {
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
    if (messageSplit.length != 2) {
      client.socket.send(msg("unblockFormat", {
        channel: channel.name,
        message: "❗ Please enter '/unblock NAME' to unblock someone"
      }))
      throw new Error(client.name + " just tried to block with the wrong format")
    }
    const target = this.names.get(messageSplit[1]);
    if (!this.clients.has(target.socket))
      throw new Error(client.name + " is trying to unblock " + messageSplit[1] + " which does not exists")
    if (target == client)
      throw new Error(client.name + " is trying to unblock himself")
    if (!client.blockeds.has(target))
      throw new Error(client.name + " is trying to unblock " + messageSplit[1] + " which is not blocked")
    socket.send(msg("unblocked", {
      channel: channel.name,
      message: "🗣️ You unblocked " + messageSplit[1]
    }))
    client.blockeds.delete(target);
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
    if (messageSplit.length != 3) {
      client.socket.send(msg("muteFormat", {
        channel: channel.name,
        message: "❗ Please enter '/mute NAME DURATIONINSECONDS' to mute someone in the channel"
      }))
      throw new Error(client.name + " just tried to mute with the wrong format")
    }

    if (!channel.admins.has(client))
      throw new Error(client.name + " is trying to mute " + messageSplit[1] + " without admin privileges")

    const target = this.names.get(messageSplit[1]);
    if (!target || !channel.clients.has(target))
      throw new Error(client.name + " is trying to mute " + messageSplit[1] + " which is not member of the channel")
    if (channel.admins.has(target))
      throw new Error(client.name + " is trying to mute " + messageSplit[1] + " which is admin of the channel")
    if (target == client)
      throw new Error(client.name + " is trying to mute himself")

    if (!(/^\d+$/.test(messageSplit[2]))) {
      client.socket.send(msg("muteFormat", {
        channel: channel.name,
        message: "❗ Please enter '/mute NAME DURATIONINSECONDS' to mute someone in the channel"
      }))
      throw new Error(client.name + " just tried to mute with the wrong format")
    }
    const duration = Number(messageSplit[2])
    const packet = msg("muted", {
      channel: channel.name,
      message: "🤫 " + messageSplit[1] + " has been muted from " + channel.name + " during " + (duration).toString() + " seconds"
    })
    this.sendToAll(channel, packet);
    target.muted = Date.now() + (duration * 1000);
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
    if (!target || !channel.clients.has(target))
      throw new Error(client.name + " is trying to unmute " + messageSplit[1] + " which is not member of the channel")
    if (target == client)
      throw new Error(client.name + " is trying to unmute himself")
    const packet = msg("unmuted", {
      channel: channel.name,
      message: "🗣️ " + messageSplit[1] + " has been unmuted from " + channel.name
    })
    this.sendToAll(channel, packet);
    target.muted = undefined;
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
    if (!target || !channel.clients.has(target))
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
    if (!target || !channel.clients.has(target))
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
      message: "👨‍🎓\n/leave \n/kick [NAME]\n/ban [NAME] [DURATION]\n/unban [NAME]\n/mute [NAME] [DURATION]\n/unmute [NAME]\n/block [name]\n/unblock [name]\n/admin [NAME]\n/rmadmin [NAME]\n/password [PASS]\n/rmpassword\n/putpassword [PASS]\n/msg [NAME] [MESSAGE]",
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
    if (messageSplit.length < 3) {
      client.socket.send(msg("pmsgError", {
        channel: channel.name,
        message: "❗ Please enter '/msg NAME MESSAGE' to send a private message"
      }))
      throw new Error("Wrong format for private msg")
    }
    const target = this.names.get(messageSplit[1]);
    if (!target || !channel.clients.has(target))
      throw new Error(client.name + " is trying to send a private message to " + messageSplit[1] + " which is not member of the channel")
    if (client == target)
      throw new Error(client.name + " is trying to send a private message to himself.")

    const content = messageSplit.slice(2).join(' ');
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