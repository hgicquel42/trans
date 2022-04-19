import { DropdownBoardButton } from "comps/DropDown/Dropdown";
import { Layout } from "comps/layout/layout";

function Board(props: { pos: number, bg: string }) {

	return (
		<tr>
			<td className={`px-6 py-3 border-b border-opposite ${props.bg}`}>
				<div className="flex item-center\">
					<div className="px-2 py-2">
						<DropdownBoardButton />
					</div>
					<div className="text-sm font-pixel pt-6">Test</div>
				</div>
			</td>
			<td className={`px-6 py-3 border-b border-opposite ${props.bg}`}>
				<div className="font-pixel pt-2"># {props.pos}</div>
			</td>
			<td className={`px-6 py-3 border-b border-opposite ${props.bg}`}>
				<div className="flex item-center font-pixel pt-2">125 / 48</div>
			</td>
		</tr>
	)
}

export default function Page() {

	return <Layout>
		<div className='h-[50px]' />
		<div className="w-full text-center font-pixel text-4xl">pong.board</div>
		<div className='h-[50px]' />
		<div className="w-full aspect-video border-8 border-opposite">
			<table className="min-w-full">
				<thead>
					<tr>
						<th
							className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-contrast"
						>
							Name
						</th>
						<th
							className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-contrast"
						>
							Position
						</th>
						<th
							className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-contrast"
						>
							Win / Lose
						</th>
					</tr>
				</thead>
				<tbody>
					<Board pos={1} bg={'bg-yellow-400'} />
					<Board pos={2} bg={'bg-neutral-400'} />
					<Board pos={3} bg={'bg-yellow-700'} />
					<Board pos={4} bg={'bg-opposite'} />
					<Board pos={5} bg={'bg-opposite'} />
					<Board pos={6} bg={'bg-opposite'} />
					<Board pos={7} bg={'bg-opposite'} />
					<Board pos={8} bg={'bg-opposite'} />
					<Board pos={9} bg={'bg-opposite'} />

				</tbody>
			</table >
		</div >
	</Layout >
}