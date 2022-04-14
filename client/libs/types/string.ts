export function asString(x: unknown): string {
  if (typeof x === "string") return x
  else throw new TypeError(`${x} is not a string`)
}