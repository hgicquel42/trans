import { Anchor } from 'comps/next/anchor'
import { NoSSR } from 'comps/next/nossr'
import { ThemeProvider, useTheme } from 'comps/theme/context'
import { ChildrenProps } from 'libs/react/props'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import '../styles/globals.css'

export default function App(props: AppProps) {
  const { Component, pageProps } = props

  return <NoSSR>
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  </NoSSR>
}

export function Layout(props: ChildrenProps) {
  const theme = useTheme()

  useEffect(() => {
    (window as any).theme = theme
  }, [theme])

  return <>
    <div className="w-full max-w-[1200px] m-auto">
      <div className="h-[100px]" />
      <Anchor className="block m-auto font-pixel text-8xl underline"
        href="/">
        pong.io
      </Anchor>
      <div className="h-[100px]" />
      <div className="flex items-center gap-2">
        <Anchor className="border-8 border-green-500 text-green-500 p-4 font-bold font-pixel uppercase hover:scale-95 transition-transform"
          href="/play">
          <div className="pt-1">Play</div>
        </Anchor>
        <Anchor className="border-8 border-red-500 text-red-500 p-4 font-bold font-pixel uppercase hover:scale-95 transition-transform"
          href="/board">
          <div className="pt-1">Leaderboard</div>
        </Anchor>
        <Anchor className="border-8 border-yellow-500 text-yellow-500 p-4 font-bold font-pixel uppercase hover:scale-95 transition-transform"
          href="/chat">
          <div className="pt-1">Chat</div>
        </Anchor>
      </div>
      <div className="my-2" />
      {props.children}
    </div>
  </>
}