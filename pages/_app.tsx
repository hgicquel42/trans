import { NoSSR } from 'comps/next/nossr'
import { ThemeProvider } from 'comps/theme/context'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

export default function App(props: AppProps) {
  const { Component, pageProps } = props

  return <NoSSR>
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  </NoSSR>
}