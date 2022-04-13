import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { msg } from "libs/socket/message";
import { WebSocket } from "ws";

const w = 1920
const h = 1080

const f = 1000 / 60

export class AABB {
  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number
  ) { }
}

export class DAABB extends AABB {
  public dx = 0
  public dy = 0
}

export class DDAABB extends DAABB {
  public ddx = 0
  public ddy = 0
}

export class Ball extends DDAABB {
  public readonly minadx = 0.5

  public dx = this.minadx
  public dy = 0

  public shadow = false

  constructor() {
    super(w / 2, h / 2, 42, 42)
  }

  inter(other: AABB) {
    return true
      && this.x + this.w >= other.x
      && this.x <= other.x + other.w
      && this.y + this.h >= other.y
      && this.y <= other.y + other.h
  }

  bounce(other: AABB) {
    const t = this.y + this.h - other.y
    const b = other.y + other.h - this.y
    const l = this.x + this.w - other.x
    const r = other.x + other.w - this.x

    if (t < b && t < l && t < r) {
      this.y = other.y - this.h
      this.dy *= -1
    }

    if (b < t && b < l && b < r) {
      this.y = other.y + other.h
      this.dy *= -1
    }

    if (l < r && l < t && l < b) {
      this.x = other.x - this.w
      this.dx *= -1
    }

    if (r < l && r < t && r < b) {
      this.x = other.x + other.w
      this.dx *= -1
    }
  }
}

export interface Keys {
  up: boolean,
  down: boolean
}

export class Game {
  private closed = false

  private last = Date.now()

  private ball = new Ball()

  private top = new AABB(0, -128, w, 128)
  private bottom = new AABB(0, h, w, 128)
  private left = new AABB(-16, 0, 16, h)
  private right = new AABB(w, 0, 16, h)

  private lbar = new DAABB(32 * 2, 1 * (h / 5), 32, (h / 4))
  private rbar = new DAABB(w - (32 * 3), 3 * (h / 5), 32, (h / 4))

  private score = { alpha: 0, beta: 0 }

  public akeys: Keys = { up: false, down: false }
  public bkeys: Keys = { up: false, down: false }

  constructor(
    readonly parent: GameController,
    readonly alpha: WebSocket,
    readonly beta: WebSocket
  ) { }

  tick() {
    if (this.closed) return
    const now = Date.now()

    if (this.last + f < now) {
      const dtime = now - this.last
      this.last = now

      const { ball, lbar, rbar, score } = this

      if (ball.dy > 0)
        ball.dy = Math.max(ball.dy + (-0.0001 * dtime), 0)
      if (ball.dy < 0)
        ball.dy = Math.min(ball.dy + (0.0001 * dtime), 0)

      ball.x += ball.dx * dtime
      ball.y += ball.dy * dtime

      if (this.akeys.up)
        lbar.dy = -1 * (h / 500)
      if (this.akeys.down)
        lbar.dy = 1 * (h / 500)
      if (this.bkeys.up)
        rbar.dy = -1 * (h / 500)
      if (this.bkeys.down)
        rbar.dy = 1 * (h / 500)

      if (lbar.dy > 0) {
        lbar.dy = Math.max(lbar.dy + (-0.025 * dtime), 0)
        lbar.y = Math.min(lbar.y + (lbar.dy * dtime) + lbar.h, h) - lbar.h
      }

      if (lbar.dy < 0) {
        lbar.dy = Math.min(lbar.dy + (0.025 * dtime), 0)
        lbar.y = Math.max(lbar.y + (lbar.dy * dtime), 0)
      }

      if (rbar.dy > 0) {
        rbar.dy = Math.max(rbar.dy + (-0.025 * dtime), 0)
        rbar.y = Math.min(rbar.y + (rbar.dy * dtime) + rbar.h, h) - rbar.h
      }

      if (rbar.dy < 0) {
        rbar.dy = Math.min(rbar.dy + (0.025 * dtime), 0)
        rbar.y = Math.max(rbar.y + (rbar.dy * dtime), 0)
      }

      if (!ball.shadow) {
        if (ball.inter(this.left)) {
          this.score.beta++
          ball.shadow = true
          setTimeout(() => {
            ball.x = w / 2
            ball.y = h / 2
            ball.dy = 0
            ball.dx = ball.minadx
            ball.shadow = false
          }, 2000)
          this.send(msg("score", score))
        }

        if (ball.inter(this.right)) {
          this.score.alpha++
          ball.shadow = true
          setTimeout(() => {
            ball.x = w / 2
            ball.y = h / 2
            ball.dy = 0
            ball.dx = -ball.minadx
            ball.shadow = false
          }, 2000)
          this.send(msg("score", score))
        }

        if (ball.inter(lbar)) {
          ball.bounce(lbar)
          ball.dx *= 1.1
          ball.dy += lbar.dy
        }

        if (ball.inter(rbar)) {
          ball.bounce(rbar)
          ball.dx *= 1.1
          ball.dy += rbar.dy
        }

        if (ball.inter(this.top))
          ball.bounce(this.top)
        if (ball.inter(this.bottom))
          ball.bounce(this.bottom)
      }

      this.send(msg("game", { ball, lbar, rbar }))
    }

    if (now - this.last < f - 16)
      setTimeout(() => this.tick())
    else
      setImmediate(() => this.tick())
  }

  send(data: string) {
    this.alpha.send(data)
    this.beta.send(data)
  }

  close() {
    this.parent.gamesBySocket.delete(this.alpha)
    this.parent.gamesBySocket.delete(this.beta)
    this.parent.allGames.delete(this)
    this.send(msg("status", "closed"))
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

    const game = new Game(this, socket, other)

    this.allGames.add(game)
    this.gamesBySocket.set(socket, game)
    this.gamesBySocket.set(other, game)

    game.send(msg("status", "joined"))
    game.tick()
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
    if (socket === game.beta)
      game.bkeys = data
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