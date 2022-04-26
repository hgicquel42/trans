import { Layout } from "comps/layout/layout"
import { useProfile } from "comps/profil/context"
import { useTheme } from "comps/theme/context"
import { useStatic } from "libs/react/object"
import { MouseEvent, TouchEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

const w = 1920
const h = 1080

const s = h / 500

export class AABB {
	constructor(
		public x: number,
		public y: number,
		public w: number,
		public h: number
	) { }

	draw(context: CanvasRenderingContext2D) {
		// const { width, height } = context.canvas
		// const tx = (this.x * width) / w
		// const ty = (this.y * height) / h
		// const tw = (this.w * width) / w
		// const th = (this.h * height) / h
		// context.fillRect(tx, ty, tw, th)
		context.fillRect(this.x, this.y, this.w, this.h)
	}
}

export class Bar extends AABB {
	public dx = 0
	public dy = 0
}
export class Ball extends AABB {
	public ddx = 0
	public ddy = 0

	public shadow = false

	constructor(
		public dx: number,
		public dy: number
	) {
		super(w / 2, h / 2, 42, 42)
	}

	inter(other: AABB) {
		return true
			&& this.x + this.w >= other.x
			&& this.x <= other.x + other.w
			&& this.y + this.h >= other.y
			&& this.y <= other.y + other.h
	}

	bounce(other: AABB) {
		const t = this.y + this.h - other.y
		const b = other.y + other.h - this.y
		const l = this.x + this.w - other.x
		const r = other.x + other.w - this.x

		if (t < b && t < l && t < r) {
			this.y = other.y - this.h
			this.dy *= -1
		}

		if (b < t && b < l && b < r) {
			this.y = other.y + other.h
			this.dy *= -1
		}

		if (l < r && l < t && l < b) {
			this.x = other.x - this.w
			this.dx *= -1
		}

		if (r < l && r < t && r < b) {
			this.x = other.x + other.w
			this.dx *= -1
		}
	}
}

export default function Page() {
	const theme = useTheme()

	const [canvas, setCanvas] =
		useState<HTMLCanvasElement | null>(null)
	const context = useMemo(() => {
		return canvas?.getContext("2d", {})
	}, [canvas])

	const profile = useProfile()

	const frame = useRef(0)
	const ltime = useRef(0)

	const ball = useStatic(() => new Ball(0.5, -0.5))

	const top = useStatic(() => new AABB(0, -16, w, 16))
	const bottom = useStatic(() => new AABB(0, h, w, 16))
	const left = useStatic(() => new AABB(-16, 0, 16, h))
	const right = useStatic(() => new AABB(w, 0, 16, h))

	const lbar = useStatic(() => new Bar(32 * 2, 1 * (h / 5), 32, (h / 4)))
	const rbar = useStatic(() => new Bar(w - (32 * 3), 3 * (h / 5), 32, (h / 4)))
	// const mbar = useStatic(() => new Bar(w / 2, 3 * (h / 8), 32, (h / 4))) MODE SPECIAL

	const all = useStatic(() => [top, bottom])

	const keys = useStatic(() => ({ up: false, down: false }))

	const [score1, setScore1] = useState(0)
	const [score2, setScore2] = useState(0)

	// rbar.dy = 2 MODE SOLO
	// mbar.dy = 0.5 MODE SPECIAL

	const loop = useCallback((now: number) => {
		if (!canvas || !context) return

		const dtime = ltime.current
			? now - ltime.current
			: 0
		ltime.current = now

		ball.dx += ball.ddx * dtime
		ball.dy += ball.ddy * dtime

		if (ball.dy > 0)
			ball.dy = Math.max(ball.dy + (-0.025 * dtime), 0.5)
		if (ball.dy < 0)
			ball.dy = Math.min(ball.dy + (0.025 * dtime), -0.5)

		ball.x += ball.dx * dtime
		ball.y += ball.dy * dtime

		if (keys.up)
			lbar.dy = -1 * s
		if (keys.down)
			lbar.dy = 1 * s

		if (rbar.y < 0)
			rbar.y = 0

		if (rbar.y + 150 > ball.y)
			rbar.dy = -8

		if (rbar.y + 150 < ball.y)
			rbar.dy = 8


		if (lbar.dy > 0) {
			lbar.dy = Math.max(lbar.dy + (-0.025 * dtime), 0)
			lbar.y = Math.min(lbar.y + (lbar.dy * dtime) + lbar.h, h) - lbar.h
		}

		if (lbar.dy < 0) {
			lbar.dy = Math.min(lbar.dy + (0.025 * dtime), 0)
			lbar.y = Math.max(lbar.y + (lbar.dy * dtime), 0)
		}

		rbar.y = Math.min(rbar.y + rbar.dy + rbar.h, h) - rbar.h

		if (!ball.shadow) {
			if (ball.inter(left)) {
				setScore2(x => x + 1)
				ball.shadow = true
				setTimeout(() => {
					ball.x = w / 2
					ball.y = h / 2
					ball.dx = 0.5
					ball.shadow = false
				}, 1000)
			}

			if (ball.inter(right)) {
				setScore1(x => x + 1)
				ball.shadow = true
				setTimeout(() => {
					ball.x = w / 2
					ball.y = h / 2
					ball.dx = 0.5
					ball.shadow = false
				}, 1000)
			}

			if (ball.inter(lbar)) {
				ball.bounce(lbar)
				if (ball.dx < 1 && ball.dx > 1)
					ball.dx *= 1.1
				ball.dy += lbar.dy
			}

			if (ball.inter(rbar)) {
				ball.bounce(rbar)
				if (ball.dx < 1 && ball.dx > -1)
					ball.dx *= 1.1
			}

			for (const aabb of all)
				if (ball.inter(aabb))
					ball.bounce(aabb)
		}

		context.clearRect(0, 0, w, h);

		ball.draw(context)
		lbar.draw(context)
		rbar.draw(context)

		frame.current = requestAnimationFrame(loop)
	}, [canvas, context])

	useLayoutEffect(() => {
		if (!canvas || !context) return
		context.fillStyle = theme.current === "dark"
			? "white"
			: "black"
		frame.current = requestAnimationFrame(loop)
		return () => cancelAnimationFrame(frame.current)
	}, [canvas, context, theme, loop])

	const enableup = useCallback((e: MouseEvent | TouchEvent) => {
		e.preventDefault()
		e.stopPropagation()
		keys.up = true
	}, [])

	const enabledown = useCallback((e: MouseEvent | TouchEvent) => {
		e.preventDefault()
		e.stopPropagation()
		keys.down = true
	}, [])

	const disableup = useCallback((e: MouseEvent | TouchEvent) => {
		e.preventDefault()
		e.stopPropagation()
		keys.up = false
	}, [])

	const disabledown = useCallback((e: MouseEvent | TouchEvent) => {
		e.preventDefault()
		e.stopPropagation()
		keys.down = false
	}, [])

	useEffect(() => {
		function onkeydown(e: KeyboardEvent) {
			e.preventDefault()
			if (e.key === "ArrowUp")
				keys.up = true
			if (e.key === "ArrowDown")
				keys.down = true
		}

		function onkeyup(e: KeyboardEvent) {
			e.preventDefault()
			if (e.key === "ArrowUp")
				keys.up = false
			if (e.key === "ArrowDown")
				keys.down = false
		}

		addEventListener("keydown", onkeydown)
		addEventListener("keyup", onkeyup)

		return () => {
			removeEventListener("keydown", onkeydown)
			removeEventListener("keyup", onkeyup)
		}
	}, [lbar])

	return <Layout>
		<canvas className="w-full aspect-video border-8 border-opposite"
			width={w}
			height={h}
			ref={setCanvas} />
		<div className="my-2" />
		<div className="relative w-full h-[76px]">
			<div className="absolute w-full flex flex-wrap items-center gap-2">
				<button className="grow border-8 border-opposite p-4 pt-5 font-bold font-pixel uppercase mhover:scale-95 transition-transform"
					onTouchStart={enableup}
					onTouchEnd={disableup}
					onMouseDown={enableup}
					onMouseUp={disableup}
					onMouseLeave={disableup}>
					up
				</button>
				<button className="grow border-8 border-opposite p-4 pt-5 font-bold font-pixel uppercase mhover:scale-95 transition-transform"
					onTouchStart={enabledown}
					onTouchEnd={disabledown}
					onMouseDown={enabledown}
					onMouseUp={disabledown}
					onMouseLeave={disabledown}>
					down
				</button>
			</div>
		</div>
		<div className="w-full flex flex-wrap items-center justify-around gap-2 font-pixel pt-8">
			<div>
				<td>
					<div className="px-2 py-2 pr-20">
						<img src={profile.photo} className="w-16 h-16 rounded-full" alt="" />
					</div>
				</td>
				<td>
					<div className="font-black text-6xl">
						{score1}
					</div>
				</td>

			</div>
			<div>
				<td>
					<div className="font-black text-6xl">
						{score2}
					</div>
				</td>
				<td>
					<div className="px-2 py-2 pl-20">
						<img src="https://cdn.pixabay.com/photo/2017/10/24/00/39/bot-icon-2883144_1280.png" className="w-16 h-16 rounded-full" alt="" />
					</div>
				</td>
			</div>
		</div>
	</Layout>
}