import { useState } from "react";
import { BsCheckSquareFill } from 'react-icons/bs';
import { DropdownBoardButton } from "../DropDown/Dropdown";

export function Match(props: { res: boolean }) {
	var bg = "bg-emerald-500"
	if (props.res === false)
		bg = "bg-red-500"
	return (
		<tr>
			<td className={`px-6 py-3 border-b border-black ${bg}`}>
				<div className="flex item-center">
					<div className="px-2 py-2">
						<img src="https://pbs.twimg.com/profile_images/1385891929917992960/J7hK0tks_400x400.jpg" className="w-12 h-12 rounded-full" alt="" />
					</div>
					<div className="text-sm font-pixel pt-6 text-zinc-100">Test</div>
				</div>
			</td>
			<td className={`px-6 py-3 border-b border-black ${bg}`}>
				<div className="font-pixel pt-2 text-zinc-100">5 / 4</div>
			</td>
			<td className={`px-6 py-3 border-b border-black ${bg}`}>
				<div className="font-pixel pt-2 text-zinc-100">Special / Solo</div>
			</td>
			<td className={`px-6 py-3 border-b border-black ${bg}`}>
				<div className="flex item-center">
					<div className="text-sm font-pixel pt-6 text-zinc-100">Test</div>
					<div className="px-2 py-2">
						<DropdownBoardButton />
					</div>
				</div>
			</td>
		</tr >
	)
}

export function MatchHistory() {
	return (
		<>
			<div className="w-full aspect-video border-8 border-opposite">
				<table className="min-w-full">
					<thead>
						<tr>
							<th
								className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-zinc-200"
							>
								Name
							</th>
							<th
								className=" px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-zinc-200"
							>
								Score
							</th>
							<th
								className="px-12 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-zinc-200"
							>
								Mode
							</th>
							<th
								className="px-12 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-zinc-200"
							>
								Name
							</th>
						</tr>
					</thead>
					<tbody>
						<Match res={false} />
						<Match res={false} />
						<Match res={true} />
						<Match res={false} />
						<Match res={true} />
						<Match res={false} />
					</tbody>
				</table >
			</div>
		</>
	)
}

export function YourProfile() {
	const [name, setName] = useState('Username')

	const [image, setImage] = useState()

	const ChangeName = (name: string) => {
		setName(name)
	}

	return (
		<>
			<div className='h-[100px]' />
			<div className='flex justify-center'>
				<button className="relative transition-opacity hover:opacity-75 duration-300">
					<input className="absolute inset-0 opacity-0" type="file" />
					{/* TODO: Changement d'image */}
					<img src='https://pbs.twimg.com/profile_images/1385891929917992960/J7hK0tks_400x400.jpg' className="w-48 h-48 rounded-full" alt="" />
				</button>
			</div>
			<div className='flex justify-center pt-4 font-pixel font-semibold text-xl tracking-wider'>{name}</div>
			<div className="h-[20px]" />
			<div className="flex justify-center">
				<form onSubmit={() => ChangeName(name)}>
					<label>
						<input className="shadow appearance-none border rounded py-2 px-3 font-pixel" id="newname" type="text" placeholder="New Name" onChange={e => setName(e.target.value)} />
						<div className="flex justify-center">
							<button type="submit" className="hover:scale-105 hover:text-red-600 duration-300">
								<BsCheckSquareFill className="w-12 h-12 pt-4"></BsCheckSquareFill>
							</button>
						</div>
					</label>
				</form>
			</div>
			<div className="h-[25px]" />
			<div className='flex justify-center'>
				<a className="bg-zinc-800 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform">
					<div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Disconnect</div>
				</a>
			</div>
		</>
	)
}

export function OtherProfile(props: { isFriend: boolean }) {
	return (
		<>
			<div className='h-[100px]' />
			<div className='flex justify-center'>
				<button className="relative transition-opacity hover:opacity-75 duration-300">
					<img src='https://pbs.twimg.com/profile_images/1385891929917992960/J7hK0tks_400x400.jpg' className="w-48 h-48 rounded-full" alt="" />
				</button>
			</div>
			<div className='flex pt-4 justify-center font-pixel font-semibold text-xl tracking-wider'>Username</div>
			<div className="h-[20px]" />
			<div className="flex justify-center">
			</div>
			<div className="h-[25px]" />
			<div className='flex justify-center'>
				<a className="bg-zinc-800 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform">
					<div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">{props.isFriend ? "Play" : "Add Friend"}</div>
				</a>
			</div>
		</>
	)
}

export function Profil(props: { user: string }) {
	if (props.user === "you")
		return <YourProfile />
	else if (props.user === "friend")
		return <OtherProfile isFriend={false} />
	else
		return <OtherProfile isFriend={true} />
}