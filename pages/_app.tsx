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
      <div className="w-full text-center font-pixel text-8xl underline">
        pong.io
      </div>
      <div className="h-[100px]" />
      <div className="flex items-center gap-2">
        <button className="border-8 border-green-500 text-green-500 p-4 font-bold font-pixel uppercase hover:scale-95 transition-transform">
          <div className="pt-1">Play</div>
        </button>
        <button className="border-8 border-red-500 text-red-500 p-4 font-bold font-pixel uppercase hover:scale-95 transition-transform">
          <div className="pt-1">Leaderboard</div>
        </button>
      </div>
      <div className="my-2" />
      {props.children}
    </div>
  </>
}