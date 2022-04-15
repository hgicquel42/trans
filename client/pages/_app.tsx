import { NoSSR } from 'comps/next/nossr'
import { ThemeProvider } from 'comps/theme/context'
import { api, asJson, POST, tryAsText } from "libs/fetch/fetch"
import { ChildrenProps } from "libs/react/props"
import { asStringOr } from "libs/types/string"
import type { AppProps } from 'next/app'
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect } from "react"
import '../styles/globals.css'

export default function App(props: AppProps) {
  const { Component, pageProps } = props

  return <NoSSR>
    <Head>
      <title>Pong</title>
    </Head>
    <ThemeProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  </NoSSR>
}

function AuthProvider(props: ChildrenProps) {
  const router = useRouter()

  const code = asStringOr(router.query.code, undefined)
  const state = asStringOr(router.query.state, undefined)

  useEffect(() => {
    if (!code || !state) return

    function goto(pathname: string) {
      open(pathname, "_self")
    }

    const redirect = location.origin

    POST(api("/auth"), asJson({ code, state, redirect }))
      .then(tryAsText)
      .then(goto)
  }, [])

  if (code && state) return null
  return <>{props.children}</>
}