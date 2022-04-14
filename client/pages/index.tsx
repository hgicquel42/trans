import { Layout } from "comps/layout/layout";
import { build } from "libs/types/url";
import { useCallback } from "react";

export default function Page() {

  const login = useCallback(() => {
    const provider = "https://api.intra.42.fr/oauth/authorize"
    const client_id = process.env.NEXT_PUBLIC_42_UID!
    const redirect_uri = `${location.origin}/auth`
    const response_type = "code"
    const state = "lol"
    open(build(provider, { client_id, redirect_uri, response_type, state }))
  }, [])

  return <Layout>
    <button onClick={login}>
      Login
    </button>
  </Layout>
}