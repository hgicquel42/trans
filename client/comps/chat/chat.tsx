import { DropdownChatButton, Modal } from "comps/DropDown/Dropdown";
import { useCallback, useState } from "react";
import { AiFillLock } from 'react-icons/ai';
import { IoSend } from 'react-icons/io5';

export function ChatList(props: { hover: string }) {
  return (
    <>
      <div className={`${props.hover} duration-300`}>
        <div className="h-[15px]"></div>
        <tr>
          <td className="w-3/5 font-pixel text-zinc-800 text-sm pl-4 pb-2 border-b-2 border-opposite">
            #Chat 1
          </td>
          <td className="pl-6 border-b-2 text-zinc-800 border-opposite w-24">
            <AiFillLock />
          </td>
          <td className="pl-4 border-b-2 border-opposite" />
        </tr>
      </div>
    </>
  )
}

export function CreateChannel() {
  const [create, setCreate] = useState(false)

  const toggleCreateChannel = useCallback(() => {
    setCreate(create => !create)
  }, [])
  if (create) {
    return <>
      <div className="bg-contrast py-4 border-t-2 border-opposite flex justify-center">
        <Modal>
          <div className="absolute inset-0"
            onClick={toggleCreateChannel} />
        </Modal>
        <div className="flex-1 mx-4">
          <input className="z-10 relative text-zinc-800 w-full border-2 border-opposite rounded px-2 py-2" type={"text"} placeholder="Your Chat">
          </input>
        </div>
      </div>
    </>
  }
  else {
    return <>
      <button className="bg-contrast px-4 py-4 border-t-2 border-opposite flex justify-center h-[78px] pt-7 text-xl hover:underline"
        onClick={toggleCreateChannel}>
        <tr>
          <td className="w-4/5 font-pixel text-zinc-800 pb-2">
            Create Chat
          </td>
        </tr>
      </button>
    </>
  }

}

export function MyMessage(props: { name: string, msg: string }) {
  return (
    <>
      <div className="h-[25px]" />
      <div className="flex justify-start pl-4">
        <div className=" bg-zinc-100 rounded shadow-xl py-2 px-3 max-w-md">
          {/* <p className="font-pixel text-blue-500">{props.name} :</p> */}
          <DropdownChatButton />
          <p className="text-zinc-800">{props.msg}</p>
        </div>
      </div>
    </>
  )
}

export function OtherMessage(props: { name: string, msg: string, color: string }) {
  return (
    <>
      <div className="h-[25px]" />
      <div className="flex justify-end pr-4">
        <div className=" bg-zinc-100 rounded shadow-xl py-2 px-3 max-w-md">
          <p className={`font-pixel ${props.color}`}>{props.name} :</p>
          <p className="text-zinc-800">{props.msg}</p>
        </div>
      </div>
    </>
  )
}

export function SystemMessage(props: { msg: string }) {
  return (
    <>
      <div className="h-[25px]" />
      <div className="flex justify-center">
        <div className=" bg-yellow-300 rounded shadow-xl py-2 px-3 max-w-md">
          <p className={`font-pixel text-zinc-800`}>System :</p>
          <p className="font-mono text-sm text-zinc-800">{props.msg}</p>
        </div>
      </div>
    </>
  )
}

export function InputMessage() {
  return (
    <>
      <div className="bg-contrast px-4 py-4 border-t-2 border-opposite flex justify-center">
        <div className="flex-1 mx-4">
          <input className="relative text-zinc-800 w-full border-2 border-opposite rounded px-2 py-2" type={"text"} placeholder="Your Message">
          </input>
        </div>
        <button>
          <IoSend className="text-3xl text-zinc-800" />
        </button>
      </div>
    </>
  )
}