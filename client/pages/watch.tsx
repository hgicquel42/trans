import { Game } from "comps/game/game"
import { Layout } from "comps/layout/layout"
import { useSocket } from "libs/socket/connect"
import { asString } from "libs/types/string"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Page() {
  const router = useRouter()

  const gameID = asString(router.query.id)

  const socket = useSocket("/game")

  const [status, setStatus] = useState<string>()

  useEffect(() => {
    return socket.listen("status", setStatus)
  }, [socket.listen])

  useEffect(() => {
    socket.send("watch", gameID)
  }, [socket.send, gameID])

  return <Layout>
    {(() => {
      if (socket.socket === undefined)
        return <Connect />
      if (status === "watching")
        return <Game
          gameID={gameID}
          socket={socket} />
      if (status === "closed")
        return <Closed />
      return null
    })()}
  </Layout>
}

function Connect() {
  return <>{`Connexion au serveur...`}</>
}

function Wait() {
  return <>{`En attente d'un joueur...`}</>
}

function Closed() {
  return <>{`La game est terminee`}</>
}
