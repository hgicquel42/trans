import { useSocket } from "libs/socket/connect"
import { useCallback, useEffect, useState } from "react"

export default function Page() {
  const { socket, send, listen } = useSocket("/game")

  const [status, setStatus] = useState<string>()

  useEffect(() => {
    if (socket) return listen("status", setStatus)!
  }, [socket])

  const play = useCallback(() => {
    if (socket) send("wait")
  }, [socket])

  useEffect(() => {
    if (socket) play()
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