import { Layout } from "comps/layout/layout"
import { NoSSR } from 'comps/next/nossr'
import { ProfileProvider, useProfile } from "comps/profil/context"
import { ThemeProvider } from 'comps/theme/context'
import { ChildrenProps } from "libs/react/props"
import { asStringOr } from "libs/types/string"
import type { AppProps } from 'next/app'
import Head from "next/head"
import { useRouter } from "next/router"
import { ChangeEvent, KeyboardEvent, useCallback, useState } from "react"
import '../styles/globals.css'

export default function App(props: AppProps) {
  const { Component, pageProps } = props

  return <NoSSR>
    <Head>
      <title>Pong</title>
    </Head>
    <ThemeProvider>
      <ProfileProvider>
        <ProfileChecker>
          <Component {...pageProps} />
        </ProfileChecker>
      </ProfileProvider>
    </ThemeProvider>
  </NoSSR>
}

export function TwoFa() {

  const [code, setCode] = useState<string>("")

  const twoFaConnection = () => {
    open(`/api/twofa-auth/authenticate/${code}`, '_self')
  }

  const onEnter = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter')
      twoFaConnection()
  }, [twoFaConnection, code])

  const updateChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.currentTarget.value)
  }, [])

  return <Layout>
    <div className="flex justify-center mt-20 mb-4">
      <p className="text-center text-2xl font-pixel">Enter your Authentification Code :</p>
    </div>
    <div className="flex justify-center mt-8 mb-4">
      <input className="shadow appearance-none border rounded py-2 px-3 font-pixel"
        type="text" placeholder="Authentication Code" value={code} onChange={updateChange} onKeyDown={onEnter}>
      </input>
    </div>
  </Layout>
}

export function ProfileChecker(props: ChildrenProps) {
  const router = useRouter()
  const profile = useProfile()

  const twofa = asStringOr(router.query.twofa, undefined)

  if (twofa)
    return <TwoFa />
  if (profile === undefined)
    return null
  if (profile === null)
    return <LandingPage />
  return <>{props.children}</>
}

export function LandingPage() {
  const login = useCallback(async () => {
    open("/api/auth/login", "_self")
  }, [])

  return <Layout>
    <div className="flex flex-col justify-center items-center">
      <button className='h-72 w-72 rounded-lg border-8 border-zinc-800 border-double bg-white cursor-grab transition-transform hover:scale-105 duration-300 mt-12'
        onClick={login}>
        <div className="flex justify-center">
          <img className="h-60 w-60"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png" />
        </div>
      </button>
      <div className="my-2" />
      <button className="text-default font-pixel text-center text-2xl hover:underline"
        onClick={login}>
        CONNECT WITH 42
      </button>
    </div>
  </Layout>
}