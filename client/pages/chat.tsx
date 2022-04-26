import { Layout } from "comps/layout/layout";
import { useProfile } from "comps/profil/context";
import { useStatic } from "libs/react/object";
import { useSocket } from "libs/socket/connect";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { ImCross } from "react-icons/im";
import { ChatList, CreateChannel, InputMessage, MyMessage, MyPrivateMessage, OtherMessage, OtherPrivateMessage, SystemMessage } from "../comps/chat/chat";

interface Message {
	channel: string,
	private?: boolean,
	sender?: boolean,
	nickname: string,
	message: string
}

function Chat() {
	const { socket, send, listen } = useSocket("/chat")

	const [channels, setChannels] = useState([]);

	const [channelChoosen, setChannelChoosen] = useState("");

	const [nickname, setNickname] = useState("")

	const d = new Date()

	const profile = useProfile()

	const allMessages = useStatic(
		() => new Map<string, Message[]>())
	const [messages, setMessages] =
		useState<Message[]>([])

	const onmessage = useCallback((data: Message) => {
		const messages = allMessages.has(data.channel)
			? allMessages.get(data.channel)!
			: []
		messages.push(data)
		if (data.channel === channelChoosen)
			setMessages([...messages])
		allMessages.set(data.channel, messages)
	}, [channelChoosen])

	useEffect(() => {
		if (!socket) return

		const cmds = ["help", "muteFormat", "private", "public", "invite", "notInvitedButTry", "blockFormat", "blocked", "unblockFormat", "unblocked", "banFormat", "pmsgError", "joined", "kicked", "banned", "unbanned", "muted", "unmuted", "admin", "rmadmin", "password", "rmpassword", "noPwdButTry", "wrongPwd", "mutedButTry", "banButTry", "leave"]
		const f = (e: MessageEvent) => {
			const packet = JSON.parse(e.data);
			if (packet.event == "clientName") {
				const nickname = packet.data.nickname;
				if (nickname != "")
					setNickname(packet.data.nickname)
			}
			if (!cmds.includes(packet.event)) return
			onmessage({ ...packet.data, nickname: "system" });
		}
		socket.addEventListener("message", f)
		return () => socket.removeEventListener("message", f)
	}, [socket, onmessage])

	useEffect(() => {
		return listen("pmsg", onmessage)
	}, [listen, onmessage])

	const sendMessage = useCallback((message) => {
		const channel = channelChoosen;
		if (message == "/leave") {
			send("leave", { channel })
			setChannelChoosen("")
		}
		else if (message == "/rmpassword")
			send("rmpassword", { channel })
		else if (message == "/help")
			send("help", { channel, message })
		else if (message == "/private")
			send("private", { channel })
		else if (message == "/public")
			send("public", { channel })
		else if (message.startsWith("/invite "))
			send("invite", { channel, message })
		else if (message.startsWith("/password "))
			send("password", { channel, message })
		else if (message.startsWith("/putpassword "))
			send("putpassword", { channel, message })
		else if (message.startsWith("/kick "))
			send("kick", { channel, message })
		else if (message.startsWith("/ban "))
			send("ban", { channel, message })
		else if (message.startsWith("/unban "))
			send("unban", { channel, message })
		else if (message.startsWith("/mute "))
			send("mute", { channel, message })
		else if (message.startsWith("/unmute "))
			send("unmute", { channel, message })
		else if (message.startsWith("/admin "))
			send("admin", { channel, message })
		else if (message.startsWith("/rmadmin "))
			send("rmadmin", { channel, message })
		else if (message.startsWith("/msg "))
			send("msg", { channel, message })
		else if (message.startsWith("/block "))
			send("block", { channel, message })
		else if (message.startsWith("/unblock "))
			send("unblock", { channel, message })
		else
			send("message", { channel, message })
	}, [channelChoosen, send])

	const createChannel = useCallback((channel) => {
		send("join", { channel })
	}, [send])

	const leave = useCallback(() => {
		sendMessage("/leave")
	}, [sendMessage])

	useEffect(() => {
		return listen("channels", setChannels)
	}, [listen])

	useEffect(() => {
		send("channels")
	}, [send])

	useEffect(() => {
		return listen("message", onmessage)
	}, [listen, onmessage])

	const switchChannel = useCallback((channel: string) => {
		setChannelChoosen(channel)
		const messages = allMessages.has(channel)
			? allMessages.get(channel)!
			: []
		setMessages(messages)
	}, [])

	useEffect(() => {
		return listen("join", (data: { channel: string }) => switchChannel(data.channel))
	}, [listen])


	const messagesEndRef = useRef<HTMLDivElement | null>(null)

	const scrollToBottom = useCallback(() => {
		const e = messagesEndRef.current!
		e.scrollTo(0, e.scrollHeight)
	}, [])

	useEffect(() => {
		scrollToBottom()
	}, [messages]);


	return (
		<>
			<div className="bg-contrast border-x-2 border-opposite flex flex-col overflow-y-auto">
				<div className="h-[54px] text-center pt-4 font-pixel border-b-2 border-opposite text-zinc-800">
					CHAT LIST
				</div>
				<div className="grow">
					{channels.map((channel, i) =>
						<Fragment key={i}>
							<ChatList channelChoosen={channelChoosen} channel={channel} setChannelChoosen={switchChannel} createChannel={createChannel} />
						</Fragment>)}
				</div>
				<CreateChannel createChannel={createChannel} />
			</div>

			<div className="bg-contrast h-full flex flex-col overflow-y-auto">
				<div className="flex justify-between h-[54px] border-b-2 border-opposite text-zinc-800 bg-contrast">
					<div></div>
					<div className="text-center pt-4 pl-6 font-pixel text-zinc-800">
						{channelChoosen}
					</div>
					{channelChoosen !== "" ? <button className="text-center pt-1 pr-4 text-xl font-pixel text-zinc-800"
						onClick={leave}>
						<ImCross />
					</button>
						: <div></div>
					}
				</div>
				<div className="overflow-y-auto grow" ref={messagesEndRef}>
					<div className="flex justify-center pt-4">
						<div className="rounded text-center font-pixel bg-contrast pt-4 w-64 h-12 text-zinc-800 shadow-xl">
							{d.getDate()}/{d.getMonth()}/{d.getFullYear()}
						</div>
					</div>
					{channelChoosen && messages.map((msg, i) =>
						<Fragment key={i}>
							{(() => {
								if (msg.private === true) {
									if (msg.sender === true)
										return <MyPrivateMessage
											msg={msg.message}
											name={profile.username} />
									else if (msg.sender === false)
										return <OtherPrivateMessage
											msg={msg.message}
											name={msg.nickname} />
								}
								if (msg.nickname === "system")
									return <SystemMessage
										msg={msg.message} />
								if (msg.nickname === nickname)
									return <MyMessage
										msg={msg.message}
										name={profile.username} />
								return <OtherMessage
									msg={msg.message}
									name={msg.nickname}
									color={'text-red-600'} />
							})()}
						</Fragment>)}
					<div className="h-[25px]" />
				</div>
				<InputMessage sendMessage={sendMessage} help={channelChoosen !== ""} />
			</div>
		</>
	)
}

export default function Page() {
	return (
		<>
			<Layout>
				<div className='h-[50px]' />
				<div className="w-full text-center font-pixel text-4xl">pong.chat</div>
				<div className='h-[50px]' />
				<div className="w-full aspect-video border-8 border-opposite grid chat-layout">
					<Chat />
				</div>
			</Layout>
		</>
	)

}