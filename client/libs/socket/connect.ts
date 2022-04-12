import { useCallback, useEffect, useState } from "react"
import { msg } from "./message"

export async function connect(path: string) {
  return await new Promise<WebSocket>((ok, err) => {
    const socket = new WebSocket("ws://localhost:3001" + path)
    socket.onopen = () => ok(socket)
    socket.onerror = (e) => err(e)
  })
}

export async function tryConnect(path: string) {
  try {
    return await connect(path)
  } catch (e: unknown) {
    if (!(e instanceof ErrorEvent))
      throw e
    setTimeout(tryConnect, 5000)
  }
}

export function useSocket(path: string) {
  const [socket, setSocket] = useState<WebSocket>()

  useEffect(() => {
    tryConnect(path).then(setSocket)
  }, [path])

  const send = useCallback((event: string, data?: any) => {
    if (!socket) return
    socket.send(msg(event, data))
  }, [socket])

  const listen = useCallback(<T>(
    event: string,
    ondata: (data: T) => void,
    onerror: (error: Error) => void
  ) => {
    if (!socket) return

    function onmessage(e: MessageEvent) {
      const msg = JSON.parse(e.data)
      if (msg.event !== event) return
      ondata(msg.data)
    }

    function onclose(e: CloseEvent) {
      onerror(new Error("Closed"))
    }

    socket.addEventListener("message", onmessage)
    socket.addEventListener("close", onclose)

    return () => {
      socket.removeEventListener("message", onmessage)
      socket.removeEventListener("close", onclose)
    }
  }, [socket])

  const once = useCallback(async (event: string) => {
    if (!socket) return
    let clean = () => { }

    return await new Promise((ok, err) => {
      clean = listen(event, ok, err)!
    }).finally(clean)
  }, [])

  useEffect(() => {
    if (socket) send("hello")
  }, [socket])

  return { socket, send, listen, once }
}