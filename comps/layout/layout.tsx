import { Anchor } from 'comps/next/anchor'
import { useTheme } from 'comps/theme/context'
import { ChildrenProps } from 'libs/react/props'
import { useCallback } from 'react'

export function Layout(props: ChildrenProps) {
  const theme = useTheme()

  const switchTheme = useCallback(() => {
    if (theme.stored === "dark")
      theme.set("light")
    else if (theme.stored === "light")
      theme.set(undefined)
    else if (theme.stored === undefined)
      theme.set("dark")
  }, [theme.stored])

  return <>
    <div className="w-full max-w-[1200px] m-auto p-4">
      <div className="h-[100px]" />
      <Anchor className="block text-center font-pixel text-8xl underline"
        href="/">
        pong.io
      </Anchor>
      <div className="h-[100px]" />
      <div className="flex flex-wrap items-center gap-2">
        <Anchor className="border-8 border-green-500 text-green-500 p-4 pt-5 font-bold font-pixel uppercase hover:scale-95 transition-transform"
          href="/play">
          Play
        </Anchor>
        <Anchor className="border-8 border-red-500 text-red-500 p-4 pt-5 font-bold font-pixel uppercase hover:scale-95 transition-transform"
          href="/board">
          Leaderboard
        </Anchor>
        <Anchor className="border-8 border-yellow-500 text-yellow-500 p-4 pt-5 font-bold font-pixel uppercase hover:scale-95 transition-transform"
          href="/chat">
          Chat
        </Anchor>
        <div className="grow" />
        <button className="border-8 border-opposite p-4 pt-5 font-bold font-pixel uppercase hover:scale-95 transition-transform"
          onClick={switchTheme}>
          {theme.stored ?? "auto"}
        </button>
      </div>
      <div className="my-2" />
      {props.children}
    </div>
  </>
}