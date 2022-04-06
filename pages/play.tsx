import { useTheme } from "comps/theme/context"
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Layout } from "./_app"

const width = 1920
const height = 1080

export default function Page() {
  const theme = useTheme()

  const [canvas, setCanvas] =
    useState<HTMLCanvasElement | null>(null)
  const context = useMemo(() => {
    return canvas?.getContext("2d", {})
  }, [canvas])

  const frame = useRef(0)
  const last = useRef(0)

  const position = useRef({ x: 0, y: 0 })

  const loop = useCallback((now: number) => {
    if (!canvas || !context) return

    const delta = last.current
      ? now - last.current
      : 0
    last.current = now

    context.clearRect(0, 0, width, height);

    context.fillRect(16 * 2, (height / 4), 16, (height / 2))
    context.fillRect(width - (16 * 3), (height / 4), 16, (height / 2))

    const { x, y } = position.current
    position.current.x += 0.01 * delta
    position.current.y += 0.01 * delta

    context.fillRect((width / 2) - 16 + x, (height / 2) - 16 - y, 16, 16)

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