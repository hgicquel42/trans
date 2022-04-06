import { useMemo } from "react";

export function useObject<T>(object: T) {
  return useMemo(() => object, Object.values(object))
}