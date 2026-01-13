"use client"

import { memo, useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@851-labs/ui/primitives/utils/cn"

interface ProgressBarProps {
  durationSeconds: number
  isComplete: boolean
  startedAt?: Date
}

function ProgressBarComponent({ durationSeconds, isComplete, startedAt }: ProgressBarProps) {
  const [progress, setProgress] = useState(0)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (isComplete) return

    startTimeRef.current ??= startedAt?.getTime() ?? Date.now()

    const duration = durationSeconds * 1000
    const startTime = startTimeRef.current

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const percentage = Math.min((elapsed / duration) * 95, 95)
      setProgress(percentage)
    }, 100)

    return () => clearInterval(interval)
  }, [durationSeconds, isComplete, startedAt])

  const displayProgress = useMemo(() => (isComplete ? 100 : progress), [isComplete, progress])

  return (
    <div className="absolute top-0 right-0 left-0 z-10 h-0.5 overflow-hidden">
      <div
        className={cn("h-full bg-black transition-[width] duration-100 ease-linear dark:bg-white")}
        style={{ width: `${displayProgress}%` }}
      />
    </div>
  )
}

const ProgressBar = memo(ProgressBarComponent)

export { ProgressBar }
