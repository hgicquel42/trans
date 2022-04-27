import { SocketHandle } from "libs/socket/connect"
import { useEffect, useRef } from "react"
import { Game } from "./game"

export function Play(props: {
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