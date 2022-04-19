import { useCallback, useState } from "react";
import { useObject } from "../object";

export interface BooleanHandle {
  value: boolean
  enable(): void
  disable(): void
  toggle(): void
}

export function useBoolean(init: boolean) {
  const [value, setValue] = useState(init)
  const enable = useCallback(() => setValue(true), [])
  const disable = useCallback(() => setValue(false), [])
  const toggle = useCallback(() => setValue(x => !x), [])
  return useObject({ value, enable, disable, toggle })
}