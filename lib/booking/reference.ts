/** Appointment numbers are 8 random digits, stored bare ("48271593") and shown as "DC-4827-1593". */
export const REFERENCE_LENGTH = 8;

export function formatReference(reference: string): string {
  return `DC-${reference.slice(0, 4)}-${reference.slice(4)}`;
}

/** Accepts what patients type ("DC-4827-1593", "4827 1593", "48271593") and returns the stored form. */
export function parseReference(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  return digits.length === REFERENCE_LENGTH ? digits : null;
}

/**
 * Compares phone numbers by their last 9 digits, so "+255 712 345 678", "0712345678" and
 * "712345678" all match.
 */
export function samePhone(a: string, b: string): boolean {
  const da = a.replace(/\D/g, "");
  const db = b.replace(/\D/g, "");
  if (da.length < 7 || db.length < 7) return false;
  return da.slice(-9) === db.slice(-9);
}
