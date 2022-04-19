import { Game } from "comps/game/game"
import { Layout } from "comps/layout/layout"
import { Anchor } from "comps/next/anchor"
import { SocketHandle, useSocket } from "libs/socket/connect"
import { useCallback, useEffect, useRef, useState } from "react"

export default function Page() {
  const socket = useSocket("/game")

  const [status, setStatus] = useState<string>()

  useEffect(() => {
    return socket.listen("status", setStatus)
  }, [socket.listen])

  const [gameID, setGameID] = useState<string>()

  useEffect(() => {
    return socket.listen("gameID", setGameID)
  }, [socket.listen])

  const play = useCallback(() => {
    socket.send("wait")
  }, [socket.send])

  useEffect(() => {
    play()
  }, [play])

  return <Layout>
    {(() => {
      if (!socket.socket)
        return <Connect />
      if (status === "waiting")
        return <Wait />
      if (status === "joined")
        return <Play
          gameID={gameID!}
          socket={socket} />
      if (status === "closed")
        return <Closed play={play} />
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

function Wait() {
  return <>
    <div className="h-[100px]" />
    <div className="text-center">
      <h1 className="font-pixel font-semibold text-3xl leading-4 tracking-wider text-opposite">
        SEARCHING FOR PLAYER
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

function Closed(props: {
  play(): void
}) {
  const { play } = props

  return <>
    <div className="h-[100px]" />
    <h1 className="font-pixel text-4xl text-center">Opponent Has Left The Game...</h1>
    <div className="h-[100px]" />
    <div className='flex justify-around'>
      <a className="bg-zinc-800 flex flex-col text-center h-20 w-80 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform"
        onClick={play}>
        <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Search New Match</div>
      </a>
      <div className="h-[50px]" />
      <Anchor className="bg-zinc-800 flex flex-col text-center h-20 w-80 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform"
        href="/lobby">
        <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Return To Lobby</div>
      </Anchor>
    </div>
  </>
}

function Play(props: {
  gameID: string,
  socket: SocketHandle
}) {
  const { gameID, socket } = props

  const keys = useRef({ up: false, down: false })

  useEffect(() => {
    function onkeydown(e: KeyboardEvent) {
      e.preventDefault()
      if (e.key === "ArrowUp")
        keys.current.up = true
      if (e.key === "ArrowDown")
        keys.current.down = true
      socket.send("keys", keys.current)
    }

    function onkeyup(e: KeyboardEvent) {
      e.preventDefault()
      if (e.key === "ArrowUp")
        keys.current.up = false
      if (e.key === "ArrowDown")
        keys.current.down = false
      socket.send("keys", keys.current)
    }

    addEventListener("keydown", onkeydown)
    addEventListener("keyup", onkeyup)

    return () => {
      removeEventListener("keydown", onkeydown)
      removeEventListener("keyup", onkeyup)
    }
  }, [socket.send])

  return <Game
    gameID={gameID}
    socket={socket} />
}
