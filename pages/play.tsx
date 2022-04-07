import { useTheme } from "comps/theme/context"
import { useFactory } from "libs/react/object"
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Layout } from "./_app"

const w = 1920
const h = 1080

export class AABB {
  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number
  ) { }

  draw(context: CanvasRenderingContext2D) {
    context.fillRect(this.x, this.y, this.w, this.h)
  }
}
export class Ball extends AABB {
  public dx = -0.2
  public dy = 0.2

  public ddx = 0
  public ddy = 0

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

export default function Page() {
  const theme = useTheme()

  const [canvas, setCanvas] =
    useState<HTMLCanvasElement | null>(null)
  const context = useMemo(() => {
    return canvas?.getContext("2d", {})
  }, [canvas])

  const frame = useRef(0)
  const ltime = useRef(0)

  const ball = useFactory(() => new Ball())

  const top = useFactory(() => new AABB(0, -16, w, 16))
  const bottom = useFactory(() => new AABB(0, h, w, 16))
  const left = useFactory(() => new AABB(-16, 0, 16, h))
  const right = useFactory(() => new AABB(w, 0, 16, h))

  const lbar = useFactory(() => new AABB(16 * 2, (h / 4), 16, (h / 2)))
  const rbar = useFactory(() => new AABB(w - (16 * 3), (h / 4), 16, (h / 2)))

  const all = useFactory(() => [top, bottom, left, right, lbar, rbar])

  const loop = useCallback((now: number) => {
    if (!canvas || !context) return

    const dtime = ltime.current
      ? now - ltime.current
      : 0
    ltime.current = now

    ball.dx += ball.ddx * dtime
    ball.dy += ball.ddy * dtime

    ball.x += ball.dx * dtime
    ball.y += ball.dy * dtime

    for (const aabb of all)
      if (ball.inter(aabb))
        ball.bounce(aabb)

    context.clearRect(0, 0, w, h);

    ball.draw(context)
    lbar.draw(context)
    rbar.draw(context)

    frame.current = requestAnimationFrame(loop)
  }, [canvas, context])

  useLayoutEffect(() => {
    if (!canvas || !context) return
    context.fillStyle = theme.current === "dark"
      ? "white"
      : "black"
    frame.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame.current)
  }, [canvas, context, theme, loop])

  return <Layout>
    <canvas className="w-full aspect-video border-8 border-opposite"
      ref={setCanvas}
      width={w}
      height={h} />
  </Layout>
}