import { Injectable } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Request } from "express";
import { WebSocket } from "ws";
import { GameService } from "./services/game";

@Injectable()
@WebSocketGateway({ path: "/api/game" })
export class GameController {
  constructor(
    private gameService: GameService
  ) { }

  async handleConnection(socket: WebSocket, req: Request) {
    await this.gameService.handleConnection(socket, req)
  }

  handleDisconnect(socket: WebSocket) {
    this.gameService.handleDisconnect(socket)
  }

  @SubscribeMessage("hello")
  onhello(socket: WebSocket, data: any) {
    this.gameService.onhello(socket, data)
  }

  @SubscribeMessage("wait")
  onwait(socket: WebSocket, data: any) {
    this.gameService.onwait(socket, data)
  }

  @SubscribeMessage("keys")
  onkeys(socket: WebSocket, data: any) {
    this.gameService.onkeys(socket, data)
  }

  @SubscribeMessage("watch")
  onwatch(socket: WebSocket, gameID: string) {
    this.gameService.onwatch(socket, gameID)
  }
}