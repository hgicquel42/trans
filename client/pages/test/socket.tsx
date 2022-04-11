import { useCallback, useEffect, useState } from "react";

async function connect() {
  return await new Promise<WebSocket>((ok, err) => {
    const socket = new WebSocket("ws://localhost:3001/")
    socket.onopen = () => ok(socket)
    socket.onerror = (e) => err(e)
  })
}

export default function Page() {
  const [socket, setSocket] = useState<WebSocket>()
  const [error, setError] = useState<ErrorEvent>()

  const tryConnect = useCallback(async () => {
    try {
      setSocket(await connect())
    } catch (e: unknown) {
      if (!(e instanceof ErrorEvent))
        throw e
      setTimeout(tryConnect, 5000)
      console.error(e)
      setError(e)
    }
  }, [])

  useEffect(() => {
    tryConnect()
  }, [])

  const [data, setData] = useState<any>()

  useEffect(() => {
    if (!socket) return
    const f = (e: MessageEvent) => console.log(e.data)
    socket.addEventListener("message", f)
    return () => socket.removeEventListener("message", f)
  }, [socket])

  const test = useCallback(() => {
    if (!socket) return
    socket.send(JSON.stringify({ event: "message", data: "lol" }))
  }, [socket])

  return <>
    <div>
      lol: {String(socket)}
    </div>
    <button onClick={test}>
      test
    </button>
    {data}
  </>
}