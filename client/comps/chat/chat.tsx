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

  return (
    <>
      <div className={channel == channelChoosen ? "duration-300" : ""} onClick={onChoose}>
        <div className="h-[15px]" />
        <tr>
          <td className="w-3/5 font-pixel text-sm pl-4 pb-2 border-b-2 border-opposite">
            {props.channel}
          </td>
          <td className="pl-6 border-b-2 border-opposite w-24">
          </td>
          <td className="pl-4 border-b-2 border-opposite" />
        </tr>
      </div>
    </>
  )
}

export function CreateChannel(props: {
  createChannel(chan: string): void
}) {
  const { createChannel } = props

  const onEnter = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return
    createChannel(e.currentTarget.value)
    e.currentTarget.value = ""
  }, [])

  return <div className="py-4 border-t-2 border-opposite flex justify-center">
    <div className="flex-1 mx-4">
      <input className="z-10 relative w-full border-2 border-opposite bg-transparent rounded px-2 py-2"
        type="text" placeholder="Channel name"
        onKeyDown={onEnter} />
    </div>
  </div>
}

export function MyMessage(props: {
  name: string,
  message: string
}) {
  return <div className="flex justify-end">
    <div className="bg-contrast rounded shadow-xl py-2 px-3 max-w-md">
      <p className="font-pixel text-blue-500">{props.name} :</p>
      <p className="pt-2 whitespace-pre-line">{props.message}</p>
    </div>
  </div>
}

export function OtherMessage(props: {
  name: string,
  message: string,
}) {
  return <div className="flex justify-start">
    <div className="bg-contrast rounded shadow-xl py-2 px-3 max-w-md">
      <DropdownChatButton
        name={props.name}
        color="text-red-600"
        admin={true} />
      <p className="pt-2 whitespace-pre-line">{props.message}</p>
    </div>
  </div>
}

export function OtherPrivateMessage(props: {
  name: string,
  message: string
}) {
  const head = 'from ' + props.name

  return <div className="flex justify-start pl-4">
    <div className="bg-contrast rounded shadow-xl py-2 px-3 max-w-md border-4 border-dotted border-black">
      <DropdownChatButton name={head} color={"text-red-600"} admin={true} />
      <p className="pt-2 whitespace-pre-line">{props.message}</p>
    </div>
  </div>
}

export function MyPrivateMessage(props: {
  name: string,
  message: string
}) {
  const head = 'to ' + props.name

  return <div className="flex justify-end">
    <div className=" bg-contrast rounded shadow-xl py-2 px-3 max-w-md border-4 border-dotted border-black">
      <DropdownChatButton name={head} color={"text-blue-600"} admin={true} />
      <p className="pt-2 whitespace-pre-line">{props.message}</p>
    </div>
  </div>
}

export function InviteMessage(props: {
  name: string,
  channel: string
}) {
  return <div className="flex justify-center">
    <div className="bg-yellow-400 border-4 border-dashed rounded shadow-xl py-2 px-3 max-w-md">
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
}

export function SystemMessage(props: { msg: string }) {
  return <div className="flex justify-center">
    <div className=" bg-blue-400 rounded shadow-xl py-2 px-3 max-w-md">
      <p className={`font-pixel text-zinc-800`}>System :</p>
      <p className="font-mono text-sm pt-2 text-zinc-800 whitespace-pre-line">
        {props.msg}
      </p>
    </div>
  </div>
}

export function InputMessage(props: {
  sendMessage(message: string): void,
  help: boolean
}) {
  const { sendMessage } = props;

  const [message, setMessage] = useState<string>();

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

  return <div className="px-4 py-4 border-t-2 border-opposite flex justify-center">
    {props.help === true &&
      <button
        className="rounded-full px-1 py-1"
        onClick={help}>
        <MdOutlineHelp className="text-4xl" />
      </button>}
    <div className="flex-1 mx-4">
      <input className="relative text-zinc-800 w-full border-2 border-opposite rounded px-2 py-2"
        type="text" placeholder="An awesome message"
        value={message} onChange={updateMessage}
        onKeyDown={onEnter}>
      </input>
    </div>
    <button onClick={send}>
      <IoSend className="text-3xl" />
    </button>
  </div>
}