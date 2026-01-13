import { NextResponse } from "next/server"
import { z } from "zod"

import {
  deductCredits,
  fetchDoodleById,
  refundCredits,
  releaseModelClaim,
  setModelRunId,
  tryClaimModelGeneration,
} from "@/db/queries"
import { LIGHTBOX_3D_CREDIT_COST, LIGHTBOX_3D_INPUT_NODE_ID, LIGHTBOX_3D_PIPELINE_RUNS_URL } from "@/utils/constants"
import { ENV } from "@/utils/env"
import { createClient } from "@/utils/supabase/server"
import { buildPublicUrl, URLS } from "@/utils/urls"

const PipelineResponseSchema = z.object({
  id: z.string(),
  status: z.enum(["pending", "running", "completed", "errored"]),
})

interface RouteContext {
  params: Promise<{ id: string }>
}

async function POST(_: Request, context: RouteContext) {
  const { id: doodleId } = await context.params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const doodle = await fetchDoodleById(doodleId)

  if (!doodle) {
    return NextResponse.json({ error: "Doodle not found" }, { status: 404 })
  }

  if (!doodle.imageUrl) {
    return NextResponse.json({ error: "Doodle has no image" }, { status: 400 })
  }

  if (doodle.modelStatus === "generated" && doodle.modelUrl) {
    return NextResponse.json({ error: "Model already exists" }, { status: 409 })
  }

  const claimResult = await tryClaimModelGeneration(doodleId)

  if (!claimResult.success) {
    return NextResponse.json({ error: "Model already generating" }, { status: 409 })
  }

  const deductResult = await deductCredits(user.id, LIGHTBOX_3D_CREDIT_COST)

  if (!deductResult.success) {
    await releaseModelClaim(doodleId)
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
  }

  try {
    const webhookUrl = `${buildPublicUrl()}${URLS.api.webhooks.lightbox}`

    const response = await fetch(LIGHTBOX_3D_PIPELINE_RUNS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.LIGHTBOX_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: {
          [LIGHTBOX_3D_INPUT_NODE_ID]: doodle.imageUrl,
        },
        webhook_url: webhookUrl,
      }),
    })

    if (!response.ok) {
      await releaseModelClaim(doodleId)
      await refundCredits(user.id, LIGHTBOX_3D_CREDIT_COST)
      const errorText = await response.text()
      return NextResponse.json({ error: `Pipeline API error: ${errorText}` }, { status: response.status })
    }

    const data: unknown = await response.json()
    const pipelineResponse = PipelineResponseSchema.parse(data)

    await setModelRunId(doodleId, pipelineResponse.id)

    return NextResponse.json({
      success: true,
      modelRunId: pipelineResponse.id,
    })
  } catch (error) {
    await releaseModelClaim(doodleId)
    await refundCredits(user.id, LIGHTBOX_3D_CREDIT_COST)
    throw error
  }
}

export { POST }
