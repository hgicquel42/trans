import { Game } from "comps/game/game"
import { Layout } from "comps/layout/layout"
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
  return <>{`Connexion au serveur...`}</>
}

function Wait() {
  return <>{`En attente d'un joueur...`}</>
}

function Closed(props: {
  play(): void
}) {
  const { play } = props

  return <>
    <div>{`L'adversaire a quitté la game`}</div>
    <div className="my-2" />
    <button className="border-8 p-4 border-green-500"
      onClick={play}>
      Rechercher une partie
    </button>
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
