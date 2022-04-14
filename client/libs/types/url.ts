
export function build(base: string, query?: Record<string, string>) {
  if (!query) return base
  const squery = Object.entries(query)
    .map(([k, v]) => k + "=" + encodeURIComponent(v))
    .join("&")
  if (!squery) return base
  return base + "?" + squery
}