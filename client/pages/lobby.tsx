import { Layout } from "comps/layout/layout";
import { Anchor } from "comps/next/anchor";

function Solo() {
	return (
		<>
			<table className="min-w-full">
				<thead>
					<tr>
						<th
							className="px-14 py-8 text-xl pt-10 font-pixel leading-4 tracking-wider text-center text-black uppercase border-b border-black bg-contrast underline"
						>
							TRAINING
						</th>
					</tr>
				</thead>
				<tbody>
					<div className="h-[35px]" />
					<div className='flex justify-center'>
						<Anchor className="bg-zinc-800 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
							href='/playsolo'>
							<div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Classic</div>
						</Anchor>
					</div>
					<div className="h-[25px]" />
					<div className='flex justify-center'>
						<Anchor className="bg-zinc-800 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
							href='/playsolospe'>
							<div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Special</div>
						</Anchor>
					</div>
				</tbody>
			</table>
		</>
	)
}

function Multi() {
	return (
		<>
			<table className="min-w-full">
				<thead>
					<tr>
						<th
							className="px-14 py-8 text-xl pt-10 font-pixel leading-4 tracking-wider text-center text-black uppercase border-b border-black bg-contrast underline"
						>
							RANKED
						</th>
					</tr>
				</thead>
				<tbody>
					<div className="h-[35px]" />
					<div className='flex justify-center'>
						<Anchor className="bg-zinc-800 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
							href='/play'>
							<div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Classic</div>
						</Anchor>
					</div>
					<div className="h-[25px]" />
					<div className='flex justify-center'>
						<Anchor className="bg-zinc-800 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
							href='/play'>
							<div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Special</div>
						</Anchor>
					</div>
					<div className="h-[35px]"></div>
				</tbody>
			</table>
		</>
	)
}

export default function Lobby() {
	return (
		<Layout>
			<div className='h-[50px]' />
			<div className="flex justify-around">
				<div className="w-full aspect-video border-8 border-opposite">
					<Solo />
				</div>
				<div className="w-full aspect-video border-8 border-opposite">
					<Multi />
				</div>
			</div>
		</Layout >
	)
}