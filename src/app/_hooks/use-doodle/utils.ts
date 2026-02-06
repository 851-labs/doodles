import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"

import { URLS } from "@/utils/urls"

const DoodleResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  prompt: z.string(),
  imageUrl: z.string().nullable(),
  runId: z.string(),
  status: z.string(),
  modelUrl: z.string().nullable(),
  modelPosterUrl: z.string().nullable(),
  modelRunId: z.string().nullable(),
  modelStatus: z.string().nullable(),
  modelGenerationStartedAt: z.string().nullable(),
  createdAt: z.string(),
})

type DoodleResponse = z.infer<typeof DoodleResponseSchema>

async function fetchDoodle(doodleId: string): Promise<DoodleResponse> {
  const response = await fetch(URLS.api.doodleStatus({ params: { id: doodleId } }))
  if (!response.ok) throw new Error("Failed to fetch doodle")

  const data: unknown = await response.json()
  return DoodleResponseSchema.parse(data)
}

function getDoodleQueryOptions(doodleId: string) {
  return queryOptions({
    queryKey: ["doodle", doodleId],
    queryFn: () => fetchDoodle(doodleId),
  })
}

export { getDoodleQueryOptions }
export type { DoodleResponse }
