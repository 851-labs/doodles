import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

import { DOODLE_STATUS } from "@/utils/constants"

const doodles = pgTable("doodles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  prompt: text("prompt").notNull(),
  imageUrl: text("image_url"),
  runId: text("run_id").notNull(),
  status: text("status").notNull().default(DOODLE_STATUS.GENERATING),
  modelUrl: text("model_url"),
  modelPosterUrl: text("model_poster_url"),
  modelRunId: text("model_run_id"),
  modelStatus: text("model_status"),
  modelGenerationStartedAt: timestamp("model_generation_started_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

const userCredits = pgTable("user_credits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique(),
  balance: integer("balance").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

const creditPurchases = pgTable("credit_purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  amountCents: integer("amount_cents").notNull(),
  creditsGranted: integer("credits_granted").notNull(),
  stripeCheckoutSessionId: text("stripe_checkout_session_id").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

type Doodle = typeof doodles.$inferSelect
type DoodleInsert = typeof doodles.$inferInsert
type DoodleStatus = "generating" | "generated" | "errored"
type ModelStatus = "generating" | "generated" | "errored"

type UserCredits = typeof userCredits.$inferSelect
type UserCreditsInsert = typeof userCredits.$inferInsert

type CreditPurchase = typeof creditPurchases.$inferSelect
type CreditPurchaseInsert = typeof creditPurchases.$inferInsert

export { creditPurchases, doodles, userCredits }
export type {
  CreditPurchase,
  CreditPurchaseInsert,
  Doodle,
  DoodleInsert,
  DoodleStatus,
  ModelStatus,
  UserCredits,
  UserCreditsInsert,
}
