// Shows the DNS records Resend needs for the sending domain and asks Resend to verify them.
// Usage: npm run email:domain
// The domain is taken from RESEND_FROM in .env (e.g. "DECMA Dental Clinic <bookings@dental.decma.co.tz>").
import { createRequire } from "node:module";

process.loadEnvFile(".env");
const require = createRequire(import.meta.url);
const { Resend } = require("resend");

const from = process.env.RESEND_FROM ?? "";
const domainName = from.match(/@([^>\s]+)/)?.[1];
if (!process.env.RESEND_API_KEY || !domainName) {
  console.error('Set RESEND_API_KEY and RESEND_FROM (e.g. "DECMA Dental Clinic <bookings@dental.decma.co.tz>") in .env.');
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);
const list = await resend.domains.list();
if (list.error) throw new Error(list.error.message);
const domain = list.data.data.find((d) => d.name === domainName);
if (!domain) {
  console.error(`${domainName} is not in this Resend account. Add it at https://resend.com/domains first.`);
  process.exit(1);
}

await resend.domains.verify(domain.id);
const { data, error } = await resend.domains.get(domain.id);
if (error) throw new Error(error.message);

console.log(`${data.name}: ${data.status}\n`);
console.log("DNS records to add on the parent domain (names are relative to it):");
for (const r of data.records) {
  console.log(`  [${r.status}] ${r.type.padEnd(5)} ${r.name}  ->  ${r.value}${r.priority != null ? `  (priority ${r.priority})` : ""}`);
}
if (data.status === "verified") console.log("\nVerified: emails are sent from", from);
else console.log("\nNot verified yet. After adding the records, wait a few minutes and run this again.");
