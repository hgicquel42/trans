import { useMemo, useRef } from "react";

export function useObject<T>(object: T) {
  return useMemo(() => object, Object.values(object))
}

export function useStatic<T>(factory: () => T) {
  const ref = useRef<T>()
  if (ref.current === undefined)
    ref.current = factory()
  return ref.current
}