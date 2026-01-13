import type Stripe from "stripe"
import { NextResponse } from "next/server"

import { grantCredits } from "@/db/queries"
import { ENV } from "@/utils/env"
import { stripe } from "@/utils/stripe/client"

function isDuplicateCheckoutSession(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }
  return error.message.includes("credit_purchases_stripe_checkout_session_id_unique")
}

function verifyWebhookSignature(body: string, signature: string, secret: string): Stripe.Event | null {
  try {
    return stripe.webhooks.constructEvent(body, signature, secret)
  } catch {
    return null
  }
}

async function POST(request: Request) {
  const webhookSecret = ENV.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured")
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
  }

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  const event = verifyWebhookSignature(body, signature, webhookSecret)

  if (!event) {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object

    const userId = session.metadata?.userId
    const credits = session.metadata?.credits
    const amountCents = session.metadata?.amountCents

    const isDoodlesCheckout = userId && credits && amountCents
    if (!isDoodlesCheckout) {
      return NextResponse.json({ received: true })
    }

    const creditsNumber = parseInt(credits, 10)
    const amountCentsNumber = parseInt(amountCents, 10)

    if (isNaN(creditsNumber) || isNaN(amountCentsNumber)) {
      console.error("Invalid metadata values in doodles checkout", { credits, amountCents })
      return NextResponse.json({ error: "Invalid metadata values" }, { status: 400 })
    }

    try {
      await grantCredits({
        userId,
        credits: creditsNumber,
        amountCents: amountCentsNumber,
        stripeCheckoutSessionId: session.id,
      })
    } catch (error) {
      if (isDuplicateCheckoutSession(error)) {
        return NextResponse.json({ received: true })
      }
      throw error
    }
  }

  return NextResponse.json({ received: true })
}

export { POST }
