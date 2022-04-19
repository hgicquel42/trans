import { SyntheticEvent, useCallback, useState } from "react";
import { useObject } from "../object";

export interface ElementHandle<T extends Element = Element> {
  value: T

  set(x: T): void
  unset(): void

  use(e: SyntheticEvent<T>): void
}

export function useElement<T extends Element = Element>() {
  const [value, setValue] = useState<T | null>(null)
  const set = useCallback((x: T) => setValue(x), [])
  const unset = useCallback(() => setValue(null), [])

  const use = useCallback((e: SyntheticEvent<T>) => {
    setValue(e.currentTarget)
  }, [])

  return useObject({ value, set, unset, use })
}