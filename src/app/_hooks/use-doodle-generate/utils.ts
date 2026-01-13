import { z } from "zod"

import { URLS } from "@/utils/urls"

class InsufficientCreditsError extends Error {
  constructor() {
    super("Insufficient credits")
    this.name = "InsufficientCreditsError"
  }
}

const GenerateResponseSchema = z.object({
  doodleId: z.string(),
})

async function generateDoodle(prompt: string) {
  const response = await fetch(URLS.api.doodles, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })

  if (response.status === 402) {
    throw new InsufficientCreditsError()
  }

  if (!response.ok) {
    throw new Error("Failed to start generation")
  }

  const data: unknown = await response.json()
  return GenerateResponseSchema.parse(data)
}

export { generateDoodle, InsufficientCreditsError }
