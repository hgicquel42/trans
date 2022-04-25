import { useState } from "react";
import { ImCheckmark, ImCross } from 'react-icons/im';

export function Active() {
	return (
		<div className="inline-flex bg-emerald-100 rounded-full h-full w-20">
			<span className="text-xs font-pixel pl-4 pt-1 leading-5 text-emerald-800">Active</span>
		</div>
	)
}

export function Unavailable() {
	return (
		<div className="inline-flex bg-red-100 rounded-full h-full w-32">
			<span className="text-xs font-pixel pl-5 pt-1 leading-5 text-red-800">Unavailable</span>
		</div>
	)
}

export function Friend(props: { isConnect: boolean }) {

	return (
		<tr className="bg-opposite">
			<td className="px-6 py-3 border-b border-opposite">
				<div className="flex item-center\">
					<div className="px-2 py-2">
						<a className="w-12 h-12"
							href="/profil">
							<img src="/images/default.jpg" className="w-12 h-12 rounded-full" alt="" />
						</a>
					</div>
					<div className="text-sm font-pixel pt-6">Test</div>
				</div>
			</td>
			<td className="px-6 py-3 border-b border-opposite">
				{props.isConnect ? <Active /> : <Unavailable />}
			</td>
			<td className="px-6 py-3 border-b border-opposite">
				<div className="flex item-center font-pixel pt-2">125 / 48</div>
			</td>
		</tr>
	)
}

export function Request() {

	const [isManage, setIsManage] = useState(false)

	function CloseRequest() {
		setIsManage(!isManage)
	}

	if (isManage === true) {
		return (
			<>
			</>
		)
	}
	else {
		return (
			<tr className="bg-opposite">
				<td className="px-6 py-3 border-b border-opposite">
					<div className="flex item-center">
						<div className="px-2 py-2">
							<a className="w-12 h-12"
								href="/profil">
								<img src="/images/default.jpg" className="w-12 h-12 rounded-full" alt="" />
							</a>
						</div>
						<div className="text-sm font-pixel pt-6">Test</div>
					</div>
				</td>
				<td className="px-6 py-3 border-b border-opposite">
					<Active />
				</td>
				<td className="px-8 py-3 border-b border-opposite">
					<div className="flex item-center font-pixel pt-2 gap-4">
						<button className="rounded-lg inline-flex h-8 w-8"
							onClick={CloseRequest}
						>
							<ImCheckmark color="#047857" className="text-4xl pb-4 hover:scale-125" />
						</button>
						<button className="rounded-lg inline-flex h-8 w-8"
							onClick={CloseRequest}
						>
							<ImCross color="#b91c1c" className="text-4xl pb-4 hover:scale-125" />
						</button>
					</div>
				</td>
			</tr>
		)
	}
}

export function FriendList() {
	return (
		<>
			<div className="h-[25px]" />
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
								Status
							</th>
							<th
								className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-contrast"
							>
								Win / Lose
							</th>
						</tr>
					</thead>
					<tbody>
						<Friend isConnect={true} />
						<Friend isConnect={false} />
						<Friend isConnect={true} />
						<Friend isConnect={false} />
						<Friend isConnect={true} />
					</tbody>
				</table >
			</div >
		</>
	)
}

export function FriendRequest() {
	return (
		<>
			<div className="h-[25px]" />
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
								Status
							</th>
							<th
								className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-contrast"
							>
								Request
							</th>
						</tr>
					</thead>
					<tbody>
						<Request />
						<Request />
						<Request />
					</tbody>
				</table >
			</div >
		</>
	)
}