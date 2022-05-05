import { FriendList, FriendRequest } from "comps/friend/friend";
import { Layout } from "comps/layout/layout";
import { api, asJson, tryAsText } from "libs/fetch/fetch";
import { useCallback, useEffect, useState } from "react";

export default function Page() {

  const [friendList, setFriendList] = useState(false)
  const [friendRequest, setFriendRequest] = useState(false)
  const [friendName, setFriendName] = useState("")
  const [requestSend, setRequestSend] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [error, setError] = useState(false)

  const toggleFriendList = useCallback(() => {
    setFriendList(friendList => !friendList)
  }, [])

  const toggleFriendRequest = useCallback(() => {
    setFriendRequest(friendRequest => !friendRequest)
  }, [])

  const AddFriend = async (friendName: string) => {
    // console.log(fetch(api("/friends/add"), { method: "POST", ...asJson({ username: friendName }) }))
    const res = await fetch(api("/friends/add"), { method: "POST", ...asJson({ username: friendName }) })
      .then(tryAsText)
    // (res)
    setRequestSend(true)
  }

  useEffect(() => {
    const Id = setInterval(() => setRequestSend(false), 5000);
    return () => clearInterval(Id)
  }, [requestSend])

  return (
    <>
      <Layout>
        <div className="h-[40px]" />
        {requestSend === true ?
          error === false ?
            <p className="text-center font-pixel text-emerald-600 underline pb-4">
              Request Send
            </p> :
            <p className="text-center font-pixel text-red-600 underline pb-4">
              {errorMessage}
            </p>
          :
          <div className="pb-10" />}
        <div className='flex justify-center'>
          <a className="bg-zinc-800 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 duration-300 transition-transform"
            onClick={() => AddFriend(friendName)}>
            <div className="font-pixel font-semibold text-xl tracking-wider">Add Friend</div>
          </a>
        </div>
        <div className="h-[25px]" />
        <div className="flex justify-center">
          <input className="shadow appearance-none border rounded py-2 px-3 font-pixel text-zinc-800" id="username" type="text" placeholder="Username" onChange={e => setFriendName(e.target.value)} />
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