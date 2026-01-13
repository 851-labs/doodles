import { infiniteQueryOptions } from "@tanstack/react-query"
import { z } from "zod"

import type { Doodle } from "@/db/schema"
import { URLS } from "@/utils/urls"

const DoodleSchema = z.object({
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

const FetchDoodlesResponseSchema = z.object({
  doodles: z.array(DoodleSchema),
  nextPage: z.number().nullable(),
})

async function fetchDoodlesFromApi(page: number): Promise<{ doodles: Doodle[]; nextPage: number | null }> {
  const response = await fetch(`${URLS.api.doodles}?page=${page}`)
  if (!response.ok) {
    throw new Error("Failed to fetch doodles")
  }

  const data: unknown = await response.json()
  const parsed = FetchDoodlesResponseSchema.parse(data)

  return {
    doodles: parsed.doodles.map((d) => ({
      ...d,
      modelGenerationStartedAt: d.modelGenerationStartedAt ? new Date(d.modelGenerationStartedAt) : null,
      createdAt: new Date(d.createdAt),
    })),
    nextPage: parsed.nextPage,
  }
}

function getDoodlesQueryOptions() {
  return infiniteQueryOptions({
    queryKey: ["doodles"],
    queryFn: ({ pageParam }) => fetchDoodlesFromApi(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })
}

export { getDoodlesQueryOptions }
