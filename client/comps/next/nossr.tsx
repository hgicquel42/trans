import { ChildrenProps } from "libs/react/props"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export function NoSSR(props: ChildrenProps) {
  const [client, setClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setClient(true)
  }, [])

  if (!client) return null
  if (!router.isReady) return null
  return <>{props.children}</>
}