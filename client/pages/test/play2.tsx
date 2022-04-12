import { Layout } from "comps/layout/layout"
import { SocketHandle, useSocket } from "libs/socket/connect"
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

  return <Layout>
    {(() => {
      if (socket.socket === undefined)
        return <>{`Connexion au serveur...`}</>
      if (status === "waiting")
        return <>{`En attente d'un joueur...`}</>
      if (status === "joined")
        return <Game socket={socket} />
      if (status === "closed")
        return <>
          <div>{`L'adversaire a quitté la game`}</div>
          <div className="my-2" />
          <button className="border-8 p-4 border-green-500"
            onClick={play}>
            Rechercher une partie
          </button>
        </>
      return null
    })()}
  </Layout>
}

function Game(props: {
  socket: SocketHandle
}) {
  return <>
    <canvas />
  </>
}