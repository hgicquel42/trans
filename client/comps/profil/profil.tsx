import { api, asJson, PATCH, POST, tryAsJson, tryAsText } from "libs/fetch/fetch";
import { useElement } from "libs/react/handles/element";
import { ChangeEvent, KeyboardEvent, useCallback, useState } from "react";
import { BsCheckSquareFill } from 'react-icons/bs';
import { usePopper } from "react-popper";
import { MatchData, ProfileData, useProfile } from "./context";

export function Match(props: { MatchData: MatchData }) {
  const bg = props.MatchData.result === true
    ? "bg-emerald-500"
    : "bg-red-500"

  const profile = useProfile()

  return (
    <tr>
      <td className={`px-6 py-3 border-b border-black ${bg}`}>
        <div className="flex item-center">
          <div className="px-2 py-2">
            <img src={profile.photo} className="w-12 h-12 rounded-full" alt="" />
          </div>
          <div className="text-sm font-pixel pt-6 text-zinc-100">{profile.username}</div>
        </div>
      </td>
      <td className={`px-6 py-3 border-b border-black ${bg}`}>
        <div className="font-pixel pt-2 pl-2 text-zinc-100">{props.MatchData.userScore} / {props.MatchData.opponentScore}</div>
      </td>
      <td className={`px-6 py-3 border-b border-black ${bg}`}>
        <div className="font-pixel pt-2 pl-4 text-zinc-100">{props.MatchData.mode}</div>
      </td>
      <td className={`px-6 py-3 border-b border-black ${bg}`}>
        <div className="flex item-center">
          <div className="text-sm font-pixel pt-6 pl-2 text-zinc-100">{props.MatchData.opponent.username}</div>
          <div className="px-2 py-2">
            <a className="w-12 h-12"
              href="/profil">
              <img src={props.MatchData.opponent.photo} className="w-12 h-12 rounded-full" alt="" />
            </a>
          </div>
        </div>
      </td>
    </tr >
  )
}

export function MatchHistory(props: { ProfileData: ProfileData | undefined }) {

  return <div className="w-full aspect-video border-8 border-opposite overflow-auto">
    <table className="min-w-full">
      <thead>
        <tr>
          <th className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-zinc-200" >
            Name
          </th>
          <th className=" px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-zinc-200">
            Score
          </th>
          <th className="px-12 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-zinc-200">
            Mode
          </th>
          <th className="px-12 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-zinc-200"  >
            Name
          </th>
        </tr>
      </thead>
      <tbody>
        {props.ProfileData?.history !== undefined &&
          props.ProfileData?.history.map(match =>
            <Match key={match.id} MatchData={match} ></Match>)
        }
      </tbody>
    </table >
  </div>
}

export function YourProfile() {

  const profile = useProfile()

  const [name, setName] = useState("")

  const [image, setImage] = useState<any>()

  const [doubleAuth, setDoubleAuth] = useState<boolean>(profile.twoFA)
  const [genQrcode, setGenQrcode] = useState<boolean>(false)
  const [qrcode, setQrcode] = useState<string>()
  const [code, setCode] = useState<string>()

  const ChangeName = useCallback(async (username: string) => {
    const result = await PATCH(
      api("/user/edit"),
      asJson({ username })
    ).then(tryAsText)
    if (result === 'Username already used')
      return
    open(`https://localhost:8080/profil?user=${name}`, '_self')
  }, [])

  const ChangeImage = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) return
    const [file] = e.currentTarget.files
    const body = new FormData()
    body.append("file", file, file.name)
    const data = await POST(`https://ipfs.infura.io:5001/api/v0/add`, { body })
      .then(tryAsJson)
    setImage(`https://ipfs.infura.io/ipfs/${data.Hash}`)
    // Call pour push img dans db
  }, [])

  const manageTwoFa = useCallback(async () => {
    if (!doubleAuth) {
      if (!genQrcode) {
        await fetch(api('/twofa-auth/generate'))
          .then(res => res.url)
          .then(setQrcode)
        setGenQrcode(true)
      } else
        setGenQrcode(false)
    } else {
      await PATCH(api('/twofa-auth/turn-off'), {})
      setDoubleAuth(false)
      setGenQrcode(false)
    }
  }, [])

  const updateCode = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.currentTarget.value)
  }, [])

  const turnOnTwoFa = useCallback(async () => {
    setDoubleAuth(true)
    await POST(
      api('/twofa-auth/turn-on'),
      asJson({ twoFaAuthCode: code }))
  }, [])

  const onEnter = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter')
      turnOnTwoFa()
  }, [turnOnTwoFa, code])

  const handleDisconnect = useCallback(() => {
    open(api('/auth/logout'), '_self')
  }, [])

  return <>
    <div className='h-[100px]' />
    <div className='flex justify-center'>
      <button className="relative transition-opacity hover:opacity-75 duration-300">
        <input className="absolute inset-0 opacity-0" type="file" onChange={ChangeImage} />
        <img src={image ?? profile.photo} className="w-48 h-48 rounded-full" alt="" />
      </button>
    </div>
    <div className='flex justify-center pt-4 font-pixel font-semibold text-xl tracking-wider'>{profile.username}</div>
    <div className="h-[20px]" />
    <div className="flex justify-center">
      <label>
        <input className="shadow appearance-none border rounded py-2 px-3 font-pixel" id="newname" type="text" placeholder="New Name" onChange={e => setName(e.target.value)} />
        <div className="flex justify-center">
          <a type="submit" className="hover:scale-105 hover:text-red-600 duration-300"
            onClick={() => ChangeName(name)}>
            <BsCheckSquareFill className="w-12 h-12 pt-4"></BsCheckSquareFill>
          </a>
        </div>
      </label>
    </div>
    <div className="h-[25px]" />
    <div className='flex justify-center'>
      <a className="bg-zinc-800 flex flex-col text-center h-20 w-80 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform"
        onClick={() => manageTwoFa()}>
        {doubleAuth ? <div className="text-zinc-100 font-pixel font-semibold tracking-wider">Disable Double Auth</div> :
          <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Enable Double Auth</div>}
      </a>
    </div>
    {!doubleAuth && <>
      {genQrcode === true &&
        <>
          <div className="flex justify-center">
            <button className='h-80 w-80 rounded-lg border-8 border-zinc-800 border-double cursor-grab transition-transform hover:scale-105 duration-300 mt-4'
            >
              <div className="flex justify-center">
                <img className="h-60 w-60"
                  src={qrcode} />
              </div>
            </button>
          </div>
          <div className="flex justify-center mt-4 mb-4">
            <input className="shadow appearance-none border rounded py-2 px-3 font-pixel"
              type="text" placeholder="Authentication Code"
              value={code} onChange={updateCode}
              onKeyDown={onEnter}>
            </input>
          </div>
        </>
      }
    </>
    }
    <div className='flex justify-center'>
      <a className="bg-zinc-800 flex flex-col text-center h-20 w-80 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform"
        onClick={handleDisconnect}>
        <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Disconnect</div>
      </a>
    </div>
  </>
}

export function OtherProfile(props: { ProfileData: ProfileData | undefined }) {
  return <>
    <div className='h-[100px]' />
    <div className='flex justify-center'>
      <button className="relative transition-opacity hover:opacity-75 duration-300">
        <img src={props.ProfileData?.photo} className="w-48 h-48 rounded-full" alt="" />
      </button>
    </div>
    <div className='flex pt-4 justify-center font-pixel font-semibold text-xl tracking-wider'>{props.ProfileData?.username}</div>
    <div className="h-[20px]" />
    <div className="flex justify-center">
    </div>
  </>
}

export function DropdownChatButton(props: { name: string, color: string, admin: boolean }) {
  const reference = useElement<HTMLButtonElement>()
  const dropdown = useElement<HTMLDivElement>()

  const popper = usePopper(
    reference.value, dropdown.value,
    { strategy: "fixed", placement: "bottom-start" })

  return <>
    <a className=""
      href={`/profil?user=${props.name}`}>
      <p className={`font-pixel ${props.color}`}>{props.name} :</p>
    </a>
  </>
}
