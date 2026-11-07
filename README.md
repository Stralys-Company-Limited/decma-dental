# DECMA Dental Clinic website

Bilingual (English at `/`, Swahili at `/sw`) clinic website with online booking, built with Next.js 16
(App Router, Cache Components), Tailwind CSS 4, Supabase and Resend.

The design sources (mockup, brand guidelines, SEO recommendations) are kept locally in `design files/`
and are not committed. Original logo files are in `public/brand/`; the web-sized versions used by the site
are in `public/brand/web/`.

## Run locally

```bash
npm install
cp .env.example .env   # fill in the values
npm run dev
```

Without Supabase keys the site still runs: booking and the forms show a "please call" message.

## Where things live

| What | Where |
| --- | --- |
| Clinic details (name, address, phone, hours, opening date, registration numbers) | `lib/site.ts` |
| Interface text, English and Swahili | `lib/i18n/dictionaries/en.ts`, `sw.ts` |
| Service pages | `content/services/*.ts` |
| Oral health articles | `content/articles/{en,sw}/*.mdx` and `content/articles/index.ts` |
| Privacy notice and terms | `content/legal/{en,sw}/*.mdx` |
| Page titles and meta descriptions | `lib/seo.ts` |
| Brand colours and fonts | `app/globals.css` |
| Database schema | `supabase/migrations/0001_init.sql` |
| Emails | `emails/` |

Values in `[SQUARE BRACKETS]` are placeholders. Replace them only with confirmed facts.

## Set up bookings

1. Create a Supabase project and run `supabase/migrations/0001_init.sql` in the SQL editor.
2. Add the clinic's confirmed hours to `opening_hours` (`supabase/seed.sql` has sample hours for testing).
3. Set `site.openingDateISO` in `lib/site.ts` to the first bookable day. Online booking stays closed until it is set.
4. Create a Resend account, verify the sending domain and set `RESEND_API_KEY`, `RESEND_FROM` and `CLINIC_NOTIFY_EMAIL`.
5. For staff access: create the user in Supabase Auth, then `insert into public.staff (user_id, display_name) values ('<user id>', 'Reception');`.
   Staff sign in at `/admin`.

Patients receive a confirmation email with an `.ics` invitation (works with Apple, Outlook, Samsung and most
calendars, with reminders one day and two hours before), Google / Outlook.com / Office 365 links, and a link
to cancel. A reminder email is sent about 24 hours before by the hourly cron job in `vercel.json`
(`/api/cron/reminders`, protected by `CRON_SECRET`). Hourly cron jobs need a Vercel Pro plan; on Hobby, change
the schedule to daily.

## Launch checklist

- [ ] Confirm the single public name, domain (`decma.co.tz`) and set `SITE_URL`.
- [ ] Replace every placeholder in `lib/site.ts` (phone, email, address, landmark, hours, insurers,
      cancellation policy, facility registration number, map embed, geo coordinates).
- [ ] Native-speaker review of all Swahili text (dictionaries, services, articles, legal pages).
- [ ] Legal review of the privacy notice and terms.
- [ ] Replace `public/images/hero-tooth.webp` with the original illustration file, and add real clinic photos
      (no named or identifiable doctors).
- [ ] Supabase migration run, opening hours entered, staff accounts created.
- [ ] Resend domain verified; send a test booking and check the confirmation, reminder and cancellation emails.
- [ ] Vercel: environment variables set, HTTPS, one preferred host (www or non-www) redirecting to the other.
- [ ] Google Search Console and Bing Webmaster: verify the site and submit `/sitemap.xml`.
- [ ] Google Business Profile: "Dental clinic", opening date, the exact same name, address and phone as the site.
