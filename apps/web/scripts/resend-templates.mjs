// Creates or updates the Resend booking-confirmation templates (English and Swahili) and publishes them.
// Usage: npm run email:templates
// Needs RESEND_API_KEY in .env. Optional: EMAIL_LOGO_URL (public URL of the white logo) and SITE_URL.
// Prints the template IDs to put in .env as RESEND_TEMPLATE_BOOKING_CONFIRMATION_EN / _SW.
import { createRequire } from "node:module";
import { bookingConfirmationTemplates } from "./resend/booking-confirmation-template.mjs";

process.loadEnvFile(".env");
const require = createRequire(import.meta.url);
const { Resend } = require("resend");

if (!process.env.RESEND_API_KEY) {
  console.error("Add RESEND_API_KEY to .env first.");
  process.exit(1);
}

// Email images (logo and calendar icons) must be PNGs at a public URL. The website is not deployed yet, so
// they are served from the public GitHub repository by default. Once the site is live, set
// EMAIL_ASSET_BASE_URL=https://<domain> and run this again.
const assetBase = (
  process.env.EMAIL_ASSET_BASE_URL ||
  "https://raw.githubusercontent.com/Stralys-Company-Limited/decma-dental/main/public"
).replace(/\/$/, "");
const logoUrl = process.env.EMAIL_LOGO_URL || `${assetBase}/brand/web/logo-white.png`;
const siteUrl = (process.env.SITE_URL ?? "https://decma.co.tz").replace(/\/$/, "");

const resend = new Resend(process.env.RESEND_API_KEY);
const ids = {};

for (const tpl of bookingConfirmationTemplates({ logoUrl, siteUrl, assetBase })) {
  const { locale, ...payload } = tpl;
  const existing = await resend.templates.get(payload.alias);

  let id;
  if (existing.data) {
    const { error } = await resend.templates.update(existing.data.id, payload);
    if (error) throw new Error(`update ${payload.alias}: ${error.message}`);
    id = existing.data.id;
    console.log(`updated   ${payload.alias}`);
  } else {
    const { data, error } = await resend.templates.create(payload);
    if (error) throw new Error(`create ${payload.alias}: ${error.message}`);
    id = data.id;
    console.log(`created   ${payload.alias}`);
  }

  const published = await resend.templates.publish(id);
  if (published.error) throw new Error(`publish ${payload.alias}: ${published.error.message}`);
  console.log(`published ${payload.alias} -> ${id}`);
  ids[locale] = id;
}

console.log("\nAdd to .env:");
console.log(`RESEND_TEMPLATE_BOOKING_CONFIRMATION_EN=${ids.en}`);
console.log(`RESEND_TEMPLATE_BOOKING_CONFIRMATION_SW=${ids.sw}`);
console.log(`\nLogo: ${logoUrl}\nCalendar icons: ${assetBase}/brand/calendars/*.png`);
