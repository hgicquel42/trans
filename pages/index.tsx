import { useTheme } from "comps/theme/context"
import { useEffect, useMemo, useState } from "react"

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

  useEffect(() => {
    if (!canvas || !context) return
    const { width, height } = canvas

    context.fillStyle = theme.current === "dark"
      ? "white"
      : "black"
    context.fillRect((width / 2) - 16, (height / 2) - 16, 16, 16)
  }, [context, theme])

  return <>
    <div className="h-[100px]" />
    <div className="w-full text-center font-pixel text-8xl">
      pong.io
    </div>
    <div className="h-[100px]" />
    <canvas className="m-auto border-8 border-opposite text-red-500"
      ref={setCanvas}
      width={width}
      height={height} />
  </>
}