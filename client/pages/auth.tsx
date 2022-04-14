import { api, asJson, POST, tryAsJson } from "libs/fetch/fetch";
import { asString } from "libs/types/string";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter()

  const code = asString(router.query.code)
  const [token, setToken] = useState<string>()

  useEffect(() => {
    if (!code) return

    POST(api("/auth"), asJson({ code, state: "lol" }))
      .then(tryAsJson)
      .then(setToken)
  }, [code])

  return <>
    {JSON.stringify(token)}
  </>
}