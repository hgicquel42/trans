import { NoSSR } from 'comps/next/nossr'
import { ThemeProvider } from 'comps/theme/context'
import type { AppProps } from 'next/app'
import Head from "next/head"
import '../styles/globals.css'

export default function App(props: AppProps) {
  const { Component, pageProps } = props

  return <NoSSR>
    <Head>
      <title>Pong</title>
    </Head>
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  </NoSSR>
}
