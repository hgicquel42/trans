import { useObject } from "libs/react/object";
import { ChildrenProps } from "libs/react/props";
import { createContext, useContext, useEffect, useState } from "react";

export interface ThemeHandle {
  current?: string
  set(theme?: string): void
}

export const ThemeContext =
  createContext<ThemeHandle | undefined>(undefined)

export function useTheme() {
  return useContext(ThemeContext)!
}

export function ThemeProvider(props: ChildrenProps) {
  const [current, set] = useState<string | undefined>(
    () => localStorage.getItem("theme") ?? undefined)
  const handle = useObject<ThemeHandle>({ current, set })

  useEffect(() => {
    const matcher = matchMedia('(prefers-color-scheme: dark)')

    const dark = current
      ? current === "dark"
      : matcher.matches

    if (dark)
      document.documentElement.classList.add("dark")
    else
      document.documentElement.classList.remove("dark")
  }, [current])

  return <ThemeContext.Provider value={handle}>
    {props.children}
  </ThemeContext.Provider>
}