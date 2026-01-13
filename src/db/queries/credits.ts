"use server"

import { and, eq, sql } from "drizzle-orm"

import { db, userCredits } from "@/db"

async function fetchUserCredits(userId: string): Promise<number> {
  const results = await db.select().from(userCredits).where(eq(userCredits.userId, userId)).limit(1)

  return results[0]?.balance ?? 0
}

interface DeductCreditResult {
  success: boolean
  newBalance: number
}

async function deductCredit(userId: string): Promise<DeductCreditResult> {
  return deductCredits(userId, 1)
}

async function deductCredits(userId: string, amount: number): Promise<DeductCreditResult> {
  const results = await db
    .update(userCredits)
    .set({
      balance: sql`${userCredits.balance} - ${amount}`,
      updatedAt: new Date(),
    })
    .where(and(eq(userCredits.userId, userId), sql`${userCredits.balance} >= ${amount}`))
    .returning()

  const updated = results[0]

  if (!updated) {
    return { success: false, newBalance: 0 }
  }

  return { success: true, newBalance: updated.balance }
}

async function refundCredit(userId: string): Promise<void> {
  return refundCredits(userId, 1)
}

async function refundCredits(userId: string, amount: number): Promise<void> {
  await db
    .update(userCredits)
    .set({
      balance: sql`${userCredits.balance} + ${amount}`,
      updatedAt: new Date(),
    })
    .where(eq(userCredits.userId, userId))
}

export { deductCredit, deductCredits, fetchUserCredits, refundCredit, refundCredits }
