import { useSocket } from "libs/socket/connect"
import { useEffect, useState } from "react"

export default function Page() {
  const { socket, send, listen } = useSocket("/game")

  const [status, setStatus] = useState<string>()

  useEffect(() => {
    if (!socket) return
    send("wait")

    function ondata(data: string) {
      setStatus(data)
    }

    return listen("wait", ondata)!
  }, [socket])

  return <>
    <div>{String(socket)}</div>
    <div>{String(status)}</div>
  </>
}