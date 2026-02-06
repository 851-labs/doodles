"use client"

import type { TConductorInstance } from "react-canvas-confetti/dist/types"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import RealisticConfetti from "react-canvas-confetti/dist/presets/realistic"

interface ConfettiProps {
  forceShow?: boolean
}

function Confetti({ forceShow }: ConfettiProps) {
  const searchParams = useSearchParams()
  const isNew = searchParams.get("new") === "true" || forceShow
  const [conductor, setConductor] = useState<TConductorInstance>()
  const hasFired = useRef(false)

  useEffect(() => {
    if (!isNew || !conductor || hasFired.current) return

    hasFired.current = true
    conductor.shoot()
  }, [isNew, conductor])

  if (!isNew) return null

  return (
    <RealisticConfetti
      onInit={({ conductor: c }: { conductor: TConductorInstance }) => setConductor(c)}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  )
}

export { Confetti }
