// NextSMS (Internet SMS) helper.
// Usage:
//   npm run sms -- balance
//   npm run sms -- logs                          the last 50 messages sent from this account
//   npm run sms -- test 0712345678 "Message"     validates the send; nothing is sent or charged
//   npm run sms -- send 0712345678 "Message"     sends a real SMS
// Options: --from SENDER overrides NEXT_SMS_SENDER_ID.
process.loadEnvFile(".env");

const API = "https://messaging-service.co.tz";
const token = process.env.NEXT_SMS_TOKEN;
if (!token) {
  console.error("Set NEXT_SMS_TOKEN in .env.");
  process.exit(1);
}

const args = process.argv.slice(2);
const fromFlag = args.indexOf("--from");
const from = fromFlag >= 0 ? args.splice(fromFlag, 2)[1] : process.env.NEXT_SMS_SENDER_ID;
const [command, to, text = "Test message from DECMA Dental Clinic."] = args;

const headers = { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json" };

async function call(method, path, body) {
  const res = await fetch(API + path, { method, headers, body: body && JSON.stringify(body) });
  // messageId is a 64-bit integer: keep it as text so JSON.parse does not round it.
  const raw = (await res.text()).replace(/"(messageId|sendReference)":\s*(\d+)/g, '"$1":"$2"');
  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    json = raw;
  }
  return { status: res.status, json };
}

if (command === "balance") {
  const { status, json } = await call("GET", "/api/v2/balance");
  console.log(status, json);
} else if (command === "logs") {
  const { status, json } = await call("GET", "/api/v2/logs?limit=50");
  const rows = json?.results ?? [];
  console.log(status, `${rows.length} recent messages`);
  for (const r of rows) console.log(`${r.sentAt}  ${r.from}  ${r.channel}  ${r.to}  ${r.status?.name ?? r.delivery}`);
  if (!Array.isArray(json?.results)) console.log(json);
} else if (command === "test" || command === "send") {
  if (!to) {
    console.error(`Usage: npm run sms -- ${command} 0712345678 "Message"`);
    process.exit(1);
  }
  if (!from) {
    console.error("Set NEXT_SMS_SENDER_ID in .env or pass --from SENDER.");
    process.exit(1);
  }
  const path = command === "test" ? "/api/sms/v2/test/text/single" : "/api/sms/v2/text/single";
  const { status, json } = await call("POST", path, { from, to, text, reference: "decma-cli-test" });
  console.log(status, JSON.stringify(json, null, 2));
} else {
  console.error("Commands: balance | logs | test <phone> [text] | send <phone> [text]");
  process.exit(1);
}
