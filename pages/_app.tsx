import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import '../styles/globals.css'

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props

  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<string>()

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    setTheme(stored ?? undefined)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const matcher = matchMedia('(prefers-color-scheme: dark)')

    const dark = theme
      ? theme === "dark"
      : matcher.matches

    if (dark)
      document.documentElement.classList.add("dark")
    else
      document.documentElement.classList.remove("dark")
  }, [theme])

  return <Component {...pageProps} />
}
