import { FriendList, FriendRequest } from "comps/friend/friend";
import { Layout } from "comps/layout/layout";
import { useCallback, useState } from "react";

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