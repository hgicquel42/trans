import { useSocket } from "libs/socket/connect"
import { useEffect } from "react"

export default function Page() {
  const { socket, send, listen } = useSocket("/game")

  useEffect(() => {
    if (!socket) return
    send("wait")

    return listen("wait", console.log, console.error)!
  }, [socket])

  return <>

  </>
}