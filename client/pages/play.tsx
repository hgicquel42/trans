import { Play } from "comps/game/play"
import { Layout } from "comps/layout/layout"
import { Anchor } from "comps/next/anchor"
import { useProfile } from "comps/profil/context"
import { useSocket } from "libs/socket/connect"
import { asStringOrThrow } from "libs/types/string"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"

export default function Page() {
	const router = useRouter()
	const socket = useSocket("/game")

	const mode = asStringOrThrow(router.query.mode)
	const solo = asStringOrThrow(router.query.solo)

	if (mode !== "normal" && mode !== "special")
		throw new Error("Invalid mode")

	const [status, setStatus] = useState<string>()

	useEffect(() => {
		return socket.listen("status", setStatus)
	}, [socket.listen])

	const [gameID, setGameID] = useState<string>()

	useEffect(() => {
		return socket.listen("gameID", setGameID)
	}, [socket.listen])

	const play = useCallback(() => {
		socket.send("wait", { mode, solo })
	}, [socket.send])

	useEffect(() => {
		play()
	}, [play])

	return <Layout>
		{(() => {
			if (!socket.socket)
				return <Connect />
			if (status === "waiting")
				return <Wait />
			if (status === "joined")
				return <Play
					gameID={gameID!}
					socket={socket} />
			if (status === "closed")
				return <Closed play={play} />
			if (status === "finished")
				return <Finished play={play} />
			return null
		})()}
	</Layout>
}

function Connect() {
	return <>
		<div className="h-[100px]" />
		<div className="text-center">
			<h1 className="font-pixel font-semibold text-3xl leading-4 tracking-wider text-opposite">
				CONNECT TO SERVER
			</h1>
		</div>
		<div className="h-[25px]" />
		<div className=" flex justify-center items-center">
			<div className="h-24 flex items-center justify-center space-x-2">
				<div className="w-8 h-8 bg-special rounded-full animate-pulse"></div>
				<div className="w-8 h-8 bg-special  rounded-full animate-pulse animation-delay-300"></div>
				<div className="w-8 h-8 bg-special  rounded-full animate-pulse animation-delay-600"></div>
				<div className="w-8 h-8 bg-special  rounded-full animate-pulse animation-delay-900"></div>
			</div>
		</div>
		<div className="h-[25px]" />
		<div className="flex justify-center">
			<img className="w-96 h-96 animate-spin-slow" src="https://opengameart.org/sites/default/files/Pixel%20Earth.gif" />
		</div>
	</>
}

function Wait() {
	return <>
		<div className="h-[100px]" />
		<div className="text-center">
			<h1 className="font-pixel font-semibold text-3xl leading-4 tracking-wider text-opposite">
				SEARCHING FOR PLAYER
			</h1>
		</div>
		<div className="h-[25px]" />
		<div className=" flex justify-center items-center">
			<div className="h-24 flex items-center justify-center space-x-2">
				<div className="w-8 h-8 bg-special rounded-full animate-pulse"></div>
				<div className="w-8 h-8 bg-special  rounded-full animate-pulse animation-delay-300"></div>
				<div className="w-8 h-8 bg-special  rounded-full animate-pulse animation-delay-600"></div>
				<div className="w-8 h-8 bg-special  rounded-full animate-pulse animation-delay-900"></div>
			</div>
		</div>
		<div className="h-[25px]" />
		<div className="flex justify-center">
			<img className="w-96 h-96 animate-spin-slow" src="https://opengameart.org/sites/default/files/Pixel%20Earth.gif" />
		</div>
	</>
}

function Closed(props: {
	play(): void
}) {
	const { play } = props

	return <>
		<div className="h-[100px]" />
		<h1 className="font-pixel text-4xl text-center">Opponent Has Left The Game...</h1>
		<div className="h-[100px]" />
		<div className='flex justify-around'>
			<a className="bg-zinc-800 flex flex-col text-center h-20 w-80 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform"
				onClick={play}>
				<div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Search New Match</div>
			</a>
			<div className="h-[50px]" />
			<Anchor className="bg-zinc-800 flex flex-col text-center h-20 w-80 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform"
				href="/lobby">
				<div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Return To Lobby</div>
			</Anchor>
		</div>
	</>
}

function Finished(props: {
	play(): void
}) {
	const { play } = props
	const profile = useProfile()

	return <>
		<div className="h-[100px]" />
		<div className='w-full'>
			<div className='flex flex-col justify-around items-center max-w-xs mx-auto bg-contrast shadow-xl rounded-xl px-12 py-12 '>
				<img src={profile.photo} className="w-48 h-48 rounded-full shadow-xl drop-shadow-xl hover:scale-105 duration-700" alt="" />
				<div className='text-center mt-8'>
					<p className='w-full border-opposite pt-2 pb-4 inline-block border-b-4'>
					</p>
					<div className="flex justify-around font-pixel text-4xl pt-6 text-zinc-800">
						<p>TODO: add real score</p>
						<p>-</p>
						<p>2</p>
					</div>
					<p className='w-full border-opposite pt-2 pb-4 inline-block border-b-4'>
					</p>
					<div className="flex justify-around font-pixel text-4xl pt-6">
						<a className="bg-zinc-800 flex flex-col text-center h-20 w-48 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
							onClick={play}>
							<div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Play</div>
						</a>
					</div>
					<div className="flex justify-around font-pixel text-4xl pt-6">
						<a className="bg-zinc-800 flex flex-col text-center h-20 w-48 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
							href="/lobby">
							<div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Lobby</div>
						</a>
					</div>
				</div>
			</div>
		</div>
		<div className="h-[175px]" />
	</>
}

