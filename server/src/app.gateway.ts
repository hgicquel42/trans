import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway()
export class AppGateway {
  @SubscribeMessage("message")
  onmessage(client: any, data: string) {
    return "lol"
  }
}