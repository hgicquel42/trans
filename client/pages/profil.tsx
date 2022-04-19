
import { Layout } from "comps/layout/layout"
import { MatchHistory, Profil } from "comps/profil/profil"
import { useCallback, useState } from "react"


export default function Page() {
  const [history, setHistory] = useState(false)

  const toggleHistory = useCallback(() => {
    setHistory(history => !history)
  }, [])

  return (
    <>
      <Layout>
        <Profil user={"you"} />
        <div className='flex justify-center'>
          <a className="bg-zinc-800 flex flex-col text-center h-20 w-72 pt-5 rounded-lg border-8 scale-90 border-zinc-200 border-double cursor-grab hover:scale-105 transition-transform"
            onClick={toggleHistory}>
            <div className="text-zinc-100 font-pixel font-semibold text-xl tracking-wider">Match History</div>
          </a>
        </div>
        <div className="h-[25px]" />
        <div className='flex justify-center'>
          {history && <MatchHistory />}
        </div>
      </Layout>
    </>
  )
}