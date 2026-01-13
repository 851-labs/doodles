import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"

import { URLS } from "@/utils/urls"

const UserCreditsResponseSchema = z.object({
  balance: z.number(),
  hasPurchased: z.boolean(),
})

async function fetchUserCredits() {
  const response = await fetch(URLS.api.userCredits)

  if (!response.ok) {
    if (response.status === 401) {
      return { balance: 0, hasPurchased: false }
    }
    throw new Error("Failed to fetch credits")
  }

  const data: unknown = await response.json()

  return UserCreditsResponseSchema.parse(data)
}

function getUserCreditsQueryOptions() {
  return queryOptions({
    queryKey: ["userCredits"],
    queryFn: fetchUserCredits,
    staleTime: 30000,
  })
}

export { getUserCreditsQueryOptions }
