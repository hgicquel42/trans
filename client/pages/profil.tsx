
import { Layout } from "comps/layout/layout"
import { ProfileData, useProfile } from "comps/profil/context"
import { MatchHistory, OtherProfile, YourProfile } from "comps/profil/profil"
import { api, tryAsJson } from "libs/fetch/fetch"
import { asStringOr } from "libs/types/string"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"


export default function Page() {
  const [history, setHistory] = useState(false)

  const router = useRouter()

  const user = asStringOr(router.query.user, undefined)

  const profile = useProfile()

  const [otherprofile, setOtherProfile] = useState<ProfileData>()

  useEffect(() => {
    fetch(api(`/user/${user}`))
      .then(tryAsJson)
      .then(setOtherProfile)
      .catch(console.error)
  }, [])

  const toggleHistory = useCallback(() => {
    setHistory(history => !history)
  }, [])

  if (user === profile.username) {
    return (
      <>
        <Layout>
          <YourProfile />
          <div className='flex justify-center'>
            <a className="bg-zinc-800 flex flex-col text-center h-20 w-80 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform"
              onClick={toggleHistory}>
              <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Match History</div>
            </a>
          </div>
          <div className="h-[25px]" />
          <div className='flex justify-center'>
            {history && <MatchHistory ProfileData={profile} />}
          </div>
        </Layout>
      </>
    )
  }
  else {
    if (otherprofile === undefined) {
      return <Layout>
        <p className="text-center text-4xl font-pixel mt-24">User not found...</p>
      </Layout>
    }
    else {
      return (
        <>
          <Layout>
            <OtherProfile ProfileData={otherprofile} />
            <div className='flex justify-center'>
              <a className="bg-zinc-800 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform"
                onClick={toggleHistory}>
                <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Match History</div>
              </a>
            </div>
            <div className="h-[25px]" />
            <div className='flex justify-center'>
              {!history && <MatchHistory ProfileData={otherprofile} />}
            </div>
          </Layout>
        </>
      )
    }
  }
}