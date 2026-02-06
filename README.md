# Doodles

AI-powered doodle generation app. Draw a sketch, generate an image, and optionally create a 3D model.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL via Drizzle ORM
- **Auth**: Supabase
- **Payments**: Stripe
- **AI**: Lightbox API (text-to-image, text-to-3D)
- **Package Manager**: Bun

## Getting Started

```bash
bun install
cp .env.example .env.local # fill in your env vars
bun dev
```

The app runs at [http://localhost:3010](http://localhost:3010).

## Environment Variables

| Variable | Description |
|---|---|
| `POSTGRES_URL` | PostgreSQL connection string |
| `LIGHTBOX_API_KEY` | Lightbox API key for image/3D generation |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |

## Database

```bash
bun db:generate  # generate migrations
bun db:migrate   # run migrations
bun db:push      # push schema directly (dev)
bun db:studio    # open Drizzle Studio
```

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Start dev server |
| `bun build` | Production build |
| `bun start` | Start production server |
| `bun lint` | Run ESLint |
| `bun format` | Check formatting |
| `bun types:check` | TypeScript type check |
