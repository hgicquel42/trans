import { useSocket } from "libs/socket/connect";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
  const { socket, send } = useSocket("/chat")

  const [data, setData] = useState<any>()

  useEffect(() => {
    if (!socket) return
    const f = (e: MessageEvent) => console.log(e.data)
    socket.addEventListener("message", f)
    return () => socket.removeEventListener("message", f)
  }, [socket])

  const test = useCallback(() => {
    send("message", { lol: "suce" })
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