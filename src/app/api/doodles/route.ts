import { NextResponse } from "next/server"
import { z } from "zod"

import { deductCredit, fetchDoodles, insertDoodle, refundCredit } from "@/db/queries"
import { DOODLE_STATUS, LIGHTBOX_INPUT_NODE_ID, LIGHTBOX_PIPELINE_RUNS_URL } from "@/utils/constants"
import { ENV } from "@/utils/env"
import { createClient } from "@/utils/supabase/server"
import { buildPublicUrl, URLS } from "@/utils/urls"

const GetQuerySchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
})

const PostBodySchema = z.object({
  prompt: z.string().min(1).max(200),
})

const PipelineResponseSchema = z.object({
  id: z.string(),
  status: z.enum(["pending", "running", "completed", "errored"]),
})

async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const pageParam = searchParams.get("page")
  const pageSizeParam = searchParams.get("pageSize")

  const params = GetQuerySchema.parse({
    page: pageParam ?? undefined,
    pageSize: pageSizeParam ?? undefined,
  })

  const result = await fetchDoodles(params)

  return NextResponse.json(result)
}

async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body: unknown = await request.json()
  const parsed = PostBodySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 })
  }

  const deductResult = await deductCredit(user.id)

  if (!deductResult.success) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
  }

  try {
    const webhookUrl = `${buildPublicUrl()}${URLS.api.webhooks.lightbox}`

    const response = await fetch(LIGHTBOX_PIPELINE_RUNS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.LIGHTBOX_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: {
          [LIGHTBOX_INPUT_NODE_ID]: parsed.data.prompt,
        },
        webhook_url: webhookUrl,
      }),
    })

    if (!response.ok) {
      await refundCredit(user.id)
      const errorText = await response.text()
      return NextResponse.json({ error: `Pipeline API error: ${errorText}` }, { status: response.status })
    }

    const data: unknown = await response.json()
    const pipelineResponse = PipelineResponseSchema.parse(data)

    const doodle = await insertDoodle({
      userId: user.id,
      prompt: parsed.data.prompt,
      runId: pipelineResponse.id,
      status: DOODLE_STATUS.GENERATING,
    })

    return NextResponse.json({
      doodleId: doodle.id,
    })
  } catch (error) {
    await refundCredit(user.id)
    throw error
  }
}

export { GET, POST }
