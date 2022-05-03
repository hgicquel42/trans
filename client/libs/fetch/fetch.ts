import { build } from "libs/types/url";

export function api(path: string, query?: Record<string, string>) {
  return build("/api" + path, query)
}

export function POST(input: RequestInfo, init: RequestInit) {
  return fetch(input, { method: "POST", ...init })
}

export function PATCH(input: RequestInfo, init: RequestInit) {
  return fetch(input, { method: "PATCH", ...init })
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

export async function tryAsData(res: Response) {
  if (!res.ok)
    throw new Error("HTTP error")
  const json = await res.json()
  return json.data
}