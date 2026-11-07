import "server-only";
import type { ReactElement } from "react";
import { Resend } from "resend";

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

/**
 * Until a sending domain is verified in Resend, its shared test sender is used. Resend only delivers
 * mail from that address to the email of the Resend account owner.
 */
function fromAddress(): string {
  return process.env.RESEND_FROM || "DECMA Dental Clinic <onboarding@resend.dev>";
}

let resend: Resend | null = null;

type Attachment = { filename: string; content: string; contentType?: string };

/** Sends an email through Resend. Returns false (and logs) instead of throwing, so a failed email never loses a booking. */
export async function sendEmail({
  to,
  subject,
  react,
  attachments,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  react: ReactElement;
  attachments?: Attachment[];
  replyTo?: string;
}): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.warn(`[email] Resend is not configured; skipped "${subject}"`);
    return false;
  }
  resend ??= new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: fromAddress(),
    to,
    subject,
    react,
    replyTo,
    attachments: attachments?.map((a) => ({
      filename: a.filename,
      content: Buffer.from(a.content, "utf-8"),
      contentType: a.contentType,
    })),
  });
  if (error) {
    console.error(`[email] Failed to send "${subject}":`, error);
    return false;
  }
  return true;
}

export function clinicNotifyAddress(): string | undefined {
  return process.env.CLINIC_NOTIFY_EMAIL || undefined;
}
