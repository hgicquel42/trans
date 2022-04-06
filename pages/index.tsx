import { useEffect, useMemo, useState } from "react"

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
    <div className="h-full flex flex-col">
      <canvas ref={setCanvas}
        width={1600}
        height={900} />
    </div>
  </>
}