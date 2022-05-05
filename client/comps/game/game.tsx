import { useTheme } from "comps/theme/context";
import { SocketHandle } from "libs/socket/connect";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PlayerData } from "./player";

const w = 1920
const h = 1080

export interface AABB {
  x: number
  y: number
  w: number
  h: number
}

export interface GameData {
  objects: AABB[]
}

function draw(context: CanvasRenderingContext2D, aabb: AABB) {
  const { x, y, w, h } = aabb
  context.fillRect(x, y, w, h)
}

export function Game(props: {
  gameID: string
  socket: SocketHandle
  alpha?: PlayerData
  beta?: PlayerData
}) {
  const { gameID, socket, alpha, beta } = props

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

    if (game.current)
      for (const object of game.current.objects)
        draw(context, object)

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

  return <>
    <div className="my-6" />
    <canvas className="w-full aspect-video border-8 border-opposite"
      width={w}
      height={h}
      ref={setCanvas} />
    <div className="my-8" />
    <div className="w-full flex flex-wrap items-center gap-4 font-pixel">
      <img className="w-16 h-16 rounded-full"
        src={alpha && (alpha.avatar ?? "/images/bot.png")} />
      <div className="font-black text-5xl pt-4">
        {alpha?.score ?? 0}
      </div>
      <div className="grow" />
      <div className="font-black text-5xl pt-4">
        {beta?.score ?? 0}
      </div>
      <img className="w-16 h-16 rounded-full"
        src={beta && (beta.avatar ?? "/images/bot.png")} />
    </div>
    <div className="my-2" />
    <div className='flex justify-center w-full'>
      <div className="font-pixel font-semibold text-xl tracking-wider grow">
        <p className="font-pixel">Share your game : </p>
        <input className="w-full text-center bg-transparent text-xl outline-none font-pixel pt-2"
          readOnly value={`${location.origin}/watch?id=${gameID}`}
          onClick={e => e.currentTarget.select()} />
      </div>
    </div>
  </>
}
