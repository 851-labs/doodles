import type { ENV } from "@/utils/env"

interface CreditPack {
  priceId: string
  name: string
  credits: number
  amountCents: number
}

type CreditPacksByEnvironment = Record<typeof ENV.NODE_ENV, CreditPack[]>

const CREDIT_PACKS: CreditPacksByEnvironment = {
  development: [
    {
      priceId: "price_1SfpfLCEB4zo9bOVAAt2QNDR",
      name: "Starter",
      credits: 5,
      amountCents: 100,
    },
    {
      priceId: "price_1SfpfRCEB4zo9bOVMa4vgXm0",
      name: "Standard",
      credits: 30,
      amountCents: 500,
    },
    {
      priceId: "price_1SfpfWCEB4zo9bOVkbw21cZB",
      name: "Pro",
      credits: 60,
      amountCents: 1000,
    },
  ],
  production: [
    {
      priceId: "price_1SfphOCEB4zo9bOVs9j7gEic",
      name: "Starter",
      credits: 5,
      amountCents: 100,
    },
    {
      priceId: "price_1SfphbCEB4zo9bOV7j60Uvq5",
      name: "Standard",
      credits: 30,
      amountCents: 500,
    },
    {
      priceId: "price_1SfphnCEB4zo9bOVOL0snXdo",
      name: "Pro",
      credits: 60,
      amountCents: 1000,
    },
  ],
  test: [
    {
      priceId: "price_test_starter",
      name: "Starter",
      credits: 5,
      amountCents: 100,
    },
    {
      priceId: "price_test_standard",
      name: "Standard",
      credits: 30,
      amountCents: 500,
    },
    {
      priceId: "price_test_pro",
      name: "Pro",
      credits: 60,
      amountCents: 1000,
    },
  ],
}

function getCreditPackByPriceId(priceId: string, environment: typeof ENV.NODE_ENV): CreditPack | undefined {
  return CREDIT_PACKS[environment].find((pack) => pack.priceId === priceId)
}

export type { CreditPack }
export { CREDIT_PACKS, getCreditPackByPriceId }
