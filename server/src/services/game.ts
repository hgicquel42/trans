import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as cookie from "cookie";
import { randomUUID } from "crypto";
import { Request } from "express";
import { Client } from "libs/game/client";
import { Game, Keys } from "libs/game/game";
import { msg } from "libs/socket/message";
import { MatchService } from "src/db/match/match.service";
import { UserService } from "src/db/user/user.service";
import { WebSocket } from "ws";

export class Room {
  readonly id = randomUUID().split("-")[0]

  alpha: Client = undefined

  constructor(
    readonly mode: "normal" | "special"
  ) { }
}

@Injectable()
export class GameService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private matchHistory: MatchService,
  ) { }

  private normal: Client = undefined
  private special: Client = undefined

  readonly allGames = new Set<Game>()

  readonly gamesByID = new Map<string, Game>()
  readonly gamesBySocket = new Map<WebSocket, Game>()
  readonly clientsBySocket = new Map<WebSocket, Client>()

  readonly roomsByID = new Map<string, Room>()
  readonly roomsByClient = new Map<Client, Room>()

  async handleConnection(socket: WebSocket, req: Request) {
    const { Authentication } = cookie.parse(req.headers.cookie)
    const payload = this.jwtService.decode(Authentication)
    const user = await this.userService.getRawUserById(payload.sub)
    this.clientsBySocket.set(socket, new Client(socket, user))
    socket.send(msg("hello", {}))
  }

  handleDisconnect(socket: WebSocket) {
    if (socket === this.normal?.socket)
      delete this.normal
    if (socket === this.special?.socket)
      delete this.special
    if (this.gamesBySocket.has(socket)) {
      const game = this.gamesBySocket.get(socket)
      if (game.viewers.has(socket))
        game.viewers.delete(socket)
      if (socket === game.alpha.client?.socket)
        game.close()
      if (socket === game.beta.client?.socket)
        game.close()
      this.gamesBySocket.delete(socket)
    }
  }

  onhello(socket: WebSocket, data: {}) {
    if (this.clientsBySocket.has(socket))
      socket.send(msg("hello", {}))
  }

  onwait(socket: WebSocket, data: {
    room?: string
    type: "solo" | "public" | "private",
    mode: "normal" | "special"
  }) {
    if (!this.clientsBySocket.has(socket))
      throw new Error("Did not say hello")
    const client = this.clientsBySocket.get(socket)
    if (this.gamesBySocket.has(socket))
      throw new Error("Already in a game")
    if (client === this[data.mode])
      throw new Error("Already waiting in matchmaking")
    if (this.roomsByClient.has(client))
      throw new Error("Already waiting in a room")

    if (data.type === "solo") {
      new Game(this, client, undefined, data.mode, this.matchHistory)
      return
    }

    if (data.room) {
      if (!this.roomsByID.has(data.room))
        throw new Error("Invalid room ID")
      const room = this.roomsByID.get(data.room)

      if (!room.alpha) {
        room.alpha = client
        this.roomsByClient.set(client, room)
        socket.send(msg("status", "waiting"))
        socket.send(msg("roomID", room.id))
        return
      }

      this.roomsByID.delete(room.id)
      this.roomsByClient.delete(room.alpha)
      new Game(this, room.alpha, client, room.mode, this.matchHistory)
      return
    }

    if (!this[data.mode]) {
      this[data.mode] = client
      socket.send(msg("status", "waiting"))
      return
    }

    const other = this[data.mode]
    delete this[data.mode]

    new Game(this, other, client, data.mode, this.matchHistory)
  }

  onkeys(socket: WebSocket, data: Keys) {
    if (!this.gamesBySocket.has(socket))
      throw new Error("Not in a game")
    const game = this.gamesBySocket.get(socket)
    if (socket === game.alpha.client?.socket)
      game.alpha.keys = data
    else if (socket === game.beta.client?.socket)
      game.beta.keys = data
    else
      throw new Error("Not playing")
  }

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