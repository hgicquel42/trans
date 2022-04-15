import { Layout } from "comps/layout/layout";
import { useCallback, useState } from "react";
import { ImCheckmark, ImCross } from 'react-icons/im';
import { DropdownBoardFriendButton } from "../comps/DropDown/Dropdown";

function Active() {
  return (
    <div className="inline-flex bg-emerald-100 rounded-full h-full w-20">
      <span className="text-xs font-pixel pl-4 pt-1 leading-5 text-emerald-800">Active</span>
    </div>
  )
}

function Unavailable() {
  return (
    <div className="inline-flex bg-red-100 rounded-full h-full w-32">
      <span className="text-xs font-pixel pl-5 pt-1 leading-5 text-red-800">Unavailable</span>
    </div>
  )
}

function Friend() {

  return (
    <tr className="bg-opposite">
      <td className="px-6 py-3 border-b border-opposite">
        <div className="flex item-center\">
          <div className="px-2 py-2">
            <DropdownBoardFriendButton />
          </div>
          <div className="text-sm font-pixel pt-6">Test</div>
        </div>
      </td>
      <td className="px-6 py-3 border-b border-opposite">
        <Unavailable />
      </td>
      <td className="px-6 py-3 border-b border-opposite">
        <div className="flex item-center font-pixel pt-2">125 / 48</div>
      </td>
    </tr>
  )
}

function FriendConnect() {

  return (
    <tr className="bg-opposite">
      <td className="px-6 py-3 border-b border-opposite">
        <div className="flex item-center\">
          <div className="px-2 py-2">
            <DropdownBoardFriendButton />
          </div>
          <div className="text-sm font-pixel pt-6">Test</div>
        </div>
      </td>
      <td className="px-6 py-3 border-b border-opposite">
        <Active />
      </td>
      <td className="px-6 py-3 border-b border-opposite">
        <div className="flex item-center font-pixel pt-2">125 / 48</div>
      </td>
    </tr>
  )
}

function Request() {
  return (
    <tr className="bg-opposite">
      <td className="px-6 py-3 border-b border-opposite">
        <div className="flex item-center">
          <div className="px-2 py-2">
            <DropdownBoardFriendButton />
          </div>
          <div className="text-sm font-pixel pt-6">Test</div>
        </div>
      </td>
      <td className="px-6 py-3 border-b border-opposite">
        <Active />
      </td>
      <td className="px-8 py-3 border-b border-opposite">
        <div className="flex item-center font-pixel pt-2 gap-4">
          <button className="rounded-lg inline-flex h-8 w-8">
            <ImCheckmark color="#047857" className="text-4xl pb-4 hover:scale-125" />
          </button>
          <button className="rounded-lg inline-flex h-8 w-8">
            <ImCross color="#b91c1c" className="text-4xl pb-4 hover:scale-125" />
          </button>
        </div>
      </td>
    </tr>
  )
}

function FriendList() {
  return (
    <>
      <div className="h-[25px]" />
      <div className="w-full aspect-video border-8 border-opposite">
        <table className="min-w-full">
          <thead>
            <tr>
              <th
                className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-contrast"
              >
                Name
              </th>
              <th
                className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-contrast"
              >
                Status
              </th>
              <th
                className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-contrast"
              >
                Win / Lose
              </th>
            </tr>
          </thead>
          <tbody>
            <Friend />
            <FriendConnect />
            <Friend />
            <Friend />
            <FriendConnect />
          </tbody>
        </table >
      </div >
    </>
  )
}

function FriendRequest() {
  return (
    <>
      <div className="h-[25px]" />
      <div className="w-full aspect-video border-8 border-opposite">
        <table className="min-w-full">
          <thead>
            <tr>
              <th
                className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-contrast"
              >
                Name
              </th>
              <th
                className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-contrast"
              >
                Status
              </th>
              <th
                className="px-6 py-3 text-sm pt-4 font-pixel leading-4 tracking-wider text-left text-black uppercase border-b border-black bg-contrast"
              >
                Request
              </th>
            </tr>
          </thead>
          <tbody>
            <Request />
            <Request />
            <Request />
          </tbody>
        </table >
      </div >
    </>
  )
}

export default function Page() {

  const [friendList, setFriendList] = useState(false)
  const [friendRequest, setFriendRequest] = useState(false)

  const toggleFriendList = useCallback(() => {
    setFriendList(friendList => !friendList)
  }, [])

  const toggleFriendRequest = useCallback(() => {
    setFriendRequest(friendRequest => !friendRequest)
  }, [])

  return (
    <>
      <Layout>
        <div className="h-[50px]" />
        <div className='flex justify-center'>
          <a className="bg-zinc-800 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform">
            <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Add Friend</div>
          </a>
        </div>
        <div className="h-[25px]" />
        <div className="flex justify-center">
          <input className="shadow appearance-none border rounded py-2 px-3 font-pixel" id="username" type="text" placeholder="Username" />
        </div>
        <div className='h-[25px]' />
        <div className='flex justify-center'>
          <a className="bg-zinc-800 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
            onClick={toggleFriendList}>
            <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Friend List</div>
          </a>
        </div>
        {friendList && <FriendList />}
        <div className='h-[25px]' />
        <div className='flex justify-center'>
          <a className="bg-zinc-800 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
            onClick={toggleFriendRequest}>
            <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Friend Request</div>
          </a>
        </div>
        {friendRequest && <FriendRequest />}
      </Layout>
    </>
  )
}