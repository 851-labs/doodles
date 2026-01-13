import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"

import { getCreditPackByPriceId } from "@/utils/constants"
import { ENV } from "@/utils/env"
import { stripe } from "@/utils/stripe/client"
import { createClient } from "@/utils/supabase/server"
import { URLS } from "@/utils/urls"

const PostBodySchema = z.object({
  priceId: z.string().min(1),
  prompt: z.string().optional(),
})

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
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const creditPack = getCreditPackByPriceId(parsed.data.priceId, ENV.NODE_ENV)

  if (!creditPack) {
    return NextResponse.json({ error: "Invalid price ID" }, { status: 400 })
  }

  const headersList = await headers()
  const origin = headersList.get("origin") ?? headersList.get("referer")?.split("/").slice(0, 3).join("/") ?? ""

  const promptParam = parsed.data.prompt ? `&prompt=${encodeURIComponent(parsed.data.prompt)}` : ""

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: parsed.data.priceId,
        quantity: 1,
      },
    ],
    success_url: `${origin}${URLS.purchaseSuccess}${promptParam}`,
    cancel_url: `${origin}${URLS.purchaseCancel}${promptParam}`,
    metadata: {
      userId: user.id,
      credits: creditPack.credits.toString(),
      amountCents: creditPack.amountCents.toString(),
    },
    customer_email: user.email,
  })

  if (!session.url) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }

  return NextResponse.json({ url: session.url })
}

export { POST }
