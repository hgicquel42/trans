import { Modal } from "comps/modal/modal";
import { Anchor } from "comps/next/anchor";
import { useElement } from "libs/react/handles/element";
import { useCallback, useState } from "react";
import { BsCheckSquareFill } from 'react-icons/bs';
import { usePopper } from "react-popper";
import { MatchData, useProfile } from "./context";

export function Match(props: { MatchData: MatchData }) {
	const bg = props.MatchData.result === true
		? "bg-emerald-500"
		: "bg-red-500"

	console.log(props.MatchData.result)

	const profile = useProfile()

	return (
		<tr>
			<td className={`px-6 py-3 border-b border-black ${bg}`}>
				<div className="flex item-center">
					<div className="px-2 py-2">
						<img src={profile.photo} className="w-12 h-12 rounded-full" alt="" />
					</div>
					<div className="text-sm font-pixel pt-6 text-zinc-100">{profile.username}</div>
				</div>
			</td>
			<td className={`px-6 py-3 border-b border-black ${bg}`}>
				<div className="font-pixel pt-2 pl-2 text-zinc-100">{props.MatchData.userScore} / {props.MatchData.opponentScore}</div>
			</td>
			<td className={`px-6 py-3 border-b border-black ${bg}`}>
				<div className="font-pixel pt-2 pl-4 text-zinc-100">{props.MatchData.mode}</div>
			</td>
			<td className={`px-6 py-3 border-b border-black ${bg}`}>
				<div className="flex item-center">
					<div className="text-sm font-pixel pt-6 pl-2 text-zinc-100">Test</div>
					<div className="px-2 py-2">
						<a className="w-12 h-12"
							href="/profil">
							<img src="/images/default.jpg" className="w-12 h-12 rounded-full" alt="" />
						</a>
					</div>
				</div>
			</td>
		</tr >
	)
}

export function MatchHistory() {

	const profile = useProfile()

	return <div className="w-full aspect-video border-8 border-opposite overflow-auto">
		<table className="min-w-full">
			<thead>
				<tr>
					<th className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-zinc-200" >
						Name
					</th>
					<th className=" px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-zinc-200">
						Score
					</th>
					<th className="px-12 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-zinc-200">
						Mode
					</th>
					<th className="px-12 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-zinc-200"  >
						Name
					</th>
				</tr>
			</thead>
			<tbody>
				{profile.history.map(match =>
					<Match key={match.id} MatchData={match} ></Match>)}
			</tbody>
		</table >
	</div>
}

export function YourProfile() {

	const profile = useProfile()

	const [name, setName] = useState("")

	const [image, setImage] = useState<any>()

	const [doubleAuth, setDoubleAuth] = useState(false)

	const ChangeName = () => {
		// setName(name)
		// Call pour push name dans db
	}

	const ChangeImage = (e: any) => {
		const [file] = e.target.files
		setImage(URL.createObjectURL(file))
		// Call pour push img dans db
	}

	const toggleQr = useCallback(() => {
		setDoubleAuth(doubleAuth => !doubleAuth)
	}, [])

	return <>
		<div className='h-[100px]' />
		<div className='flex justify-center'>
			<button className="relative transition-opacity hover:opacity-75 duration-300">
				<input className="absolute inset-0 opacity-0" type="file" onChange={ChangeImage} />
				<img src={profile.photo} className="w-48 h-48 rounded-full" alt="" />
			</button>
		</div>
		<div className='flex justify-center pt-4 font-pixel font-semibold text-xl tracking-wider'>{profile.username}</div>
		<div className="h-[20px]" />
		<div className="flex justify-center">
			<form onSubmit={() => ChangeName()}>
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
			<a className="bg-zinc-800 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform"
				onClick={toggleQr}>
				<div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Double Auth</div>
			</a>
		</div>
		{doubleAuth === true &&
			<>
				<div className="flex justify-center">
					<button className='h-72 w-72 rounded-lg border-8 border-zinc-800 border-double cursor-grab transition-transform hover:scale-105 duration-300 mt-4'
					>
						<div className="flex justify-center">
							<img className="h-60 w-60"
								src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png" />
						</div>
					</button>
				</div>
				<div className="flex justify-center mt-4 mb-4">
					<input className="shadow appearance-none border rounded py-2 px-3 font-pixel" id="code" type="text" placeholder="Code" />
				</div>
			</>}
		<div className='flex justify-center'>
			<a className="bg-zinc-800 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform">
				<div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Disconnect</div>
			</a>
		</div>
	</>
}

export function OtherProfile(props: { isFriend: boolean }) {
	return <>
		<div className='h-[100px]' />
		<div className='flex justify-center'>
			<button className="relative transition-opacity hover:opacity-75 duration-300">
				<img src='/images/default.jpg' className="w-48 h-48 rounded-full" alt="" />
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
}

export function Profil(props: { user: string }) {
	if (props.user === "you")
		return <YourProfile />
	else if (props.user === "friend")
		return <OtherProfile isFriend={true} />
	else
		return <OtherProfile isFriend={false} />
}

export function DropdownChatButton(props: { name: string, color: string, admin: boolean }) {
	const reference = useElement<HTMLButtonElement>()
	const dropdown = useElement<HTMLDivElement>()

	const popper = usePopper(
		reference.value, dropdown.value,
		{ strategy: "fixed", placement: "bottom-start" })

	return <>
		<button className=""
			onClick={reference.use}>
			<p className={`font-pixel ${props.color}`}>{props.name} :</p>
		</button>
		{reference.value && <Modal>
			<div className="fixed inset-0"
				onClick={reference.unset} />
			<div className="font-pixel text-center rounded shadow-lg bg-zinc-300 border-2 border-black z-10 min-w-[12rem]"
				style={popper.styles.popper}
				{...popper.attributes.popper}
				ref={dropdown.set}>
				<Anchor className="text-xs py-2 block bg-transparent text-zinc-800 hover:underline"
					href="/profil">
					Profil
				</Anchor>
				<div className="h-0 border border-solid border-t-0 border-black" />
				<a className="text-xs py-2 block bg-transparent text-zinc-800 hover:underline">
					Play
				</a>
				<div className="h-0 border border-solid border-t-0 border-black" />
				<a className="text-xs py-2 block bg-transparent text-zinc-800 hover:underline">
					Chat
				</a>
			</div>
		</Modal>}
	</>
}
