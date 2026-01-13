"use client"

import type { TConductorInstance } from "react-canvas-confetti/dist/types"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import RealisticConfetti from "react-canvas-confetti/dist/presets/realistic"

import { toast } from "@851-labs/ui/components/toast"

import { useUserCredits } from "@/app/_hooks/use-user-credits"

const MAX_POLL_ATTEMPTS = 6
const POLL_INTERVAL_MS = 500

function PurchaseSuccessHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { invalidateCredits } = useUserCredits()

  const isPurchaseSuccess = useMemo(() => searchParams.get("purchase") === "success", [searchParams])
  const promptFromUrl = useMemo(() => searchParams.get("prompt"), [searchParams])

  const [showConfetti, setShowConfetti] = useState(false)
  const [conductor, setConductor] = useState<TConductorInstance>()
  const hasHandledRef = useRef(false)
  const toastIdRef = useRef<string | number | undefined>(undefined)
  const attemptsRef = useRef(0)

  const cleanupUrl = useCallback(() => {
    const url = new URL(window.location.href)
    url.searchParams.delete("purchase")
    if (promptFromUrl) {
      url.searchParams.set("prompt", promptFromUrl)
    }
    router.replace(url.pathname + url.search, { scroll: false })
  }, [router, promptFromUrl])

  const handlePollComplete = useCallback(() => {
    toast.success("Purchase complete! Your credits have been added.", { id: toastIdRef.current })
    setShowConfetti(true)
    cleanupUrl()
  }, [cleanupUrl])

  useEffect(() => {
    if (!isPurchaseSuccess || hasHandledRef.current) return

    hasHandledRef.current = true
    toastIdRef.current = toast.loading("Verifying your purchase...")
    attemptsRef.current = 0

    async function schedulePoll() {
      attemptsRef.current += 1
      await invalidateCredits()

      if (attemptsRef.current >= MAX_POLL_ATTEMPTS) {
        handlePollComplete()
        return
      }

      setTimeout(() => void schedulePoll(), POLL_INTERVAL_MS)
    }

    void schedulePoll()
  }, [isPurchaseSuccess, invalidateCredits, handlePollComplete])

  useEffect(() => {
    if (!showConfetti || !conductor) return
    conductor.shoot()
  }, [showConfetti, conductor])

  if (!showConfetti) return null

  return (
    <RealisticConfetti
      onInit={({ conductor: c }: { conductor: TConductorInstance }) => setConductor(c)}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  )
}

export { PurchaseSuccessHandler }
