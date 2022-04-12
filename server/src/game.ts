import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { msg } from "libs/socket/message";
import { WebSocket } from "ws";

export class Game {
  closed = false

  constructor(
    readonly parent: GameController,
    readonly alpha: WebSocket,
    readonly beta: WebSocket
  ) { }

  tick() {
    if (this.closed) return
    if (Date.now() % 1000 === 0)
      console.log("tick")
    setImmediate(() => this.tick())
  }

  close() {
    this.parent.gamesBySocket.delete(this.alpha)
    this.parent.gamesBySocket.delete(this.beta)
    this.parent.allGames.delete(this)
    this.alpha.send(msg("status", "closed"))
    this.beta.send(msg("status", "closed"))
    this.closed = true
  }
}

@WebSocketGateway({ path: "/game" })
export class GameController {
  waiting: WebSocket = undefined

  readonly allSockets = new Set<WebSocket>()
  readonly allGames = new Set<Game>()

  readonly gamesBySocket = new Map<WebSocket, Game>()

  @SubscribeMessage("hello")
  onhello(socket: WebSocket, data: {}) {
    socket.addEventListener("close",
      () => this.onclose(socket))
    this.allSockets.add(socket)
  }

  onclose(socket: WebSocket) {
    if (socket === this.waiting)
      delete this.waiting
    if (this.gamesBySocket.has(socket))
      this.gamesBySocket.get(socket).close()
    this.allSockets.delete(socket)
  }

  /**
   * Automatic match making
   * @param socket 
   * @param data 
   * @returns 
   */
  @SubscribeMessage("wait")
  onwait(socket: WebSocket, data: {}) {
    if (!this.allSockets.has(socket))
      throw new Error("Did not say hello")
    if (this.gamesBySocket.get(socket))
      throw new Error("Already in a game")
    if (socket === this.waiting)
      throw new Error("Already waiting")

    if (!this.waiting) {
      this.waiting = socket
      socket.send(msg("status", "waiting"))
      return
    }

    const other = this.waiting
    delete this.waiting

    const game = new Game(this, socket, other)

    this.allGames.add(game)
    this.gamesBySocket.set(socket, game)
    this.gamesBySocket.set(other, game)

    socket.send(msg("status", "joined"))
    other.send(msg("status", "joined"))

    game.tick()
  }

  /**
   * Create invite room
   * @param socket 
   * @param data 
   */
  @SubscribeMessage("create")
  oncreate(socket: WebSocket, data: {}) {
    if (!this.allSockets.has(socket))
      throw new Error("Did not say hello")
    // todo
  }

  /**
   * Join invite room
   * @param socket 
   * @param data 
   */
  @SubscribeMessage("join")
  onjoin(socket: WebSocket, data: {
    channel: string
  }) {
    if (!this.allSockets.has(socket))
      throw new Error("Did not say hello")
  }

}