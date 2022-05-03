import { Play } from "comps/game/play"
import { PlayerData } from "comps/game/player"
import { Layout } from "comps/layout/layout"
import { Anchor } from "comps/next/anchor"
import { SocketHandle, useSocket } from "libs/socket/connect"
import { asStringOr } from "libs/types/string"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Page() {
  const router = useRouter()
  const socket = useSocket("/game")

  const mode = asStringOr(router.query.mode, undefined)
  const type = asStringOr(router.query.type, undefined)
  const room = asStringOr(router.query.id, undefined)

  const [status, setStatus] = useState<string>()

  useEffect(() => {
    return socket.listen("status", setStatus)
  }, [socket.listen])

  const [roomID, setRoomID] = useState<string>()

  useEffect(() => {
    return socket.listen("roomID", setRoomID)
  }, [socket.listen])

  const [gameID, setGameID] = useState<string>()

  useEffect(() => {
    return socket.listen("gameID", setGameID)
  }, [socket.listen])

  useEffect(() => {
    if (socket.ready) socket.send("wait", { mode, type, room })
  }, [socket.ready, socket.send])

  const [alpha, setAlpha] = useState<PlayerData>()

  useEffect(() => {
    return socket.listen("alpha", setAlpha)
  }, [socket.listen])

  const [beta, setBeta] = useState<PlayerData>()

  useEffect(() => {
    return socket.listen("beta", setBeta)
  }, [socket.listen])

  const [winner, setWinner] = useState<PlayerData>()

  useEffect(() => {
    return socket.listen("winner", setWinner)
  }, [socket.listen])

  return <Layout>
    {(() => {
      if (!socket.socket)
        return <Connect />
      if (status === "waiting")
        return <Wait roomID={roomID} />
      if (status === "joined")
        return <Play
          gameID={gameID!}
          socket={socket}
          alpha={alpha}
          beta={beta} />
      if (status === "closed")
        return <Closed />
      if (status === "finished")
        return <Finished
          gameID={gameID!}
          socket={socket}
          alpha={alpha}
          beta={beta}
          winner={winner} />
      return null
    })()}
  </Layout>
}

function Connect() {
  return <>
    <div className="h-[100px]" />
    <div className="text-center">
      <h1 className="font-pixel font-semibold text-3xl leading-4 tracking-wider text-opposite">
        CONNECT TO SERVER
      </h1>
    </div>
    <div className="h-[25px]" />
    <div className=" flex justify-center items-center">
      <div className="h-24 flex items-center justify-center space-x-2">
        <div className="w-8 h-8 bg-special rounded-full animate-pulse"></div>
        <div className="w-8 h-8 bg-special  rounded-full animate-pulse animation-delay-300"></div>
        <div className="w-8 h-8 bg-special  rounded-full animate-pulse animation-delay-600"></div>
        <div className="w-8 h-8 bg-special  rounded-full animate-pulse animation-delay-900"></div>
      </div>
    </div>
    <div className="h-[25px]" />
    <div className="flex justify-center">
      <img className="w-96 h-96 animate-spin-slow" src="https://opengameart.org/sites/default/files/Pixel%20Earth.gif" />
    </div>
  </>
}

function Wait(props: {
  roomID?: string
}) {
  return <>
    <div className="h-[100px]" />
    <div className="text-center">
      <h1 className="font-pixel font-semibold text-3xl leading-4 tracking-wider text-opposite">
        SEARCHING FOR PLAYER
      </h1>
    </div>
    {props.roomID &&
      <div className='flex justify-center mt-4'>
        <a className="bg-zinc-800 flex flex-col text-center h-28 w-3/5 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double">
          <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">
            <p className="text-zinc-100 font-pixel">Invite your friends : </p>
            <input className="w-full text-center bg-transparent text-xl outline-none font-pixel pt-2"
              readOnly value={`${location.origin}/play?id=${props.roomID}`}
              onClick={e => e.currentTarget.select()} />
          </div>
        </a>
      </div>}
    <div className="h-[25px]" />
    <div className="flex justify-center items-center">
      <div className="h-24 flex items-center justify-center space-x-2">
        <div className="w-8 h-8 bg-special rounded-full animate-pulse"></div>
        <div className="w-8 h-8 bg-special  rounded-full animate-pulse animation-delay-300"></div>
        <div className="w-8 h-8 bg-special  rounded-full animate-pulse animation-delay-600"></div>
        <div className="w-8 h-8 bg-special  rounded-full animate-pulse animation-delay-900"></div>
      </div>
    </div>
    <div className="h-[25px]" />
    <div className="flex justify-center">
      <img className="w-96 h-96 animate-spin-slow" src="https://opengameart.org/sites/default/files/Pixel%20Earth.gif" />
    </div>
  </>
}

function Closed() {
  return <>
    <div className="h-[100px]" />
    <h1 className="font-pixel text-4xl text-center">Opponent Has Left The Game...</h1>
    <div className="h-[100px]" />
    <div className='flex justify-around'>
      <Anchor className="bg-zinc-800 flex flex-col text-center h-20 w-80 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform"
        href="/lobby">
        <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Return To Lobby</div>
      </Anchor>
    </div>
  </>
}

function Finished(props: {
  gameID: string,
  socket: SocketHandle
  alpha?: PlayerData
  beta?: PlayerData
  winner?: PlayerData
}) {
  const { winner, alpha, beta } = props

  return <>
    <div className="h-[100px]" />
    <div className='w-full'>
      <div className='flex flex-col justify-around items-center max-w-xs mx-auto bg-contrast shadow-xl rounded-xl px-12 py-12 '>
        <img src={winner?.avatar} className="w-48 h-48 rounded-full shadow-xl drop-shadow-xl hover:scale-105 duration-700" alt="" />
        <div className='text-center mt-8'>
          <p className='w-full border-opposite pt-2 pb-4 inline-block border-b-4'>
          </p>
          <div className="flex justify-around font-pixel text-4xl pt-6 text-zinc-800">
            <p>{alpha?.score ?? 0}</p>
            <p>-</p>
            <p>{beta?.score ?? 0}</p>
          </div>
          <p className='w-full border-opposite pt-2 pb-4 inline-block border-b-4'>
          </p>
          <div className="flex justify-around font-pixel text-4xl pt-6">
            <a className="bg-zinc-800 flex flex-col text-center h-20 w-48 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
              href="/lobby">
              <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Lobby</div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div className="h-[175px]" />
  </>
}

