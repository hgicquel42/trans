import { User } from "@prisma/client";
import { WebSocket } from "ws";

export class Client {
  constructor(
    readonly socket: WebSocket,
    readonly user: User
  ) { }
}