import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import { ENV } from "@/utils/env"
import * as schema from "./schema"

const client = postgres(ENV.POSTGRES_URL, { prepare: false })
const db = drizzle(client, { schema })

export { db }
export * from "./schema"
