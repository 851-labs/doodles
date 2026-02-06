import type { Config } from "drizzle-kit"

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not set")
}

const config: Config = {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  },
}

export default config
