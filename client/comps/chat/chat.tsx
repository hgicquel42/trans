import { Modal } from "comps/modal/modal";
import { DropdownChatButton } from "comps/profil/profil";
import { ChangeEvent, KeyboardEvent, useCallback, useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { IoSend } from 'react-icons/io5';
import { MdOutlineHelp } from 'react-icons/md';

export function ChatList(props: { channelChoosen: string, channel: string, setChannelChoosen(chan: string): void, createChannel(chan: string): void }) {
	const { channelChoosen, channel, setChannelChoosen, createChannel } = props;

	const onChoose = useCallback(() => {
		setChannelChoosen(channel)
		createChannel(channel)
	}, [setChannelChoosen, channel])

	console.log('test')
	return (
		<>
			<div className={channel == channelChoosen ? "bg-contrast duration-300" : ""} onClick={onChoose}>
				<div className="h-[15px]" />
				<tr>
					<td className="w-3/5 font-pixel text-zinc-800 text-sm pl-4 pb-2 border-b-2 border-opposite">
						{props.channel}
					</td>
					<td className="pl-6 border-b-2 text-zinc-800 border-opposite w-24">
					</td>
					<td className="pl-4 border-b-2 border-opposite" />
				</tr>
			</div>
		</>
	)
}

export function CreateChannel(props: { createChannel(chan: string): void }) {
	const [create, setCreate] = useState(false)

	const toggleCreateChannel = useCallback(() => {
		setCreate(create => !create)
	}, [])
	if (create) {
		return <>
			<div className="bg-contrast py-4 border-t-2 border-opposite flex justify-center">
				<Modal>
					<div className="absolute inset-0"
						onClick={toggleCreateChannel} />
				</Modal>
				<div className="flex-1 mx-4">
					<input className="z-10 relative text-zinc-800 w-full border-2 border-opposite rounded px-2 py-2" type={"text"} placeholder="Your Chat"
						onKeyDown={e => {
							if (e.key === "Enter")
								props.createChannel(e.currentTarget.value)
						}} />
				</div>
			</div>
		</>
	}
	else {
		return <>
			<button className="bg-contrast px-4 py-4 border-t-2 border-opposite flex justify-center h-[78px] pt-7 text-xl hover:underline"
				onClick={toggleCreateChannel}>
				<tr>
					<td className="w-4/5 font-pixel text-zinc-800 pb-2">
						Create Chat
					</td>
				</tr>
			</button>
		</>
	}

}

export function MyMessage(props: { name: string, msg: string }) {
	return (
		<>
			<div className="h-[25px]" />
			<div className="flex justify-end pr-4">
				<div className=" bg-zinc-100 rounded shadow-xl py-2 px-3 max-w-md">
					<p className="font-pixel text-blue-500">{props.name} :</p>
					<p className="text-zinc-800 pt-2 whitespace-pre-line">{props.msg}</p>
				</div>
			</div>
		</>
	)
}

export function OtherMessage(props: { name: string, msg: string, color: string }) {
	return (
		<>
			<div className="h-[25px]" />
			<div className="flex justify-start pl-4 ">
				<div className=" bg-zinc-100 rounded shadow-xl py-2 px-3 max-w-md">
					<DropdownChatButton name={props.name} color={props.color} admin={true} />
					<p className="text-zinc-800 pt-2 whitespace-pre-line">{props.msg}</p>
				</div>
			</div>
		</>
	)
}

export function OtherPrivateMessage(props: { name: string, msg: string }) {

	const head = 'from ' + props.name
	return <>
		<>
			<div className="h-[25px]" />
			<div className="flex justify-start pl-4 ">
				<div className=" bg-zinc-100 rounded shadow-xl py-2 px-3 max-w-md border-4 border-dotted border-black">
					<DropdownChatButton name={head} color={"text-red-600"} admin={true} />
					<p className="text-zinc-800 pt-2 whitespace-pre-line">{props.msg}</p>
				</div>
			</div>
		</>
	</>
}

export function MyPrivateMessage(props: { name: string, msg: string }) {

	const head = 'to ' + props.name
	return <>
		<>
			<div className="h-[25px]" />
			<div className="flex justify-end pr-4 ">
				<div className=" bg-zinc-100 rounded shadow-xl py-2 px-3 max-w-md border-4 border-dotted border-black">
					<DropdownChatButton name={head} color={"text-blue-600"} admin={true} />
					<p className="text-zinc-800 pt-2 whitespace-pre-line">{props.msg}</p>
				</div>
			</div>
		</>
	</>
}

export function InviteMessage(props: { name: string, channel: string }) {
	return (
		<>
			<div className="h-[25px]" />
			<div className="flex justify-center">
				<div className=" bg-yellow-400 border-4 border-dashed rounded shadow-xl py-2 px-3 max-w-md">
					<p className={`font-pixel text-zinc-800`}>System :</p>
					<p className="font-mono text-sm pt-2 text-zinc-800 whitespace-pre-line">
						{props.name} invite you in {props.channel}
					</p>
					<div className="pt-2 flex justify-center">
						<button>
							<BsCheckLg className="text-xl hover:text-green-600" />
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export function SystemMessage(props: { msg: string }) {
	return (
		<>
			<div className="h-[25px]" />
			<div className="flex justify-center">
				<div className=" bg-blue-400 rounded shadow-xl py-2 px-3 max-w-md">
					<p className={`font-pixel text-zinc-800`}>System :</p>
					<p className="font-mono text-sm pt-2 text-zinc-800 whitespace-pre-line">
						{props.msg}
					</p>
				</div>
			</div>
		</>
	)
}

export function InputMessage(props: { sendMessage(message: string): void, help: boolean }) {
	const { sendMessage } = props;

	const [message, setMessage] = useState<string>();

	console.log(props.help)

	const updateMessage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setMessage(e.currentTarget.value)
	}, [])

	const send = useCallback(() => {
		if (!message) return
		sendMessage(message);
		setMessage("")
	}, [message, sendMessage])

	const help = useCallback(() => {
		sendMessage("/help")
		setMessage("")
	}, [message, sendMessage])

	const onEnter = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") send()
	}, [send, message])

	return (
		<>
			<div className="bg-contrast px-4 py-4 border-t-2 border-opposite flex justify-center">
				{props.help === true &&
					<button
						className="rounded-full px-1 py-1"
						onClick={help}>
						<MdOutlineHelp className="text-4xl" />
					</button>}
				<div className="flex-1 mx-4">
					<input className="relative text-zinc-800 w-full border-2 border-opposite rounded px-2 py-2" type={"text"} placeholder="Your Message"
						value={message}
						onChange={updateMessage}
						onKeyDown={onEnter}>
					</input>
				</div>
				<button onClick={send}>
					<IoSend className="text-3xl text-zinc-800" />
				</button>
			</div>
		</>
	)
}