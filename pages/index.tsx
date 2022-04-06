import { useEffect, useMemo, useState } from "react"

const size = 100
const width = size * 16
const height = size * 9

export default function Home() {
  const [canvas, setCanvas] =
    useState<HTMLCanvasElement | null>(null)
  const context = useMemo(() => {
    return canvas?.getContext("2d", {})
  }, [canvas])

  useEffect(() => {
    if (!canvas || !context) return
    const { width, height } = canvas

    context.fillStyle = "black"
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "white"
    context.fillRect((width / 2) - 16, (height / 2) - 16, 16, 16)
  }, [context])

  return <>
    <div className="h-full w-full">
      <div className="h-[200px]" />
      <canvas className="m-auto"
        ref={setCanvas}
        width={width}
        height={height} />
      <div className="h-[200px]" />
    </div>
  </>
}