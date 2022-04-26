import { Modal } from "comps/modal/modal"
import { Anchor } from "comps/next/anchor"
import { api, asJson, POST, tryAsText } from "libs/fetch/fetch"
import { useElement } from "libs/react/handles/element"
import { build } from "libs/types/url"
import { useCallback } from "react"
import { AiFillGithub } from 'react-icons/ai'
import { usePopper } from "react-popper"

export default function Page() {

	return <>
		<div className="grid grid-cols-12">
			<div className="col-span-4 bg-zinc-800 h-full flex justify-center border-r-8 border-zinc-400">
				<div>
					{/* <Anchor className='bg-zinc-100 flex flex-col justify-center h-72 w-72 rounded-lg border-8 border-zinc-400 border-double cursor-grab transition-transform hover:scale-105 duration-300 mt-36'
						href="/home"
						onClick={login}
					>
						<div className="flex justify-center">
							<img className="h-60 w-60"
								src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png" />
						</div>
					</Anchor> */}
					<ConnectButton />
					<p className="text-zinc-200 font-pixel mt-12 text-center text-2xl">CONNECT WITH 42</p>
					<div className="flex justify-center mt-48">
						<Anchor className='bg-zinc-100 flex flex-col justify-center h-36 w-36 rounded-lg border-8 border-zinc-400 border-double cursor-grab transition-transform hover:scale-105 duration-300 mt-36'
							href="https://github.com/hgicquel42/trans">
							<div className="text-8xl flex justify-center">
								<AiFillGithub />
							</div>
						</Anchor>
					</div>
					<p className="text-zinc-200 font-pixel mt-12 mb-12 text-center text-2xl">GITHUB
					</p>
				</div>
				<div className="h-[25px] "></div>
			</div>
			<div className="col-span-8 bg-zinc-200 h-full">
				<p className="mt-16 text-center font-pixel text-black text-8xl underline">
					pong.io
				</p>
				<div className="mt-48 flex justify-center">
					<img className="border-8 rounded-lg border-zinc-400 border-double h-2/3 w-3/4"
						src="https://media2.ledevoir.com/images_galerie/nwd_132675_102056/image.jpg"
					/>
				</div>
			</div>
		</div>
	</>
}

export function ConnectButton() {
	const reference = useElement<HTMLButtonElement>()
	const dropdown = useElement<HTMLDivElement>()

	const popper = usePopper(
		reference.value, dropdown.value,
		{ strategy: "fixed", placement: "right" })

	const login = useCallback(async () => {
		const { pathname } = location

		const state = await POST(
			api("/preauth"),
			asJson({ pathname })
		).then(tryAsText)

		const provider = "https://api.intra.42.fr/oauth/authorize"
		const client_id = process.env.NEXT_PUBLIC_42_UID!
		const redirect_uri = location.origin
		const response_type = "code"
		open(build(provider, { client_id, redirect_uri, response_type, state }), "_self")
	}, [])


	return (
		<>
			<button className='bg-zinc-100 flex flex-col justify-center h-72 w-72 rounded-lg border-8 border-zinc-400 border-double cursor-grab transition-transform hover:scale-105 duration-300 mt-36'
				onClick={reference.use}>
				<div className="flex justify-center">
					<img className="h-60 w-60"
						src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png" />
				</div>
			</button>
			{reference.value && <Modal>
				<div className="fixed inset-0"
					onClick={reference.unset} />
				<div className="font-pixel py-2 text-center rounded shadow-lg border-2 border-opposite z-10 min-w-[12rem] bg-zinc-300 dark:bg-zinc-400"
					style={popper.styles.popper}
					{...popper.attributes.popper}
					ref={dropdown.set}>
					<Anchor className="text-sm py-2 px-4 block text-zinc-800 hover:underline"
						href="/home"
						onClick={login}>
						Classic Connection
					</Anchor>
					<div className="h-0 my-2 border border-solid border-t-0 border-opposite" />
					<a className="text-sm py-2 px-4 block text-zinc-800 hover:underline">
						Double Authentification
					</a>
				</div>
			</Modal>}
		</>
	);
}