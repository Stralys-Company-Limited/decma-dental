# DECMA Dental Clinic website

Clinic website with online booking, built with Next.js 16 (App Router, Cache Components), Tailwind CSS 4,
Supabase and Resend. English is published at `/`; the Swahili version under `/sw` is built but switched off
until a native-speaker review (enable it in `enabledLocales`, `lib/i18n/config.ts`).

The design sources (mockup, brand guidelines, SEO recommendations) are kept locally in `design files/`
and are not committed. Original logo files are in `public/brand/`; the web-sized versions used by the site
are in `public/brand/web/`.

## Run locally

```bash
npm install
cp .env.example .env   # fill in the values
npm run dev
```

Without Supabase keys the site still runs, and booking uses an in-memory demo store (local development only).

## Where things live

| What | Where |
| --- | --- |
| Clinic details (name, address, phone, hours, opening date, registration numbers) | `lib/site.ts` |
| Interface text, English and Swahili | `lib/i18n/dictionaries/en.ts`, `sw.ts` |
| Published languages | `enabledLocales` in `lib/i18n/config.ts` |
| Service pages | `content/services/*.ts` |
| Oral health articles | `content/articles/{en,sw}/*.mdx` and `content/articles/index.ts` |
| Privacy notice and terms | `content/legal/{en,sw}/*.mdx` |
| Page titles and meta descriptions | `lib/seo.ts` |
| Brand colours and fonts | `app/globals.css` |
| Database schema | `supabase/migrations/20261107000000_init.sql` |
| Emails | `emails/`, Resend template in `scripts/resend/` |

Values in `[SQUARE BRACKETS]` are placeholders. Replace them only with confirmed facts.

## Set up bookings

1. Run `supabase/migrations/20261107000000_init.sql` in the Supabase SQL editor (or `npm run db:push`).
   The migration is idempotent, so running it again is safe.
2. Add the clinic's confirmed hours to `opening_hours` (`supabase/seed.sql` has sample hours for testing).
3. Set `site.openingDateISO` in `lib/site.ts` to the first bookable day. On the live site, online booking stays
   closed until it is set.
4. Resend: verify the sending domain (`npm run email:domain`) and set `RESEND_API_KEY`, `RESEND_FROM`,
   `CLINIC_NOTIFY_EMAIL` and `CALLBACK_NOTIFY_EMAIL`.
5. For staff access: create the user in Supabase Auth, then `insert into public.staff (user_id, display_name) values ('<user id>', 'Reception');`.
   Staff sign in at `/admin`.

Patients receive a confirmation email with an `.ics` invitation (reminders one day and two hours before),
buttons for Google Calendar, Apple Calendar, Outlook.com, Microsoft 365 and other apps, and a link to cancel.
A reminder email is sent the day before by the daily cron job in `vercel.json` (09:00 Tanzania time,
`/api/cron/reminders`, protected by `CRON_SECRET`).

## Deploying on Vercel

- **Supabase:** the Vercel Supabase integration injects the keys. The app accepts its names
  (`SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_SECRET_KEY`,
  `SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `…PUBLISHABLE_KEY`) as well as those in `.env.example`.
- **Add in Vercel → Settings → Environment Variables:** `RESEND_API_KEY`, `RESEND_FROM`,
  `RESEND_TEMPLATE_BOOKING_CONFIRMATION_EN`, `RESEND_TEMPLATE_BOOKING_CONFIRMATION_SW`, `CLINIC_NOTIFY_EMAIL`,
  `CALLBACK_NOTIFY_EMAIL`, `CRON_SECRET`, and `SITE_URL` once the domain is connected. Without `SITE_URL`, links
  use the Vercel production address.
- **Cron:** daily, which works on the Hobby plan. On Pro it can run more often (edit `vercel.json`).

## Booking confirmation email (Resend template)

The patient confirmation is a Resend template, in English and Swahili, defined in
`scripts/resend/booking-confirmation-template.mjs`. `npm run email:templates` creates or updates both
templates in Resend, publishes them and prints their IDs for `RESEND_TEMPLATE_BOOKING_CONFIRMATION_EN` / `_SW`.
The app fills the variables in `lib/email/booking-template.ts`; if no template ID is set it falls back to the
React Email version. Images (logo and calendar icons, as PNGs) are referenced by URL because Resend has no
asset upload: set `EMAIL_ASSET_BASE_URL=https://<your-domain>` once the site is live and run the script again.

## Launch checklist

- [ ] Confirm the domain and set `SITE_URL`.
- [ ] Replace every placeholder in `lib/site.ts` (phone, email, address, landmark, hours, insurers,
      cancellation policy, facility registration number).
- [ ] Native-speaker review of all Swahili text, then enable `sw` in `enabledLocales`.
- [ ] Legal review of the privacy notice and terms.
- [ ] Replace `public/images/hero-tooth.webp` with the original illustration file, and add real clinic photos
      (no named or identifiable doctors).
- [ ] Supabase: confirmed opening hours entered, staff accounts created.
- [ ] Resend: `dental.decma.co.tz` verified; test the confirmation, reminder and cancellation emails.
- [ ] Vercel: environment variables set, HTTPS, one preferred host (www or non-www) redirecting to the other.
- [ ] Google Search Console and Bing Webmaster: verify the site and submit `/sitemap.xml`.
- [ ] Google Business Profile: "Dental clinic", opening date, the exact same name, address and phone as the site.
