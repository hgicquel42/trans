import { build } from "libs/types/url";

export function api(path: string, query?: Record<string, string>) {
  const api = location.protocol === "https:"
    ? process.env.NEXT_PUBLIC_API!
    : location.host
  return build(process.env.NEXT_PUBLIC_API! + path, query)
}

export function POST(input: RequestInfo, init: RequestInit) {
  return fetch(input, { method: "POST", ...init })
}

export function asFormData(data: Record<string, string>): RequestInit {
  const body = new FormData()
  for (const [k, v] of Object.entries(data))
    body.append(k, v)
  return { body: body }
}

export function asJson(data: Record<string, any>) {
  const body = JSON.stringify(data)
  const headers = new Headers({ "Content-Type": "application/json" })
  return { body, headers }
}

export async function tryAsText(res: Response) {
  if (!res.ok)
    throw new Error("HTTP error")
  return await res.text()
}

export async function tryAsJson(res: Response) {
  if (!res.ok)
    throw new Error("HTTP error")
  return await res.json()
}