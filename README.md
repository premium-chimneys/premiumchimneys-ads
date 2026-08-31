# premiumchimneys-ads

Next.js 16 (App Router, Turbopack) landing pages for Premium Chimneys paid traffic.
Page content — cities, services, V2 copy, hero images — lives in Supabase, so adding
a city or a service is a database row, not a deploy.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

Requires a `.env.local`. All `.env*` files are gitignored, so nothing here ships
with the repo — on Vercel these are set on the project instead.

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Reading page content (public-read RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; the `jobber_auth` token row |
| `JOBBER_CLIENT_ID`, `JOBBER_CLIENT_SECRET`, `JOBBER_REDIRECT_URI` | Jobber OAuth; the secret also verifies webhook signatures |
| `REPUTATION_ENROLL_URL`, `REPUTATION_REVIEW_GUARD_URL`, `REPUTATION_ENROLL_SECRET` | Review-campaign fan-out; the whole fan-out no-ops if unset |
| `PREVIEW_SECRET` | Preview access |

A longer annotated copy lives in `.env.example` (local only).

## Routes

| Route | What it is |
| --- | --- |
| `/[service]/[city]` | V1 service landing page |
| `/[service]/[city]/v2` | V2 variant of the same page, isolated from V1 |
| `/homepage/[city]` | City homepage |
| `/api/jobber/connect`, `/callback`, `/status` | Jobber OAuth — connects the account and reports token status |
| `/api/jobber/webhook` | Jobber invoice webhooks; drives the Reputation Manager fan-out |

`/` renders tracking only.

## V1 and V2

`components/` holds V1, `components/v2/` holds V2, and the two are deliberately kept
as separate copies rather than one parameterised set — V2 is a live traffic experiment
and must be able to diverge without any chance of changing V1. `components/variants/`
composes each one. Expect near-duplicate files there; that is the design, not drift.

Data comes from `lib/get*.js` (public anon key, read-only tables with public-read RLS).

## Jobber

`lib/jobber.js` is a single-tenant Jobber GraphQL client — one account, one row of
tokens in `jobber_auth`, refresh-token rotation handled in-process. It is read-only;
nothing here writes back to Jobber.

Its only consumer is `lib/jobber-webhook.js`, which on invoice events notifies the
review campaign in the `premiumchimneys-agents` app (enroll on paid, review-guard on
create). Both fan-outs are best-effort and swallow their own errors.

This repo previously also maintained an `income_report` table and subcontractor
submission pages; both were removed. `sql/teardown_income_report.sql` drops the
leftover tables and is not run automatically.

## Deployment

Vercel. Environment variables are set on the Vercel project, not from `.env.local`.
