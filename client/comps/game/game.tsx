import { useTheme } from "comps/theme/context"
import { SocketHandle } from "libs/socket/connect"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

const w = 1920
const h = 1080

export interface AABB {
  x: number
  y: number
  w: number
  h: number
}

export interface GameData {
  ball: AABB
  lbar: AABB
  rbar: AABB
}

function draw(context: CanvasRenderingContext2D, aabb: AABB) {
  const { x, y, w, h } = aabb
  context.fillRect(x, y, w, h)
}

export function Game(props: {
  socket: SocketHandle
}) {
  const { socket } = props

  const theme = useTheme()

  const [canvas, setCanvas] =
    useState<HTMLCanvasElement | null>(null)
  const context = useMemo(() => {
    return canvas?.getContext("2d", {})
  }, [canvas])

  const game = useRef<GameData>()
  const frame = useRef<number>(0)

  const loop = useCallback((now: number) => {
    if (!context) return

    context.clearRect(0, 0, w, h);

    if (game.current) {
      draw(context, game.current.ball)
      draw(context, game.current.lbar)
      draw(context, game.current.rbar)
    }

    frame.current = requestAnimationFrame(loop)
  }, [context])

  useLayoutEffect(() => {
    if (!context) return
    context.fillStyle = theme.current === "dark"
      ? "white"
      : "black"
    frame.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame.current)
  }, [context, theme, loop])

  useEffect(() => {
    return socket.listen("game", (data: GameData) => game.current = data)
  }, [socket.listen])

  const [score, setScore] = useState({ alpha: 0, beta: 0 })

  useEffect(() => {
    return socket.listen("score", setScore)
  }, [socket.listen])

  const keys = useRef({ up: false, down: false })

  useEffect(() => {
    function onkeydown(e: KeyboardEvent) {
      e.preventDefault()
      if (e.key === "ArrowUp")
        keys.current.up = true
      if (e.key === "ArrowDown")
        keys.current.down = true
      socket.send("keys", keys.current)
    }

    function onkeyup(e: KeyboardEvent) {
      e.preventDefault()
      if (e.key === "ArrowUp")
        keys.current.up = false
      if (e.key === "ArrowDown")
        keys.current.down = false
      socket.send("keys", keys.current)
    }

    addEventListener("keydown", onkeydown)
    addEventListener("keyup", onkeyup)

    return () => {
      removeEventListener("keydown", onkeydown)
      removeEventListener("keyup", onkeyup)
    }
  }, [socket.send])

  return <>
    <canvas className="w-full aspect-video border-8 border-opposite"
      width={w}
      height={h}
      ref={setCanvas} />
    <div className="my-10" />
    <div className="w-full flex flex-wrap items-center justify-around gap-2 font-pixel">
      <div className="font-black text-6xl">
        {score.alpha}
      </div>
      <div className="font-black text-6xl">
        {score.beta}
      </div>
    </div>
  </>
}