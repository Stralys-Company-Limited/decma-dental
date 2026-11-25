# DECMA Dental Clinic

pnpm + Turborepo monorepo for the public clinic website and the staff booking desk.

| App | Path | Local | Production |
| --- | --- | --- | --- |
| Public site + patient booking | `apps/web` | http://localhost:3000 | `decma.co.tz` (Vercel root `apps/web`) |
| Clinic desk | `apps/clinic` | http://localhost:3001 | `clinic.decma.co.tz` (Vercel root `apps/clinic`) |

Shared packages:

- `@decma/booking` — slots, appointments, calendar links, clinic site details
- `@decma/db` — Supabase admin + staff auth clients
- `@decma/notify` — Resend email + NextSMS

English is published on the public site at `/`. Swahili under `/sw` is built but switched off until a native-speaker review (`enabledLocales` in `apps/web/lib/i18n/config.ts`).

Design sources stay local in `design files/` (not committed). Logos live in `apps/web/public/brand/`.

## Run locally

```bash
npx pnpm@9.15.0 install
cp .env.example apps/web/.env
cp .env.example apps/clinic/.env
# fill in values in both .env files (same Supabase / Resend / SMS secrets)

npx pnpm@9.15.0 dev          # both apps
npx pnpm@9.15.0 dev:web      # public site only
npx pnpm@9.15.0 dev:clinic   # clinic desk only
```

Without Supabase keys the public site still runs, and booking uses an in-memory demo store (local development only).

## Where things live

| What | Where |
| --- | --- |
| Clinic details | `packages/booking/src/site.ts` |
| Public UI text | `apps/web/lib/i18n/dictionaries/` |
| Service pages / articles / legal | `apps/web/content/` |
| Database schema | `supabase/migrations/` |
| Emails + SMS | `packages/notify/` |
| Clinic desk UI | `apps/clinic/` |
| Reminder cron | `apps/web/vercel.json` → `/api/cron/reminders` |

Values in `[SQUARE BRACKETS]` are placeholders. Replace them only with confirmed facts.

## Set up bookings

1. Run `supabase/migrations/20261107000000_init.sql` then `20261117000000_clinic_desk.sql` in the Supabase SQL editor (or `pnpm db:push`).
2. Seed hours from `supabase/seed.sql` if needed.
3. Set `site.openingDateISO` in `packages/booking/src/site.ts` to the first bookable day.
4. Resend: `pnpm email:domain`, set `RESEND_API_KEY`, `RESEND_FROM`, `CLINIC_NOTIFY_EMAIL`, `CALLBACK_NOTIFY_EMAIL`.
5. SMS (optional): `NEXT_SMS_TOKEN`, `NEXT_SMS_SENDER_ID`. Check with `pnpm sms -- balance` / `pnpm sms -- test 07XXXXXXXX`.
6. Staff: create the user in Supabase Auth, then  
   `insert into public.staff (user_id, display_name) values ('<user id>', 'Reception');`  
   Sign in at the clinic desk (`clinic.decma.co.tz` / localhost:3001). Old `/admin` URLs on the public site redirect there.

## Clinic desk features

- **Today** — day schedule, status/type filters, find by appointment number
- **Week / Month** — calendar views with closures and booking counts
- **Walk-in** — staff create bookings (email optional; notify optional)
- **Appointment detail** — status workflow (confirmed → arrived → completed, no-show, cancel), notes, reschedule
- **Hours** — opening hours + closures (drive public availability)
- **Inbox** — call-backs and referral enquiries

## Deploying on Vercel

Create **two** projects from the same GitHub repo:

1. **Web** — Root Directory `apps/web`. Keep the cron from `apps/web/vercel.json`. Set `CLINIC_URL=https://clinic.decma.co.tz`.
2. **Clinic** — Root Directory `apps/clinic`. No cron required. Same Supabase / Resend / NextSMS secrets as web.

Shared env vars (both projects unless noted):

- Supabase (or Vercel Supabase integration names)
- `RESEND_API_KEY`, `RESEND_FROM`, template IDs, `CLINIC_NOTIFY_EMAIL`, `CALLBACK_NOTIFY_EMAIL`
- `NEXT_SMS_TOKEN`, `NEXT_SMS_SENDER_ID`
- `CRON_SECRET` (web only), `SITE_URL` (web), `CLINIC_URL` (web + clinic staff email links)
- `EMAIL_ASSET_BASE_URL` once the public site is live

Staff auth cookies stay on the clinic origin (correct for this split).

## Launch checklist

- [ ] Confirm domains; set `SITE_URL` and `CLINIC_URL`.
- [ ] Replace placeholders in `packages/booking/src/site.ts`.
- [ ] Run both SQL migrations on Supabase; create staff users.
- [ ] Resend domain verified; SMS Sender ID approved on the same NextSMS account as the token.
- [ ] Dual Vercel projects configured with root directories above.
- [ ] Search Console / Business Profile as before.
