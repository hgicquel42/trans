import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { User } from "@prisma/client";
import * as cookie from "cookie";
import { randomUUID } from "crypto";
import { Request } from "express";
import { Game, Keys } from "libs/game/game";
import { msg } from "libs/socket/message";
import { WebSocket } from "ws";
import { UserService } from "./db/user/user.service";

class Client {
  constructor(
    readonly socket: WebSocket,
    readonly user: User
  ) { }
}

@Injectable()
@WebSocketGateway({ path: "/api/game" })
export class GameController {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) { }

  private normal: WebSocket = undefined
  private special: WebSocket = undefined

  readonly allGames = new Set<Game>()

  readonly gamesByID = new Map<string, Game>()
  readonly gamesBySocket = new Map<WebSocket, Game>()
  readonly clientsBySocket = new Map<WebSocket, Client>()

  readonly socketsByRoom = new Map<string, WebSocket>()
  readonly roomBySocket = new Map<WebSocket, string>()

  async handleConnection(socket: WebSocket, req: Request) {
    const { Authentication } = cookie.parse(req.headers.cookie)
    const payload = this.jwtService.decode(Authentication)
    const user = await this.userService.getRawUserById(payload.sub)
    this.clientsBySocket.set(socket, new Client(socket, user))
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
    room?: string
    type: "solo" | "public" | "private",
    mode: "normal" | "special"
  }) {
    if (this.gamesBySocket.has(socket))
      throw new Error("Already in a game")
    if (socket === this[data.mode])
      throw new Error("Already waiting in matchmaking")
    if (this.roomBySocket.has(socket))
      throw new Error("Already waiting in a room")

    if (data.type === "solo") {
      new Game(this, socket, undefined, data.mode)
      return
    }

    if (data.type === "private" && !data.room) {
      const room = randomUUID().split("-")[0]
      this.socketsByRoom.set(room, socket)
      this.roomBySocket.set(socket, room)
    }

    if (data.type === "private" && data.room) {
      if (!this.socketsByRoom.has(data.room))
        throw new Error("Invalid room ID")
      const other = this.socketsByRoom.get(data.room)
      this.socketsByRoom.delete(data.room)
      this.roomBySocket.delete(other)
      new Game(this, other, socket, data.mode)
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

}