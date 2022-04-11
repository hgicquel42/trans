import { useObject } from "libs/react/object";
import { ChildrenProps } from "libs/react/props";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface ThemeHandle {
  stored?: string
  browser: string
  current: string
  set(theme?: string): void
}

export const ThemeContext =
  createContext<ThemeHandle | undefined>(undefined)

export function useTheme() {
  return useContext(ThemeContext)!
}

export function ThemeProvider(props: ChildrenProps) {
  const matcher = useMemo(() => {
    return matchMedia('(prefers-color-scheme: dark)')
  }, [])

  const [browser, setBrowser] = useState(
    () => matcher.matches ? "dark" : "light")
  const [stored, setStored] = useState<string | undefined>(
    () => localStorage.getItem("theme") ?? undefined)

  useEffect(() => {
    const f = () => setBrowser(matcher.matches ? "dark" : "light")
    matcher.addEventListener("change", f)
    return () => matcher.removeEventListener("change", f)
  }, [])

  const current = useMemo(() => {
    return stored ?? browser
  }, [stored, browser])

  useEffect(() => {
    if (current === "dark")
      document.documentElement.classList.add("dark")
    else
      document.documentElement.classList.remove("dark")
  }, [current])

  const set = useCallback((theme?: string) => {
    if (theme)
      localStorage.setItem("theme", theme)
    else
      localStorage.removeItem("theme")
    setStored(theme)
  }, [])

  const handle = useObject<ThemeHandle>({ stored, browser, current, set })

  return <ThemeContext.Provider value={handle}>
    {props.children}
  </ThemeContext.Provider>
}