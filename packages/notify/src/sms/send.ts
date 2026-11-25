import "server-only";

const API = "https://messaging-service.co.tz";

export function isSmsConfigured(): boolean {
  return !!(process.env.NEXT_SMS_TOKEN && process.env.NEXT_SMS_SENDER_ID);
}

/** NEXT_SMS_TEST_MODE=1 uses NextSMS's test endpoint: the request is validated but nothing is sent or charged. */
function isTestMode(): boolean {
  return process.env.NEXT_SMS_TEST_MODE === "1" || process.env.NEXT_SMS_TEST_MODE === "true";
}

/**
 * Tanzanian numbers in NextSMS's 255XXXXXXXXX form ("0712 345 678", "+255712345678", "712345678").
 * Other international numbers (written with + or 00) are passed through as digits; anything else is null.
 */
export function toNextSmsNumber(raw: string): string | null {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (/^255[67]\d{8}$/.test(digits)) return digits;
  if (/^0[67]\d{8}$/.test(digits)) return `255${digits.slice(1)}`;
  if (/^[67]\d{8}$/.test(digits)) return `255${digits}`;
  if (/^(\+|00)/.test(trimmed) && digits.length >= 10 && digits.length <= 15) {
    return digits.replace(/^00/, "");
  }
  return null;
}

type NextSmsMessage = {
  to: string;
  status?: { groupName?: string; name?: string; description?: string };
  messageId?: string;
};

export type SmsResult = { ok: true; messageId: string | null } | { ok: false };

/** Sends one Internet SMS. Returns { ok: false } (and logs) instead of throwing, so a failed SMS never loses a booking. */
export async function sendSms({ to, text, reference }: { to: string; text: string; reference?: string }): Promise<SmsResult> {
  if (!isSmsConfigured()) {
    console.warn("[sms] NextSMS is not configured; skipped");
    return { ok: false };
  }
  const number = toNextSmsNumber(to);
  if (!number) {
    console.warn(`[sms] Skipped: "${to}" is not a number NextSMS can send to`);
    return { ok: false };
  }

  const path = isTestMode() ? "/api/sms/v2/test/text/single" : "/api/sms/v2/text/single";
  try {
    const res = await fetch(API + path, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_SMS_TOKEN}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.NEXT_SMS_SENDER_ID,
        to: number,
        text,
        reference: reference?.replace(/\s+/g, "-").slice(0, 50),
      }),
      cache: "no-store",
    });
    // messageId is a 64-bit integer; quote it before parsing so it is not rounded.
    const raw = (await res.text()).replace(/"(messageId|sendReference)":\s*(\d+)/g, '"$1":"$2"');
    if (!res.ok) {
      console.error(`[sms] NextSMS returned ${res.status}:`, raw);
      return { ok: false };
    }
    const message = (JSON.parse(raw) as { messages?: NextSmsMessage[] }).messages?.[0];
    const status = message?.status;
    if (!message || status?.groupName === "REJECTED" || /FAIL|REJECT/i.test(status?.name ?? "")) {
      console.error("[sms] Not sent:", status?.name, status?.description);
      return { ok: false };
    }
    if (isTestMode()) console.info(`[sms] Test mode: validated SMS to ${number} (not sent)`);
    return { ok: true, messageId: message.messageId ?? null };
  } catch (err) {
    console.error("[sms] Request failed", err);
    return { ok: false };
  }
}
