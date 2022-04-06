import { useLayoutEffect, useMemo, useState } from "react"

export default function Home() {
  const [canvas, setCanvas] =
    useState<HTMLCanvasElement | null>(null)
  const context = useMemo(() => {
    return canvas?.getContext("2d", {})
  }, [canvas])

  useLayoutEffect(() => {
    if (!canvas || !context) return
    const { width, height } = canvas

    context.fillStyle = '#000000'
    context.fillRect(width / 2, height / 2, 1, 1)
  }, [context])

  return <>
    <canvas ref={setCanvas}
      width={600}
      height={600} />
  </>
}