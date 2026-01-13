"use server"

import { eq, sql } from "drizzle-orm"

import type { CreditPurchase, UserCredits } from "@/db/schema"
import { creditPurchases, db, userCredits } from "@/db"

async function hasUserPurchasedBefore(userId: string): Promise<boolean> {
  const results = await db.select().from(creditPurchases).where(eq(creditPurchases.userId, userId)).limit(1)

  return results.length > 0
}

interface GrantCreditsParams {
  userId: string
  credits: number
  amountCents: number
  stripeCheckoutSessionId: string
}

interface GrantCreditsResult {
  userCredits: UserCredits
  creditPurchase: CreditPurchase
}

async function grantCredits({
  userId,
  credits,
  amountCents,
  stripeCheckoutSessionId,
}: GrantCreditsParams): Promise<GrantCreditsResult> {
  return db.transaction(async (tx) => {
    const purchaseResults = await tx
      .insert(creditPurchases)
      .values({
        userId,
        amountCents,
        creditsGranted: credits,
        stripeCheckoutSessionId,
      })
      .returning()

    const creditPurchaseResult = purchaseResults[0]
    if (!creditPurchaseResult) {
      throw new Error("Failed to insert credit purchase")
    }

    const existingCredits = await tx.select().from(userCredits).where(eq(userCredits.userId, userId)).limit(1)

    if (existingCredits[0]) {
      const updateResults = await tx
        .update(userCredits)
        .set({
          balance: sql`${userCredits.balance} + ${credits}`,
          updatedAt: new Date(),
        })
        .where(eq(userCredits.userId, userId))
        .returning()

      const updated = updateResults[0]
      if (!updated) {
        throw new Error("Failed to update user credits")
      }

      return {
        userCredits: updated,
        creditPurchase: creditPurchaseResult,
      }
    }

    const insertResults = await tx
      .insert(userCredits)
      .values({
        userId,
        balance: credits,
      })
      .returning()

    const inserted = insertResults[0]
    if (!inserted) {
      throw new Error("Failed to insert user credits")
    }

    return {
      userCredits: inserted,
      creditPurchase: creditPurchaseResult,
    }
  })
}

export { grantCredits, hasUserPurchasedBefore }
