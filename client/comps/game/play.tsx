import { SocketHandle } from "libs/socket/connect"
import { useEffect, useRef } from "react"
import { Game } from "./game"
import { PlayerData } from "./player"

export function Play(props: {
  gameID: string,
  socket: SocketHandle,
  alpha?: PlayerData
  beta?: PlayerData
}) {
  const { gameID, socket, alpha, beta } = props

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
    socket={socket}
    alpha={alpha}
    beta={beta} />
}