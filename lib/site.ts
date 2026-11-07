/**
 * Single source of truth for the clinic's public details (name, address, phone, hours...).
 * Values in [SQUARE BRACKETS] are placeholders: keep them until the clinic confirms the real
 * details. Never publish invented facts.
 */
export const site = {
  name: "DECMA Dental Clinic",
  url: (process.env.SITE_URL ?? "https://decma.co.tz").replace(/\/$/, ""),
  copyrightYear: 2026,

  phone: "[PHONE]",
  email: "[EMAIL]",
  referralsEmail: "[REFERRALS EMAIL]",

  address: {
    street: "[STREET ADDRESS]",
    area: "Mwanyamala",
    city: "Dar es Salaam",
    country: "Tanzania",
    countryCode: "TZ",
    landmark: "[LANDMARK NOTE]",
    /** Google plus code for the clinic entrance (full code 6G5X6773+73M). */
    plusCode: "6773+73M Dar es Salaam",
  },
  /** Centre of plus code 6G5X6773+73M (Malanga Road, Kopa, Mwananyamala). */
  geo: { lat: -6.786787, lng: 39.252672 } as { lat: number; lng: number } | null,
  /** Google Maps embed URL, or null to show the placeholder. */
  mapEmbedUrl: "https://www.google.com/maps?q=-6.786787,39.252672&z=17&output=embed" as string | null,

  hours: {
    weekdays: "[HOURS]",
    saturday: "[HOURS]",
    sunday: "[HOURS OR CLOSED]",
  },
  /** Schema.org openingHours, e.g. ["Mo-Fr 08:00-17:00", "Sa 09:00-13:00"]. Empty until confirmed. */
  openingHoursSpec: [] as string[],

  /** Shown on the site while the clinic is not yet open. */
  openingDateLabel: "[DATE]",
  /** ISO date (YYYY-MM-DD) of the first bookable day, or null. No slots are offered before it. */
  openingDateISO: null as string | null,

  insurers: "[INSURERS]",
  insurersList: [] as string[],
  cancellationPolicy: "[CANCELLATION POLICY]",
  appointmentLengthMinutes: 30,

  facilityRegNo: "[FACILITY REG. NO.]",
} as const;

export function isPlaceholder(value: string | null | undefined): boolean {
  return !value || /^\[.*\]$/.test(value.trim());
}

export function telHref(phone: string = site.phone): string | undefined {
  if (isPlaceholder(phone)) return undefined;
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mailHref(email: string = site.email): string | undefined {
  if (isPlaceholder(email)) return undefined;
  return `mailto:${email}`;
}

export function fullAddress(): string {
  const { street, area, city, country } = site.address;
  return `${street}, ${area}, ${city}, ${country}`;
}

/** Location text that map and calendar apps can resolve exactly (the plus code), plus the area. */
export function mapsLocation(): string {
  const { plusCode, area, country } = site.address;
  return `${plusCode}, ${area}, ${country}`;
}

export function directionsUrl(): string {
  const dest = site.geo ? `${site.geo.lat},${site.geo.lng}` : mapsLocation();
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
}

export function mapsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsLocation())}`;
}
