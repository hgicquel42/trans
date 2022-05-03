import { useProfile } from "comps/profil/context";
import { useTheme } from "comps/theme/context";
import { SocketHandle } from "libs/socket/connect";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

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

export interface PlayerData {
  score: number,
  nickname?: string,
  avatar?: string
}

function draw(context: CanvasRenderingContext2D, aabb: AABB) {
  const { x, y, w, h } = aabb
  context.fillRect(x, y, w, h)
}

export function Game(props: {
  gameID: string
  socket: SocketHandle
}) {
  const { gameID, socket } = props

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

  const [alpha, setAlpha] = useState<PlayerData>()

  useEffect(() => {
    return socket.listen("alpha", setAlpha)
  }, [socket.listen])

  const [beta, setBeta] = useState<PlayerData>()

  useEffect(() => {
    return socket.listen("beta", setBeta)
  }, [socket.listen])

  const profile = useProfile()

  return <>
    <div className="my-6" />
    <canvas className="w-full aspect-video border-8 border-opposite"
      width={w}
      height={h}
      ref={setCanvas} />
    <div className="my-8" />
    <div className="w-full flex flex-wrap items-center gap-4 font-pixel">
      <img className="w-16 h-16 rounded-full"
        src={alpha?.avatar} alt="" />
      <div className="font-black text-5xl pt-4">
        {alpha?.score ?? 0}
      </div>
      <div className="grow" />
      <div className="font-black text-5xl pt-4">
        {beta?.score ?? 0}
      </div>
      <img className="w-16 h-16 rounded-full"
        src={beta?.avatar} alt="" />
    </div>
    <div className="my-2" />
    <div className='flex justify-center'>
      <a className="bg-zinc-800 flex flex-col text-center h-28 w-3/5 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double">
        <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">
          <p className="text-zinc-100 font-pixel">Share your game : </p>
          <input className="w-full text-center bg-transparent text-xl outline-none font-pixel pt-2"
            readOnly value={`${location.origin}/watch?id=${gameID}`}
            onClick={e => e.currentTarget.select()} />
        </div>
      </a>
    </div>
  </>
}
