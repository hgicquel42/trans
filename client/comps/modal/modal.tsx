import { useStatic } from "libs/react/object"
import { useEffect } from "react"
import { createPortal } from "react-dom"

export function Modal(props: {
  children: React.ReactNode
}) {
  const div = useStatic(() => document.createElement("div"))

  useEffect(() => {
    document.body.appendChild(div)
    return () => void document.body.removeChild(div)
  }, [])

  return createPortal(props.children, div)
}