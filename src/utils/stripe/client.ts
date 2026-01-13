import Stripe from "stripe"

import { ENV } from "@/utils/env"

function getStripeClient(): Stripe {
  const secretKey = ENV.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is required")
  }

  return new Stripe(secretKey)
}

const stripe = getStripeClient()

export { stripe }
