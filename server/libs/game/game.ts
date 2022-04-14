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

  private score = { alpha: 0, beta: 0 }

  public akeys: Keys = { up: false, down: false }
  public bkeys: Keys = { up: false, down: false }

  readonly viewers = new Set<WebSocket>()

  constructor(
    readonly parent: GameController,
    readonly alpha: WebSocket,
    readonly beta: WebSocket
  ) {
    this.parent.allGames.add(this)
    this.parent.gamesByID.set(this.id, this)
    this.parent.gamesBySocket.set(this.alpha, this)
    this.parent.gamesBySocket.set(this.beta, this)

    this.send(msg("gameID", this.id))
    this.send(msg("status", "joined"))
    this.tick()
  }

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
          this.score.beta++
          ball.shadow = true
          setTimeout(() => {
            ball.x = w / 2
            ball.y = h / 2
            ball.dy = 0
            ball.dx = ball.minadx
            ball.shadow = false
          }, 5000)
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
          }, 5000)
          this.send(msg("score", score))
        }

        if (ball.inter(lbar)) {
          ball.bounce(lbar)
          ball.dx *= 1.1
          ball.dy = min(max(ball.dy + lbar.dy, -1), 1)
        }

        if (ball.inter(rbar)) {
          ball.bounce(rbar)
          ball.dx *= 1.1
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
    this.alpha.send(data)
    this.beta.send(data)
  }

  close() {
    for (const socket of this.viewers)
      this.parent.gamesBySocket.delete(socket)
    this.parent.gamesBySocket.delete(this.alpha)
    this.parent.gamesBySocket.delete(this.beta)
    this.parent.gamesByID.delete(this.id)
    this.parent.allGames.delete(this)
    this.send(msg("status", "closed"))
    this.closed = true
  }
}