import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Request } from "express";
import { Game, Keys } from "libs/game/game";
import { msg } from "libs/socket/message";
import { WebSocket } from "ws";

@WebSocketGateway({ path: "/game" })
export class GameController {
  private waiting: WebSocket = undefined

  readonly allSockets = new Set<WebSocket>()
  readonly allGames = new Set<Game>()

  readonly gamesByID = new Map<string, Game>()
  readonly gamesBySocket = new Map<WebSocket, Game>()

  handleConnection(socket: WebSocket, req: Request) {
    this.allSockets.add(socket)
  }

  handleDisconnect(socket: WebSocket) {
    if (!this.allSockets.has(socket))
      return
    if (socket === this.waiting)
      delete this.waiting
    if (this.gamesBySocket.has(socket)) {
      const game = this.gamesBySocket.get(socket)
      if (game.viewers.has(socket))
        game.viewers.delete(socket)
      if (socket === game.alpha || socket === game.beta)
        game.close()
      this.gamesBySocket.delete(socket)
    }
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
    if (this.gamesBySocket.has(socket))
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

    new Game(this, socket, other)
  }

  @SubscribeMessage("keys")
  onkeys(socket: WebSocket, data: Keys) {
    if (!this.allSockets.has(socket))
      throw new Error("Did not say hello")
    if (!this.gamesBySocket.has(socket))
      throw new Error("Not in a game")
    const game = this.gamesBySocket.get(socket)
    if (socket === game.alpha)
      game.akeys = data
    else if (socket === game.beta)
      game.bkeys = data
    else
      throw new Error("Not playing")
  }

  @SubscribeMessage("watch")
  onwatch(socket: WebSocket, gameID: string) {
    if (!this.allSockets.has(socket))
      throw new Error("Did not say hello")
    if (this.gamesBySocket.has(socket))
      throw new Error("Already in a game")
    if (!this.gamesByID.has(gameID))
      throw new Error("No such game")
    const game = this.gamesByID.get(gameID)
    this.gamesBySocket.set(socket, game)
    game.viewers.add(socket)
    socket.send(msg("status", "watching"))
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