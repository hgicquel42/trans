import { Layout } from "comps/layout/layout";
import { useStatic } from "libs/react/object";
import { useSocket } from "libs/socket/connect";
import { useCallback, useEffect, useState } from "react";
import { ImCross } from 'react-icons/im';
import { ChatList, CreateChannel, InputMessage, MyMessage, OtherMessage, SystemMessage } from "../comps/chat/chat";


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
        <div className="grow">
          <ChatList hover={'hover:bg-red-600'} />
          <ChatList hover={'hover:bg-blue-600'} />
          <ChatList hover={'hover:bg-yellow-600'} />
          <ChatList hover={'hover:bg-emerald-600'} />
        </div>
        <CreateChannel />
      </div>

      <div className="bg-contrast h-full flex flex-col overflow-y-auto">
        <div className="h-[54px] text-center font-pixel border-b-2 border-opposite text-zinc-800 bg-contrast flex justify-between">
          <td></td>
          <td className="mt-4 mb-4">
            #Chat 1
          </td>
          <td className="mt-3 mr-4 text-2xl">
            <button className="hover:text-red-600 duration-500">
              <ImCross></ImCross>
            </button>
          </td>
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