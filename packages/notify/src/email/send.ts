import "server-only";
import type { ReactElement } from "react";
import { Resend } from "resend";

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

/**
 * Resend's shared test sender. It only delivers to the Resend account owner's email, so it is used only
 * when RESEND_FROM is unset or its domain is not verified yet.
 */
const TEST_SENDER = "DECMA Dental Clinic <onboarding@resend.dev>";

function fromAddress(): string {
  return process.env.RESEND_FROM || TEST_SENDER;
}

function isUnverifiedDomainError(error: { message?: string } | null): boolean {
  return !!error?.message && /domain is not verified|verify a domain/i.test(error.message);
}

let resend: Resend | null = null;

type Attachment = { filename: string; content: string; contentType?: string };

/** Either a React Email component, or a published Resend template with its variables. */
type Body =
  | { react: ReactElement; template?: never }
  | { template: { id: string; variables: Record<string, string> }; react?: never };

export type SendResult = { ok: true; id: string } | { ok: false };

/** Sends an email through Resend. Returns { ok: false } (and logs) instead of throwing, so a failed email never loses a booking. */
export async function sendEmail({
  to,
  subject,
  attachments,
  replyTo,
  ...body
}: {
  to: string | string[];
  subject: string;
  attachments?: Attachment[];
  replyTo?: string;
} & Body): Promise<SendResult> {
  if (!isEmailConfigured()) {
    console.warn(`[email] Resend is not configured; skipped "${subject}"`);
    return { ok: false };
  }
  resend ??= new Resend(process.env.RESEND_API_KEY);
  const common = {
    from: fromAddress(),
    to,
    subject,
    replyTo,
    attachments: attachments?.map((a) => ({
      filename: a.filename,
      content: Buffer.from(a.content, "utf-8"),
      contentType: a.contentType,
    })),
  };
  const send = (from: string) =>
    body.template
      ? resend!.emails.send({ ...common, from, template: body.template })
      : resend!.emails.send({ ...common, from, react: body.react });

  let { data, error } = await send(common.from);
  if (isUnverifiedDomainError(error) && common.from !== TEST_SENDER) {
    console.warn(`[email] ${common.from} is not verified in Resend yet; retrying "${subject}" from the test sender`);
    ({ data, error } = await send(TEST_SENDER));
  }
  if (error || !data) {
    console.error(`[email] Failed to send "${subject}":`, error);
    return { ok: false };
  }
  return { ok: true, id: data.id };
}

export function clinicNotifyAddress(): string | undefined {
  return process.env.CLINIC_NOTIFY_EMAIL || undefined;
}

/** Inbox for "Request a call-back" alerts; falls back to the general clinic address. */
export function callbackNotifyAddress(): string | undefined {
  return process.env.CALLBACK_NOTIFY_EMAIL || clinicNotifyAddress();
}
