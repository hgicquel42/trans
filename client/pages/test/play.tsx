import { useSocket } from "libs/socket/connect"
import { useCallback, useEffect, useState } from "react"

export default function Page() {
  const socket = useSocket("/game")

  const [status, setStatus] = useState<string>()

  useEffect(() => {
    return socket.listen("status", setStatus)!
  }, [socket])

  const play = useCallback(() => {
    socket.send("wait")
  }, [socket])

  useEffect(() => {
    if (socket.socket) play()
  }, [socket])

  return <>
    <div>
      Status: {String(status)}
    </div>
    {status === "closed" &&
      <button onClick={play}>
        Play again
      </button>}
  </>
}