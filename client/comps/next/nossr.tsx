import { ChildrenProps } from "libs/react/props"
import { useRouter } from "next/router"

export function NoSSR(props: ChildrenProps) {
  const router = useRouter()

  if (!router.isReady) return null
  return <>{props.children}</>
}