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
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  </NoSSR>
}

function Layout(props: ChildrenProps) {
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
      <div className="flex items-center">
        <button className="border-8 border-opposite p-4 font-bold font-pixel hover:scale-95 transition-transform">
          Leaderboard
        </button>
      </div>
      <div className="my-2" />
      {props.children}
    </div>
  </>
}