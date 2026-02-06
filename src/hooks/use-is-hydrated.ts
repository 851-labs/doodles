"use client"

import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

function useIsHydrated() {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  return { isHydrated }
}

export { useIsHydrated }
