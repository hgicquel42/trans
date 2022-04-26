import { Layout } from "comps/layout/layout"
import { NoSSR } from 'comps/next/nossr'
import { BoardProvider, ProfilProvider, useProfile } from "comps/profil/context"
import { ThemeProvider } from 'comps/theme/context'
import { api, asJson, POST, tryAsText } from "libs/fetch/fetch"
import { ChildrenProps } from "libs/react/props"
import { asStringOr } from "libs/types/string"
import type { AppProps } from 'next/app'
import Head from "next/head"
import { useRouter } from "next/router"
import { useCallback, useEffect } from "react"
import '../styles/globals.css'

export default function App(props: AppProps) {
	const { Component, pageProps } = props

	return <NoSSR>
		<Head>
			<title>Pong</title>
		</Head>
		<ThemeProvider>
			<BoardProvider>
				<ProfilProvider>
					<CheckConnection>
						<AuthProvider>
							<Component {...pageProps} />
						</AuthProvider>
					</CheckConnection>
				</ProfilProvider>
			</BoardProvider>
		</ThemeProvider>
	</NoSSR>
}

export function CheckConnection(props: ChildrenProps) {
	const profile = useProfile()
	const login = useCallback(async () => {
		open("http://localhost:3001/api/auth/login", "_self")
	}, [])

	if (profile === undefined) {
		return <>
			<Layout>
				<div className="flex justify-center">
					<button className='h-72 w-72 rounded-lg border-8 border-zinc-800 border-double cursor-grab transition-transform hover:scale-105 duration-300 mt-36'
						onClick={login}>
						<div className="flex justify-center">
							<img className="h-60 w-60"
								src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png" />
						</div>
					</button>
				</div>
				<div className="flex justify-center">
					<button onClick={login}>
						<p className="text-zinc-800 font-pixel mt-12 mb-6 text-center text-2xl hover:underline">CONNECT WITH 42</p>
					</button>
				</div>

			</Layout>
		</>
	}
	return <>
		{props.children}
	</>
}

function AuthProvider(props: ChildrenProps) {
	const router = useRouter()

	const code = asStringOr(router.query.code, undefined)
	const state = asStringOr(router.query.state, undefined)

	useEffect(() => {
		if (!code || !state) return

		const redirect = location.origin

		POST(api("/login"), asJson({ code, state, redirect }))
			.then(tryAsText)
			.then(path => open(path, "_self"))
	}, [])

	if (code && state) return null
	return <>{props.children}</>
}