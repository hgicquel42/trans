import { useTheme } from "comps/theme/context";
import { SocketHandle } from "libs/socket/connect";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ConfettiExplosion from 'react-confetti-explosion';

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

  const [score, setScore] = useState({ alpha: 0, beta: 0 })

  useEffect(() => {
    return socket.listen("score", setScore)
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
        src="/images/default.jpg" alt="" />
      <div className="font-black text-5xl pt-4">
        {score.alpha}
      </div>
      <div className="grow" />
      <div className="font-black text-5xl pt-4">
        {score.beta}
      </div>
      <img className="w-16 h-16 rounded-full"
        src="/images/default.jpg" alt="" />
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

function Win(props: ({ score_alpha: number, score_beta: number })) {
  return <>
    <div className="h-[100px]" />
    <div className='w-full'>
      <div className='flex flex-col justify-around items-center max-w-xs mx-auto bg-contrast shadow-xl rounded-xl px-12 py-12 '>
        <img src="/images/default.jpg" className="w-48 h-48 rounded-full shadow-xl drop-shadow-xl hover:scale-105 duration-700" alt="" />
        <div className='text-center mt-8'>
          <div className="flex justify-center items-center">
            <ConfettiExplosion particleCount={200} duration={5000} force={0.6} floorHeight={1600} floorWidth={1600} />
          </div>
          <p className='text-4xl font-pixel text-zinc-800'>
            VICTORY
          </p>
          <p className='w-full border-opposite pt-2 pb-4 inline-block border-b-4'>
          </p>
          <div className="flex justify-around font-pixel text-4xl pt-6 text-zinc-800">
            <p>{props.score_alpha}</p>
            <p>-</p>
            <p>{props.score_beta}</p>
          </div>
          <p className='w-full border-opposite pt-2 pb-4 inline-block border-b-4'>
          </p>
          <div className="flex justify-around font-pixel text-4xl pt-6">
            <a className="bg-zinc-800 flex flex-col text-center h-20 w-48 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform">
              <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Rematch</div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div className="h-[175px]" />
  </>
}

function Lose(props: ({ score_alpha: number, score_beta: number })) {
  return <>
    <div className="h-[100px]" />
    <div className='w-full'>
      <div className="flex justify-between">
        <img src="https://media0.giphy.com/media/tIFtLCKZEurywLm0gG/giphy.gif?cid=ecf05e47yh49wgguppa4e24e7iaw1gn4j8g4lyatqr2tdp3k&rid=giphy.gif&ct=s" className="w-72 h-72"></img>
        <div className='flex flex-col justify-around items-center max-w-xs mx-auto bg-contrast shadow-xl rounded-xl px-12 py-12 '>
          <img src="/images/default.jpg" className="w-48 h-48 rounded-full shadow-xl drop-shadow-xl hover:scale-105 duration-700" alt="" />
          <div className='text-center mt-8'>
            <p className='text-4xl font-pixel text-zinc-800'>
              DEFEAT
            </p>
            <p className='w-full border-opposite pt-2 pb-4 inline-block border-b-4'>
            </p>
            <div className="flex justify-around font-pixel text-4xl pt-6 text-zinc-800">
              <p>{props.score_alpha}</p>
              <p>-</p>
              <p>{props.score_beta}</p>
            </div>
            <p className='w-full border-opposite pt-2 pb-4 inline-block border-b-4'>
            </p>
            <div className="flex justify-around font-pixel text-4xl pt-6">
              <a className="bg-zinc-800 flex flex-col text-center h-20 w-48 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform">
                <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Rematch</div>
              </a>
            </div>
          </div>
        </div>
        <img src="https://media0.giphy.com/media/tIFtLCKZEurywLm0gG/giphy.gif?cid=ecf05e47yh49wgguppa4e24e7iaw1gn4j8g4lyatqr2tdp3k&rid=giphy.gif&ct=s" className="w-72 h-72"></img>
      </div>

    </div>
    <div className="h-[175px]" />
  </>
}