import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { WebSocket } from "ws";

export interface Channel {
  name: string,
  password?: string
  clients: Client[]
  admins: Client[]
  muteds: Client[]
  banneds: Client[]
}

export interface Client {
  name: string
  socket: WebSocket
}

@WebSocketGateway({ path: "/api/chat" })
export class ChatController {
  readonly clients = new Map<WebSocket, Client>() // pour les event handlers
  readonly names = new Map<string, Client>() // pour ban ou mute un mec
  readonly channels = new Map<string, Channel>()

  @SubscribeMessage("join")
  onjoin(socket: WebSocket, data: {
    channel: string,
    password?: string
  }) {
    const channel = this.channels.get(data.channel)
    if (!channel) {
      // todo creer channel et mettre modo
    }
    if (channel.password !== data.password)
      throw new Error("Bad password")
    channel.clients.push({ name: "chad", socket: socket })
  }

  // todo leave

  @SubscribeMessage("message")
  onmessage(client: WebSocket, data: {
    channel: string
  }) {
    return data
  }
}