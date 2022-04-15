import { api, asJson, POST, tryAsText } from "libs/fetch/fetch";
import { asString } from "libs/types/string";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter()

  const code = asString(router.query.code)
  const state = asString(router.query.state)

  useEffect(() => {
    if (!code) return

    function goto(pathname: string) {
      open(pathname, "_self")
    }

    POST(api("/auth"), asJson({ code, state }))
      .then(tryAsText)
      .then(goto)
  }, [code])

  return null
}