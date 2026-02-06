"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { usePurchaseSheet } from "@/app/_components/sheets/purchase-sheet"
import { generateDoodle, InsufficientCreditsError } from "@/app/_hooks/use-doodle-generate/utils"
import { URLS } from "@/utils/urls"

function useDoodleGenerate() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { openPurchaseSheet } = usePurchaseSheet()

  const { mutate, isPending } = useMutation({
    mutationFn: generateDoodle,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["userCredits"] })
      router.push(URLS.doodle({ params: { id: data.doodleId } }))
    },
    onError: (error) => {
      if (error instanceof InsufficientCreditsError) {
        openPurchaseSheet()
      }
    },
  })

  const generate = useCallback(
    (prompt: string) => {
      mutate(prompt)
    },
    [mutate],
  )

  return {
    generate,
    isGenerating: isPending,
  }
}

export { useDoodleGenerate }
