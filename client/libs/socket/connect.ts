import { useCallback, useEffect, useState } from "react"
import { msg } from "./message"

export async function connect(path: string) {
  return await new Promise<WebSocket>((ok, err) => {
    const api = location.protocol === "https:"
      ? "wss://" + new URL(process.env.NEXT_PUBLIC_API!).host
      : "ws://" + location.hostname + ":3001"
    const socket = new WebSocket(api + path)
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

export interface SocketHandle {
  socket?: WebSocket

  send(event: string, data?: any): void

  listen<T>(
    event: string,
    ondata: (data: T) => void,
    onerror?: (error: Error) => void
  ): void

  once<T>(event: string): Promise<T>
}

export function useSocket(path: string): SocketHandle {
  const [socket, setSocket] = useState<WebSocket>()

  console.log("socket", socket)

  useEffect(() => {
    if (socket) return
    tryConnect(path).then(setSocket)
  }, [socket])

  useEffect(() => {
    if (!socket) return
    const onclose = () => setSocket(undefined)
    socket.addEventListener("close", onclose)
    return () => socket.addEventListener("close", onclose)
  }, [socket])

  const send = useCallback((event: string, data?: any) => {
    if (!socket) return
    socket.send(msg(event, data))
  }, [socket])

  const listen = useCallback(<T>(
    event: string,
    ondata: (data: T) => void,
    onerror?: (error: Error) => void
  ) => {
    if (!socket) return

    function onmessage(e: MessageEvent) {
      const msg = JSON.parse(e.data)
      if (msg.event !== event) return
      ondata(msg.data)
    }

    function onclose(e: CloseEvent) {
      onerror?.(new Error("Closed"))
    }

    socket.addEventListener("message", onmessage)
    socket.addEventListener("close", onclose)

    return () => {
      socket.removeEventListener("message", onmessage)
      socket.removeEventListener("close", onclose)
    }
  }, [socket])

  const once = useCallback(async <T>(event: string) => {
    let clean = () => { }

    return await new Promise<T>((ok, err) => {
      clean = listen(event, ok, err)!
    }).finally(clean)
  }, [socket])

  return { socket, send, listen, once }
}