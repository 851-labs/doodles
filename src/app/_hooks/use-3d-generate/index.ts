"use client"

import { useCallback } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { usePurchaseSheet } from "@/app/_components/sheets/purchase-sheet"
import { generate3DModel, InsufficientCreditsError } from "@/app/_hooks/use-3d-generate/utils"

function use3DGenerate(doodleId: string) {
  const queryClient = useQueryClient()
  const { openPurchaseSheet } = usePurchaseSheet()

  const { mutate, isPending } = useMutation({
    mutationFn: () => generate3DModel(doodleId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["userCredits"] })
      void queryClient.invalidateQueries({ queryKey: ["doodle-status", doodleId] })
    },
    onError: (error) => {
      if (error instanceof InsufficientCreditsError) {
        openPurchaseSheet()
      }
    },
  })

  const generate = useCallback(() => {
    mutate()
  }, [mutate])

  return {
    generate,
    isGenerating: isPending,
  }
}

export { use3DGenerate }
