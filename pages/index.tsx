import { useTheme } from "comps/theme/context"
import { useEffect, useLayoutEffect, useMemo, useState } from "react"

const size = 100
const width = size * 16
const height = size * 9

export default function Page() {
  const theme = useTheme()

  useEffect(() => {
    console.log("theme", theme)
  }, [theme])

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

  return <>
    <div className="w-full max-w-[1200px] m-auto">
      <div className="h-[100px]" />
      <div className="w-full text-center font-pixel text-8xl underline">
        pong.io
      </div>
      <div className="h-[100px]" />
      <div className="flex items-center">
        <button className="border-8 border-opposite p-4 font-bold font-pixel hover:scale-95 transition-transform">
          Leaderboard
        </button>
      </div>
      <div className="my-2" />
      <canvas className="w-full aspect-video border-8 border-opposite text-red-500"
        ref={setCanvas} />
    </div>
  </>
}