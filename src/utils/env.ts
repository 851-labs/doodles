import { createEnv } from "@t3-oss/env-nextjs"
import { vercel } from "@t3-oss/env-nextjs/presets-zod"
import { z } from "zod"

const ENV = createEnv({
  extends: [vercel()],
  shared: {
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3010),
  },
  server: {
    LIGHTBOX_API_KEY: z.string(),
    POSTGRES_URL: z.string(),
    TUNNEL_SUBDOMAIN: z.string().optional(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string(),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
  emptyStringAsUndefined: true,
})

export { ENV }
