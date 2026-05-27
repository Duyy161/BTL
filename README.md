# Broker 4.0 MVP

Next.js + Prisma + OpenRouter.

## Run local

1. Copy `.env.example` to `.env` and fill values.
2. Install deps: `npm install`
3. Sync schema: `npm run db:push`
4. Seed sample data: `npm run db:seed`
5. Start app: `npm run dev`

## Use Neon (Cloud DB)

1. Create a Neon project and copy the pooled connection string.
2. Set `DATABASE_URL` to Neon URL in Vercel and local `.env`.
3. Run once from local (using same `DATABASE_URL`):
   - `npm run db:push`
   - `npm run db:seed`
4. Redeploy on Vercel.

## Required env vars

- `DATABASE_URL`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL` (default: `openai/gpt-4o-mini`)
- `APP_BASE_URL` (your deployed domain)
