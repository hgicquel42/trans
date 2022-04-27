<<<<<<< HEAD
import { Modal } from "comps/modal/modal"
import { Anchor } from "comps/next/anchor"
import { api } from "libs/fetch/fetch"
import { useElement } from "libs/react/handles/element"
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
		/*const { pathname } = location

		const state = await POST(
			api("/preauth"),
			asJson({ pathname })
		).then(tryAsText)

		const provider = "https://api.intra.42.fr/oauth/authorize"
		const client_id = process.env.NEXT_PUBLIC_42_UID!
		const redirect_uri = location.origin
		const response_type = "code"
		open(build(provider, { client_id, redirect_uri, response_type, state }), "_self")*/
		open('https://localhost:8080/api/auth/login', '_self')
	}, [])

=======
import { LayoutMenuBar } from "comps/layout/menubar";
import { Anchor } from "comps/next/anchor";
import React from 'react';

function PlayButton() {
  return <div className='w-full'>
    <div className='h-[200px]' />
    <div className='flex justify-around'>
      <Anchor className='bg-sky-600 flex flex-col justify-center h-56 w-56 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab transition-transform hover:scale-105 duration-300'
        href="/board">
        <div className='text-zinc-100 font-pixel text-center align-middle font-semibold text-4xl tracking-wider '>BOARD</div>
      </Anchor>
      <Anchor className='bg-red-600 flex flex-col justify-center h-96 w-96 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab transition-transform hover:scale-105 duration-300'
        href='/lobby'>
        <div className='text-zinc-100 font-pixel text-center font-semibold text-7xl tracking-wider'>PLAY</div>
      </Anchor>
      <Anchor className='bg-emerald-600 flex flex-col justify-center h-56 w-56 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover: hover:scale-105 transition-transform duration-300'
        href="/friend">
        <div className='text-zinc-100 font-pixel text-center font-semibold text-4xl tracking-wider'>FRIEND</div>
      </Anchor>
    </div>
    <div className='h-[100px]' />
    <div className='flex justify-center'>
      <Anchor className='bg-yellow-600 flex flex-col justify-center h-56 w-56 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform duration-300'
        href="/chat">
        <div className='text-zinc-100 font-pixel text-center font-semibold text-4xl tracking-wider'>CHAT</div>
      </Anchor>
    </div>
    <div className='h-[50px]' />
    <div className='flex justify-around'>
      <Anchor className='bg-zinc-800 flex flex-col justify-center h-28 w-96 pt-3 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform'
        href='/profil'>
        <a className='text-zinc-100 font-pixel text-center font-semibold text-4xl tracking-wider'>PROFIL</a>
      </Anchor>
      <Anchor className='bg-zinc-800 flex flex-col text-center h-28 w-96 pt-8 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform duration-300'
        href="https://github.com/hgicquel42/trans">
        <div className='text-zinc-100 font-pixel font-semibold text-4xl tracking-wider'>GITHUB</div>
      </Anchor>
    </div>
  </div>
}

export default function Page() {
>>>>>>> effe6c6999e2b6acac656216e9ab266c41212266

  return (
    <>
      <LayoutMenuBar />
      <div className="w-full text-center font-pixel text-8xl underline">
        pong.io
      </div>
      <PlayButton />
    </>
  )
}