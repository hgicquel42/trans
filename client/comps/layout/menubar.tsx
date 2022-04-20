import { Modal } from "comps/modal/modal";
import { Anchor } from "comps/next/anchor";
import { useTheme } from "comps/theme/context";
import { api, asJson, POST, tryAsJson, tryAsText } from "libs/fetch/fetch";
import { useElement } from "libs/react/handles/element";
import { build } from "libs/types/url";
import React, { useCallback, useEffect, useState } from 'react';
import { FaRegLightbulb } from 'react-icons/fa';
import { usePopper } from 'react-popper';

export interface ProfileData {
  name: string
}

export function LayoutMenuBar() {
  const theme = useTheme()

  const reference = useElement<HTMLButtonElement>()
  const dropdown = useElement<HTMLDivElement>()

  const popper = usePopper(
    reference.value, dropdown.value,
    { strategy: "fixed", placement: "bottom-start" })

  const switchTheme = useCallback(() => {
    if (theme.stored === "dark")
      theme.set("light")
    else if (theme.stored === "light")
      theme.set(undefined)
    else if (theme.stored === undefined)
      theme.set("dark")
  }, [theme.stored])

  const [profile, setProfile] = useState<ProfileData>()

  useEffect(() => {
    fetch(api("/profile/me"))
      .then(tryAsJson)
      .then(setProfile)
      .catch(console.error)
  }, [])

  const login = useCallback(async () => {
    const { pathname } = location

    const state = await POST(
      api("/preauth"),
      asJson({ pathname })
    ).then(tryAsText)

    const provider = "https://api.intra.42.fr/oauth/authorize"
    const client_id = process.env.NEXT_PUBLIC_42_UID!
    const redirect_uri = location.origin
    const response_type = "code"
    open(build(provider, { client_id, redirect_uri, response_type, state }), "_self")
  }, [])

  return <div className="w-full max-w-[1200px] m-auto p-4">
    <div className="flex justify-between">
      <button className="p-2 flex items-center"
        onClick={switchTheme}>
        <FaRegLightbulb className="w-6 h-6 text-opposite" />
        <div className="text-sm font-pixel uppercase">
          {theme.stored ?? "auto"}
        </div>
      </button>
      {profile ? <div className="flex">
        <div className="text-xl font-pixel pt-6">
          {profile.name}
        </div>
        <button className="px-2 py-2 w-24"
          onClick={reference.use}>
          <img src="https://pbs.twimg.com/profile_images/1385891929917992960/J7hK0tks_400x400.jpg" className="w-12 h-12 rounded-full" alt="" />
        </button>
        {reference.value && <Modal>
          <div className="fixed inset-0 bg-contrast"
            onClick={reference.unset} />
          <div className="z-10 font-pixel py-2 text-center rounded shadow-lg bg-default border-2 border-black min-w-[12rem]"
            style={popper.styles.popper}
            {...popper.attributes.popper}
            ref={dropdown.set}>
            <Anchor className="text-sm py-2 px-4 block bg-transparent text-zinc-800 hover:underline"
              href="/profil">
              Profil
            </Anchor>
            <div className="h-0 my-2 border border-solid border-t-0 border-black" />
            <a className="text-sm py-2 px-4 block bg-transparent text-zinc-800 hover:underline">
              Disconnect
            </a>
          </div>
        </Modal>}
      </div> : <>
        <button className=""
          onClick={login}>
          Login
        </button>
      </>}
    </div>
  </div>
};