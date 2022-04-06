import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import '../styles/globals.css'

function update(theme?: string) {
  const matcher = matchMedia('(prefers-color-scheme: dark)')

  const dark = theme
    ? theme === "dark"
    : matcher.matches

  if (dark)
    document.documentElement.classList.add("dark")
  else
    document.documentElement.classList.remove("dark")
}

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    update(stored ?? undefined)
  }, [])

  return <Component {...pageProps} />
}
