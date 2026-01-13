"use client"

import { useCallback } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { getUserCreditsQueryOptions } from "@/app/_hooks/use-user-credits/utils"

function useUserCredits() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery(getUserCreditsQueryOptions())

  const invalidateCredits = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["userCredits"] }),
    [queryClient],
  )

  return {
    balance: data?.balance ?? 0,
    hasPurchased: data?.hasPurchased ?? false,
    isLoading,
    error,
    invalidateCredits,
  }
}

export { useUserCredits }
