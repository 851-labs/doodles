import { z } from "zod"

import { URLS } from "@/utils/urls"

class InsufficientCreditsError extends Error {
  constructor() {
    super("Insufficient credits")
    this.name = "InsufficientCreditsError"
  }
}

const Generate3DResponseSchema = z.object({
  success: z.boolean(),
  modelRunId: z.string(),
})

async function generate3DModel(doodleId: string) {
  const response = await fetch(URLS.api.generate3d({ params: { id: doodleId } }), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })

  if (response.status === 402) {
    throw new InsufficientCreditsError()
  }

  if (!response.ok) {
    throw new Error("Failed to start 3D generation")
  }

  const data: unknown = await response.json()
  return Generate3DResponseSchema.parse(data)
}

export { generate3DModel, InsufficientCreditsError }
