import { Layout } from "comps/layout/layout";
import { useStatic } from "libs/react/object";
import { useSocket } from "libs/socket/connect";
import { useCallback, useEffect, useState } from "react";
import { AiFillLock } from 'react-icons/ai';
import { IoSend } from 'react-icons/io5';

function ChatList(props: { hover: string }) {
  return (
    <>
      <div className={`${props.hover} duration-300`}>
        <div className="h-[15px]"></div>
        <tr>
          <td className="w-3/5 font-pixel text-zinc-800 text-sm pl-4 pb-2 border-b-2 border-opposite">
            #Chat 1
          </td>
          <td className="pl-6 border-b-2 text-zinc-800 border-opposite w-24">
            <AiFillLock />
          </td>
          <td className="pl-4 border-b-2 border-opposite" />
        </tr>
      </div>
    </>
  )
}

function MyMessage(props: { name: string, msg: string }) {
  return (
    <>
      <div className="h-[25px]" />
      <div className="flex justify-start pl-4">
        <div className=" bg-zinc-100 rounded shadow-xl py-2 px-3 max-w-md">
          <p className="font-pixel text-blue-500">{props.name} :</p>
          <p className="text-zinc-800">{props.msg}</p>
        </div>
      </div>
    </>
  )
}

function OtherMessage(props: { name: string, msg: string, color: string }) {
  return (
    <>
      <div className="h-[25px]" />
      <div className="flex justify-end pr-4">
        <div className=" bg-zinc-100 rounded shadow-xl py-2 px-3 max-w-md">
          <p className={`font-pixel ${props.color}`}>{props.name} :</p>
          <p className="text-zinc-800">{props.msg}</p>
        </div>
      </div>
    </>
  )
}

function SystemMessage(props: { msg: string }) {
  return (
    <>
      <div className="h-[25px]" />
      <div className="flex justify-center">
        <div className=" bg-yellow-300 rounded shadow-xl py-2 px-3 max-w-md">
          <p className={`font-pixel text-zinc-800`}>System :</p>
          <p className="font-mono text-sm text-zinc-800">{props.msg}</p>
        </div>
      </div>
    </>
  )
}

function InputMessage() {
  return (
    <>
      <div className="bg-contrast px-4 py-4 border-t-2 border-opposite flex justify-center">
        <div className="flex-1 mx-4">
          <input className="relative text-zinc-800 w-full border-2 border-opposite rounded px-2 py-2" type={"text"} placeholder="Your Message">
          </input>
        </div>
        <button>
          <IoSend className="text-3xl text-zinc-800" />
        </button>
      </div>
    </>
  )
}

function Chat() {
  const { socket, send } = useSocket("/chat")

  const [channels, setChannels] = useState([]);

  const [channelChoosen, setChannelChoosen] = useState("");

  const messages = useStatic(() => {
    return new Map<string, {
      messages: {
        nickname: string,
        message: string
      }[]
    }>()
  })

  const [lol, setLol] = useState(0)

  function newMessage(channel: string, nick: string, msg: string) {
    console.log(msg)
    const old = messages.get(channel)
    const oldMessages = old ? old.messages : []
    messages.set(channel, {
      messages: [...oldMessages,
      {
        nickname: nick,
        message: msg
      }]
    });
    setLol(x => x + 1)
  }

  useEffect(() => {
    if (!socket) return
    const cmds = ["kicked", "banned", "unbanned", "muted", "unmuted", "admin", "rmadmin", "password", "rmpassword"]
    const f = (e: MessageEvent) => {
      const eventObject = JSON.parse(e.data);
      if (eventObject.event === "channels") {
        setChannels(eventObject.data);
      }
      else if (eventObject.event === "join") {
        console.log("join bien recu");
        //todo "NOMCLIENT joined NOMCHANNEL"
      }
      else if (eventObject.event === "message")
        newMessage(eventObject.data.channel, eventObject.data.nickname, eventObject.data.message);
      else if (cmds.includes(eventObject.event))
        newMessage(eventObject.data.channel, "system", eventObject.data.message); //toutes les cmds
      else
        console.log("Non identified event received");
    }
    socket.addEventListener("message", f)
    return () => socket.removeEventListener("message", f)
  }, [socket])

  const sendMessage = useCallback((channelName, content) => {
    send("message", { channel: channelName, message: content })
  }, [socket])

  const createChannel = useCallback((channelName) => {
    send("join", {
      channel: channelName
    })
  }, [socket])

  useEffect(() => {
    send("channels");
  })

  return (
    <>
      <div className=" bg-contrast border-x-2 border-opposite flex flex-col overflow-y-auto">
        <div className="h-[54px] text-center pt-4 font-pixel border-b-2 border-opposite text-zinc-800">
          CHAT LIST
        </div>
        <ChatList hover={'hover:bg-red-600'} />
        <ChatList hover={'hover:bg-blue-600'} />
        <ChatList hover={'hover:bg-yellow-600'} />
        <ChatList hover={'hover:bg-emerald-600'} />
      </div>
      <div className="bg-contrast h-full flex flex-col overflow-y-auto">
        <div className="h-[78px] text-center pt-4 font-pixel border-b-2 border-opposite text-zinc-800 bg-contrast">
          #Chat 1
        </div>
        <div className="overflow-y-auto grow">
          <div className="flex justify-center pt-4">
            <div className="rounded text-center font-pixel bg-contrast pt-4 w-64 h-12 text-zinc-800 shadow-xl">
              25 / 06 / 2022
            </div>
          </div>
          <SystemMessage msg={'You are now log in #Chat 1 as Piamias, Welcome !'} />
          <MyMessage msg={"Qui accedunt proxime sunt vita exempla nihil memoriam de de iis concedere res quibus oculos."} name={"Piamias"} />
          <OtherMessage msg={"Qui accedunt proxime sunt vita exempla nihil memoriam de de iis concedere res quibus oculos."} color={"text-red-500"} name={"Bryce"} />
          <OtherMessage msg={"Qui accedunt proxime sunt vita exempla nihil memoriam de de iis concedere res quibus oculos."} color={"text-emerald-500"} name={"Hugo"} />
          <MyMessage msg={"Qui accedunt proxime sunt vita exempla nihil memoriam de de iis concedere res quibus oculos."} name={"Piamias"} />
          <OtherMessage msg={"Qui accedunt proxime sunt vita exempla nihil memoriam de de iis concedere res quibus oculos."} color={"text-yellow-500"} name={"Abdou"} />
          <MyMessage msg={"Qui accedunt proxime sunt vita exempla nihil memoriam de de iis concedere res quibus oculos."} name={"Piamias"} />
          <div className="h-[25px]" />
        </div>
        <InputMessage />
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