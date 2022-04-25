import { randomUUID } from "crypto"
import { msg } from "libs/socket/message"
import { GameController } from "src/game"
import { WebSocket } from "ws"
import { AABB, DAABB } from "./aabb"
import { Ball } from "./ball"
import { h, w } from "./screen"

const { min, max } = Math

export const f = 1000 / 60

export interface Keys {
  up: boolean,
  down: boolean
}

export class Player {
  score = 5
  keys = { up: false, down: false }

  constructor(
    readonly game: Game,
    readonly socket: WebSocket
  ) { }

  check() {
    if (this.score === 10)
      this.socket.send(msg("winlose", "won"))
    this.game.close()
  }
}

export class Game {
  readonly id = randomUUID().split("-")[0]

  private closed = false

  private last = Date.now()

  private ball = new Ball()

  private top = new AABB(0, -128, w, 128)
  private bottom = new AABB(0, h, w, 128)
  private left = new AABB(-16, 0, 16, h)
  private right = new AABB(w, 0, 16, h)

  private lbar = new DAABB(32 * 2, 1 * (h / 5), 32, (h / 4))
  private rbar = new DAABB(w - (32 * 3), 3 * (h / 5), 32, (h / 4))

  readonly alpha: Player
  readonly beta: Player

  readonly viewers = new Set<WebSocket>()

  constructor(
    readonly parent: GameController,
    alpha: WebSocket, beta: WebSocket
  ) {
    this.alpha = new Player(this, alpha)
    this.beta = new Player(this, beta)

    this.parent.allGames.add(this)
    this.parent.gamesByID.set(this.id, this)
    this.parent.gamesBySocket.set(this.alpha.socket, this)
    this.parent.gamesBySocket.set(this.beta.socket, this)

    this.send(msg("gameID", this.id))
    this.send(msg("status", "joined"))
    this.tick()
  }

  score() {
    this.send(msg("score", { alpha: this.alpha.score, beta: this.beta.score }))
  }

  tick() {
    if (this.closed) return
    const now = Date.now()

    if (this.last + f < now) {
      const dtime = now - this.last
      this.last = now

      const { ball, lbar, rbar } = this

      if (ball.dy > 0)
        ball.dy = Math.max(ball.dy + (-0.0001 * dtime), 0)
      if (ball.dy < 0)
        ball.dy = Math.min(ball.dy + (0.0001 * dtime), 0)

      ball.x += ball.dx * dtime
      ball.y += ball.dy * dtime

      if (this.alpha.keys.up)
        lbar.dy = -1 * (h / 500)
      if (this.alpha.keys.down)
        lbar.dy = 1 * (h / 500)
      if (this.beta.keys.up)
        rbar.dy = -1 * (h / 500)
      if (this.beta.keys.down)
        rbar.dy = 1 * (h / 500)

      if (lbar.dy > 0) {
        lbar.dy = max(lbar.dy + (-0.025 * dtime), 0)
        lbar.y = min(lbar.y + (lbar.dy * dtime) + lbar.h, h) - lbar.h
      }

      if (lbar.dy < 0) {
        lbar.dy = min(lbar.dy + (0.025 * dtime), 0)
        lbar.y = max(lbar.y + (lbar.dy * dtime), 0)
      }

      if (rbar.dy > 0) {
        rbar.dy = max(rbar.dy + (-0.025 * dtime), 0)
        rbar.y = min(rbar.y + (rbar.dy * dtime) + rbar.h, h) - rbar.h
      }

      if (rbar.dy < 0) {
        rbar.dy = min(rbar.dy + (0.025 * dtime), 0)
        rbar.y = max(rbar.y + (rbar.dy * dtime), 0)
      }

      if (!ball.shadow) {
        if (ball.inter(this.left)) {
          this.beta.score++
          ball.shadow = true
          setTimeout(() => {
            ball.x = w / 2
            ball.y = h / 2
            ball.dy = 0
            ball.dx = ball.minadx
            ball.shadow = false
          }, 5000)
          this.score()
        }

        if (ball.inter(this.right)) {
          this.beta.score++
          ball.shadow = true
          setTimeout(() => {
            ball.x = w / 2
            ball.y = h / 2
            ball.dy = 0
            ball.dx = -ball.minadx
            ball.shadow = false
          }, 5000)
          this.score()
        }

        if (ball.inter(lbar)) {
          ball.bounce(lbar)
          ball.dx = min(max(ball.dx * 1.1, -2), 2)
          ball.dy = min(max(ball.dy + lbar.dy, -1), 1)
        }

        if (ball.inter(rbar)) {
          ball.bounce(rbar)
          ball.dx = min(max(ball.dx * 1.1, -2), 2)
          ball.dy = min(max(ball.dy + rbar.dy, -1), 1)
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
    for (const socket of this.viewers)
      socket.send(data)
    this.alpha.socket.send(data)
    this.beta.socket.send(data)
  }

  close() {
    for (const socket of this.viewers)
      this.parent.gamesBySocket.delete(socket)
    this.parent.gamesBySocket.delete(this.alpha.socket)
    this.parent.gamesBySocket.delete(this.beta.socket)
    this.parent.gamesByID.delete(this.id)
    this.parent.allGames.delete(this)
    this.send(msg("status", "closed"))
    this.closed = true
  }
}