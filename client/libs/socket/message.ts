export function msg<T>(event: string, data?: T) {
  return JSON.stringify({ event, data })
}