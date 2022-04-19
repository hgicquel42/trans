import { LayoutMenuBar } from "comps/layout/menubar";
import { Anchor } from "comps/next/anchor";
import { api, asJson, POST, tryAsText } from "libs/fetch/fetch";
import { build } from "libs/types/url";
import React, { useCallback } from 'react';

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
      <LayoutMenuBar />
      <div className="w-full text-center font-pixel text-8xl underline">
        pong.io
      </div>
      <PlayButton />
    </>
  )
}