export function asStringOrThrow(x: unknown) {
  if (typeof x === "string") return x
  else throw new TypeError(`${x} is not a string`)
}

export function asStringOr<T>(x: unknown, or: T) {
  return typeof x === "string" ? x : or
}