"use client"

import { LazyMotion } from "motion/react"

type MotionProviderProps = React.PropsWithChildren

function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion
      strict={false}
      features={async () => (await import("motion/react")).domMax}
    >
      {children}
    </LazyMotion>
  )
}

export { MotionProvider }
