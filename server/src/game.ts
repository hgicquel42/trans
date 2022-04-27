import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import * as cookie from "cookie";
import { Request } from "express";
import { Game, Keys } from "libs/game/game";
import { msg } from "libs/socket/message";
import { WebSocket } from "ws";

@WebSocketGateway({ path: "/api/game" })
export class GameController {
  private normal: WebSocket = undefined
  private special: WebSocket = undefined

  readonly allGames = new Set<Game>()

  readonly gamesByID = new Map<string, Game>()
  readonly gamesBySocket = new Map<WebSocket, Game>()

  handleConnection(socket: WebSocket, req: Request) {
    const { Authentication, Refresh } = cookie.parse(req.headers.cookie)
    console.log(Authentication, Refresh)
  }

  handleDisconnect(socket: WebSocket) {
    if (socket === this.normal)
      delete this.normal
    if (socket === this.special)
      delete this.special
    if (this.gamesBySocket.has(socket)) {
      const game = this.gamesBySocket.get(socket)
      if (game.viewers.has(socket))
        game.viewers.delete(socket)
      if (socket === game.alpha.socket || socket === game.beta.socket)
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
  onwait(socket: WebSocket, data: {
    solo: "solo" | "multi",
    mode: "normal" | "special"
  }) {
    if (this.gamesBySocket.has(socket))
      throw new Error("Already in a game")
    if (socket === this[data.mode])
      throw new Error("Already waiting")

    if (data.solo === "solo") {
      new Game(this, socket, undefined, data.mode)
      return
    }

    if (!this[data.mode]) {
      this[data.mode] = socket
      socket.send(msg("status", "waiting"))
      return
    }

    const other = this[data.mode]
    delete this[data.mode]

    new Game(this, other, socket, data.mode)
  }

  @SubscribeMessage("keys")
  onkeys(socket: WebSocket, data: Keys) {
    if (!this.gamesBySocket.has(socket))
      throw new Error("Not in a game")
    const game = this.gamesBySocket.get(socket)
    if (socket === game.alpha.socket)
      game.alpha.keys = data
    else if (socket === game.beta.socket)
      game.beta.keys = data
    else
      throw new Error("Not playing")
  }

  @SubscribeMessage("watch")
  onwatch(socket: WebSocket, gameID: string) {
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

  }

}