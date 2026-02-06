"use client"

import { useEffect, useState } from "react"

import { ProgressBar } from "@/app/doodles/[id]/_components/progress-bar"
import { SketchAnimation } from "@/app/doodles/[id]/_components/sketch-animation"

const SKETCH_GENERATION_DURATION_SECONDS = 17

const GENERATING_MESSAGES = [
  "Sharpening pencils...",
  "Finding inspiration...",
  "Warming up...",
  "Sketching outlines...",
  "Adding details...",
  "Erasing mistakes...",
  "Drawing lines...",
  "Making it cute...",
  "Almost there...",
  "Adding finishing touches...",
  "Thinking creatively...",
  "Doodling away...",
  "Getting artsy...",
  "Being creative...",
  "Making magic...",
  "Bringing ideas to life...",
  "Crafting your doodle...",
  "Working on it...",
  "Creating something special...",
  "Drawing with care...",
  "Perfecting the lines...",
  "Adding character...",
  "Making it unique...",
  "Putting pen to paper...",
  "Letting creativity flow...",
]

const TYPING_SPEED = 50
const BACKSPACE_SPEED = 20
const PAUSE_BEFORE_BACKSPACE = 1500

function useTypewriter(messages: string[]) {
  const [displayText, setDisplayText] = useState("")
  const [messageIndex, setMessageIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentMessage = messages[messageIndex] ?? ""

    if (!isDeleting) {
      if (displayText.length < currentMessage.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentMessage.slice(0, displayText.length + 1))
        }, TYPING_SPEED)
        return () => clearTimeout(timeout)
      }
      const timeout = setTimeout(() => {
        setIsDeleting(true)
      }, PAUSE_BEFORE_BACKSPACE)
      return () => clearTimeout(timeout)
    }

    if (displayText.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1))
      }, BACKSPACE_SPEED)
      return () => clearTimeout(timeout)
    }

    const timeout = setTimeout(() => {
      setIsDeleting(false)
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 0)
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, messageIndex, messages])

  return displayText
}

interface GeneratingStateProps {
  startedAt: Date
}

function GeneratingState({ startedAt }: GeneratingStateProps) {
  const displayText = useTypewriter(GENERATING_MESSAGES)

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
      <ProgressBar durationSeconds={SKETCH_GENERATION_DURATION_SECONDS} isComplete={false} startedAt={startedAt} />
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900" />
      <SketchAnimation />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {displayText}
          <span className="animate-pulse">|</span>
        </p>
      </div>
    </div>
  )
}

export { GeneratingState }
