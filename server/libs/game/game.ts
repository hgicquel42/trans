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
  score = 0
  keys = { up: false, down: false }

  constructor(
    readonly game: Game,
    readonly socket?: WebSocket
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
  private mbar = new DAABB((w / 2) - 32, 0, 32, (h / 4))

  readonly alpha: Player
  readonly beta: Player

  readonly viewers = new Set<WebSocket>()

  constructor(
    readonly parent: GameController,
    alpha: WebSocket | undefined,
    beta: WebSocket | undefined,
    readonly mode: "normal" | "special"
  ) {
    this.alpha = new Player(this, alpha)
    this.beta = new Player(this, beta)

    this.parent.allGames.add(this)
    this.parent.gamesByID.set(this.id, this)

    if (alpha)
      this.parent.gamesBySocket.set(alpha, this)
    if (beta)
      this.parent.gamesBySocket.set(beta, this)

    this.send(msg("gameID", this.id))
    this.send(msg("status", "joined"))

    setTimeout(() => {
      this.ball.x = w / 2
      this.ball.y = h / 2
      this.ball.dy = 0
      this.ball.dx = this.ball.minadx
      this.ball.shadow = false
      this.mbar.dy = 0.5
    }, 5000)

    this.tick()
  }

  tick() {
    if (this.closed) return
    const now = Date.now()

    if (this.last + f < now) {
      const dtime = now - this.last
      this.last = now

      const { ball, lbar, mbar, rbar } = this
      const objects = [ball, lbar, rbar]

      if (ball.dy > 0)
        ball.dy = max(ball.dy + (-0.0001 * dtime), 0)
      if (ball.dy < 0)
        ball.dy = min(ball.dy + (0.0001 * dtime), 0)

      ball.x += ball.dx * dtime
      ball.y += ball.dy * dtime

      function pmove(player: Player, bar: DAABB) {
        if (player.keys.up)
          bar.dy = -1 * (h / 500)
        if (player.keys.down)
          bar.dy = 1 * (h / 500)
      }

      function aimove(bar: DAABB) {
        if (ball.y + ball.h > bar.y + bar.h)
          bar.dy = 0.6 * (h / 500)
        if (ball.y < bar.y)
          bar.dy = -0.6 * (h / 500)
      }

      if (this.alpha.socket)
        pmove(this.alpha, lbar)
      else
        aimove(lbar)

      if (this.beta.socket)
        pmove(this.beta, rbar)
      else
        aimove(rbar)

      function bardy(bar: DAABB) {
        if (bar.dy > 0) {
          bar.dy = max(bar.dy + (-0.025 * dtime), 0)
          bar.y = min(bar.y + (bar.dy * dtime) + bar.h, h) - bar.h
        }

        if (bar.dy < 0) {
          bar.dy = min(bar.dy + (0.025 * dtime), 0)
          bar.y = max(bar.y + (bar.dy * dtime), 0)
        }
      }

      bardy(lbar)
      bardy(rbar)

      if (this.mode === "special") {
        mbar.y += mbar.dy * dtime
        if (mbar.inter(this.bottom))
          mbar.bounce(this.bottom)
        if (mbar.inter(this.top))
          mbar.bounce(this.top)
        objects.push(mbar)
      }

      if (!ball.shadow) {
        if (ball.inter(this.left)) {
          this.beta.score++
          ball.shadow = true
          mbar.y = 0
          mbar.dy = 0
          this.send(msg("score", { alpha: this.alpha.score, beta: this.beta.score }))
          if (this.beta.score === 10)
            this.finish(this.beta)
          setTimeout(() => {
            ball.x = w / 2
            ball.y = h / 2
            ball.dy = 0
            ball.dx = ball.minadx
            ball.shadow = false
            mbar.dy = 0.5
          }, 5000)
        }

        if (ball.inter(this.right)) {
          this.alpha.score++
          ball.shadow = true
          mbar.y = 0
          mbar.dy = 0
          this.send(msg("score", { alpha: this.alpha.score, beta: this.beta.score }))
          if (this.alpha.score === 10)
            this.finish(this.alpha)
          setTimeout(() => {
            ball.x = w / 2
            ball.y = h / 2
            ball.dy = 0
            ball.dx = -ball.minadx
            ball.shadow = false
            mbar.dy = 0.5
          }, 5000)
        }

        function bounce(bar: DAABB) {
          if (!ball.inter(bar)) return
          ball.bounce(bar)
          ball.dx = min(max(ball.dx * 1.1, -2), 2)
          ball.dy = min(max(ball.dy + bar.dy, -1), 1)
        }

        bounce(lbar)
        bounce(rbar)

        if (this.mode === "special")
          bounce(mbar)

        if (ball.inter(this.top))
          ball.bounce(this.top)
        if (ball.inter(this.bottom))
          ball.bounce(this.bottom)
      }

      this.send(msg("game", { objects }))
    }

    if (now - this.last < f - 16)
      setTimeout(() => this.tick())
    else
      setImmediate(() => this.tick())
  }

  send(data: string) {
    for (const socket of this.viewers)
      socket.send(data)
    if (this.alpha.socket)
      this.alpha.socket.send(data)
    if (this.beta.socket)
      this.beta.socket.send(data)
  }

  finish(winner: Player) {
    for (const socket of this.viewers)
      this.parent.gamesBySocket.delete(socket)
    if (this.alpha.socket)
      this.parent.gamesBySocket.delete(this.alpha.socket)
    if (this.beta.socket)
      this.parent.gamesBySocket.delete(this.beta.socket)
    this.parent.gamesByID.delete(this.id)
    this.parent.allGames.delete(this)
    this.send(msg("status", "finished"))
    this.closed = true
  }

  close() {
    for (const socket of this.viewers)
      this.parent.gamesBySocket.delete(socket)
    if (this.alpha.socket)
      this.parent.gamesBySocket.delete(this.alpha.socket)
    if (this.beta.socket)
      this.parent.gamesBySocket.delete(this.beta.socket)
    this.parent.gamesByID.delete(this.id)
    this.parent.allGames.delete(this)
    this.send(msg("status", "closed"))
    this.closed = true
  }
}