import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { WebSocket } from "ws";

export interface Game {
  alpha: WebSocket
  beta: WebSocket
}

@WebSocketGateway({ path: "/play" })
export class GameController {
  readonly queue = new Array<WebSocket>()
  readonly games = new Array<Game>()

  @SubscribeMessage("wait")
  onwait(socket: WebSocket, data: {}) {
    if (!this.queue.length) {
      this.queue.push(socket)
      return
    }

    const other = this.queue.pop()

  }

  @SubscribeMessage("join")
  onjoin(socket: WebSocket, data: {
    channel: string
  }) {

  }
}