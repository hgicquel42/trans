import { Anchor } from 'comps/next/anchor'
import { useTheme } from 'comps/theme/context'
import { ChildrenProps } from 'libs/react/props'
import { useCallback } from 'react'
import { DropdownHomeButton } from "../DropDown/Dropdown"

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
      {/* Check if isConnect */}
      <DropdownHomeButton />
      <Anchor className="block text-center font-pixel text-8xl underline"
        href="/">
        pong.io
      </Anchor>
      <div className="h-[100px]" />
      <div className='flex justify-around'>
        <Anchor className="bg-red-600 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
          href="/lobby">
          <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Play</div>
        </Anchor>
        <div className="flex items-center gap-2">
          <Anchor className="bg-sky-600 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
            href="/board">
            <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Board</div>
          </Anchor>
          <Anchor className="bg-yellow-600 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
            href="/chat">
            <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Chat</div>
          </Anchor>
          <Anchor className="bg-emerald-600 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
            href="/friend">
            <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Friend</div>
          </Anchor>
        </div>
      </div>
      <div className="my-2" />
      {props.children}
    </div>
  </>
}