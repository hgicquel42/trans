import { useTheme } from "comps/theme/context"
import { useLayoutEffect, useMemo, useState } from "react"
import { Layout } from "./_app"

export default function Page() {
  const theme = useTheme()

  const [canvas, setCanvas] =
    useState<HTMLCanvasElement | null>(null)
  const context = useMemo(() => {
    return canvas?.getContext("2d", {})
  }, [canvas])

  useLayoutEffect(() => {
    if (!canvas) return
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }, [canvas])

  useLayoutEffect(() => {
    if (!canvas || !context) return
    const { width, height } = canvas

    context.fillStyle = theme.current === "dark"
      ? "white"
      : "black"
    context.fillRect((width / 2) - 16, (height / 2) - 16, 16, 16)
    context.fillRect(16 * 2, (height / 4), 16, (height / 2))
    context.fillRect(width - (16 * 3), (height / 4), 16, (height / 2))
  }, [context, theme])

  return <Layout>
    <canvas className="w-full aspect-video border-8 border-opposite text-red-500"
      ref={setCanvas} />
  </Layout>
}