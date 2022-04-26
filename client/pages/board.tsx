import { Layout } from "comps/layout/layout";
import { Modal } from "comps/modal/modal";
import { Anchor } from "comps/next/anchor";
import { BoardData, useBoard } from "comps/profil/context";
import { useElement } from "libs/react/handles/element";
import { usePopper } from 'react-popper';

export default function Page() {

	const board = useBoard()
	console.log(board)

	return <Layout>
		<div className='h-[50px]' />
		<div className="w-full text-center font-pixel text-4xl">pong.board</div>
		<div className='h-[50px]' />
		<div className="w-full aspect-video border-8 border-opposite overflow-auto">
			<table className="min-w-full">
				<thead>
					<tr>
						<th className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-contrast">
							Name
						</th>
						<th className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-contrast">
							Position
						</th>
						<th className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-contrast">
							Win / Lose
						</th>
					</tr>
				</thead>
				<tbody>
					{
						board.map((board, i) =>
							<Board key={board.id} userData={board} pos={i}></Board>)}
				</tbody>
			</table >
		</div >
	</Layout >
}

function Board(props: { userData: BoardData, pos: number }) {
	return <tr>
		<td className={`px-6 py-3 border-b border-opposite bg-opposite`}>
			<div className="flex item-center">
				<div className="px-2 py-2">
					<a className="w-12 h-12"
						href="/profil">
						<img src={props.userData.photo} className="w-12 h-12 rounded-full" alt="" />
					</a>
				</div>
				<div className="text-sm font-pixel pt-6">
					{props.userData.username}
				</div>
			</div>
		</td>
		<td className={`px-6 py-3 border-b border-opposite bg-opposite`}>
			<div className="font-pixel pt-2 pl-7">
				# {props.pos + 1}
			</div>
		</td>
		<td className={`px-6 py-3 border-b border-opposite bg-opposite`}>
			<div className="flex item-center font-pixel pt-2 pl-6">
				{props.userData.win} / {props.userData.loose}
			</div>
		</td>
	</tr>
}

export function BoardDropdown() {
	const reference = useElement<HTMLButtonElement>()
	const dropdown = useElement<HTMLDivElement>()

	const popper = usePopper(
		reference.value, dropdown.value,
		{ strategy: "fixed", placement: "bottom-start" })

	return (
		<>
			<button className="w-12 h-12"
				onClick={reference.use}>
				<img src="/images/default.jpg" className="w-12 h-12 rounded-full" alt="" />
			</button>
			{reference.value && <Modal>
				<div className="fixed inset-0"
					onClick={reference.unset} />
				<div className="font-pixel py-2 text-center rounded shadow-lg border-2 border-opposite z-10 min-w-[12rem] bg-zinc-300 dark:bg-zinc-400"
					style={popper.styles.popper}
					{...popper.attributes.popper}
					ref={dropdown.set}>
					<Anchor className="text-sm py-2 px-4 block text-zinc-800 hover:underline"
						href="/profil">
						Profil
					</Anchor>
					<div className="h-0 my-2 border border-solid border-t-0 border-opposite" />
					<a className="text-sm py-2 px-4 block text-zinc-800 hover:underline">
						Play
					</a>
				</div>
			</Modal>}
		</>
	);
}