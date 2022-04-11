import { useCallback, useEffect, useState } from "react"

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

  const send = useCallback((event: string, data: any) => {
    if (!socket) return
    const json = JSON.stringify({ event, data })
    socket.send(json)
  }, [socket])

  return { socket, send }
}