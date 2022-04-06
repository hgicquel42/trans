import { ChildrenProps } from "libs/react/props"
import { useEffect, useState } from "react"

export function NoSSR(props: ChildrenProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  return <>{props.children}</>
}