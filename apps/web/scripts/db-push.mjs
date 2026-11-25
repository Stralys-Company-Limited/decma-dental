// Creates the database tables in Supabase by running supabase/migrations/*.sql, then supabase/seed.sql.
// Needs SUPABASE_PROJECT_ID and SUPABASE_ACCESS_TOKEN (a personal access token from
// https://supabase.com/dashboard/account/tokens) in .env. Usage: npm run db:push
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

process.loadEnvFile(".env");
const { SUPABASE_PROJECT_ID: project, SUPABASE_ACCESS_TOKEN: token } = process.env;
if (!project || !token) {
  console.error("Add SUPABASE_PROJECT_ID and SUPABASE_ACCESS_TOKEN to .env first.");
  process.exit(1);
}

async function run(label, sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${project}/database/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: sql }),
  });
  if (!res.ok) {
    console.error(`✗ ${label}: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  console.log(`✓ ${label}`);
}

const root = join(import.meta.dirname, "..", "..", "..");
const dir = join(root, "supabase", "migrations");
for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
  await run(file, readFileSync(join(dir, file), "utf8"));
}
await run("seed.sql", readFileSync(join(root, "supabase", "seed.sql"), "utf8"));
await run("reload API schema", "notify pgrst, 'reload schema';");
console.log("Done. Tables are ready.");
