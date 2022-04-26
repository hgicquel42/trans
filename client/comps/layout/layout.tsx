import { Anchor } from 'comps/next/anchor'
import { ChildrenProps } from 'libs/react/props'
import { LayoutMenuBar } from "./menubar"

export function Layout(props: ChildrenProps) {
	return <>
		<div className="w-full max-w-[1200px] m-auto p-4">
			{/* Check if isConnect */}
			<LayoutMenuBar />
			<div className="h-[100px]" />
			<Anchor className="block text-center font-pixel text-8xl underline"
				href="/">
				pong.io
			</Anchor>
			<div className="h-[100px]" />
			<div className="flex flex-wrap items-center gap-2">
				<Anchor className="flex-1 bg-red-600 text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
					href="/lobby">
					<div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Play</div>
				</Anchor>
				<Anchor className="flex-1 bg-sky-600 text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
					href="/board">
					<div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Board</div>
				</Anchor>
				<Anchor className="flex-1 bg-yellow-600 text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
					href="/chat">
					<div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Chat</div>
				</Anchor>
				<Anchor className="flex-1 bg-emerald-600 text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
					href="/friend">
					<div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Friend</div>
				</Anchor>
			</div>
			<div className="my-2" />
			{props.children}
		</div>
	</>
}