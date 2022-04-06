import { useTheme } from "comps/theme/context"
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Layout } from "./_app"

const width = 1920
const height = 1080

export interface Vector {
  x: number
  y: number
}

export default function Page() {
  const theme = useTheme()

  const [canvas, setCanvas] =
    useState<HTMLCanvasElement | null>(null)
  const context = useMemo(() => {
    return canvas?.getContext("2d", {})
  }, [canvas])

  const frame = useRef(0)
  const last = useRef(0)

  const ball = useRef({
    pos: { x: width / 2, y: height / 2 },
    box: { x: 42, y: 42 },
    dir: { x: 0.2, y: 0.2 }
  })

  const loop = useCallback((now: number) => {
    if (!canvas || !context) return

    const delta = last.current
      ? now - last.current
      : 0
    last.current = now

    context.clearRect(0, 0, width, height);

    context.fillRect(16 * 2, (height / 4), 16, (height / 2))
    context.fillRect(width - (16 * 3), (height / 4), 16, (height / 2))

    const { pos, box, dir } = ball.current

    if (pos.y + box.y >= height)
      dir.y *= -1
    if (pos.y <= 0)
      dir.y *= -1;
    if (pos.x + box.x >= width)
      dir.x *= -1;
    if (pos.x <= 0)
      dir.x *= -1;

    pos.x += dir.x * delta
    pos.y += dir.y * delta

    context.fillRect(pos.x, pos.y, box.x, box.y)

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
      width={width}
      height={height} />
  </Layout>
}