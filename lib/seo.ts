import type { Metadata } from "next";
import { hreflang, localePath, locales, ogLocale, type Locale } from "@/lib/i18n/config";
import { isPlaceholder, mapsUrl, site } from "@/lib/site";

export function absoluteUrl(locale: Locale, path: string): string {
  return `${site.url}${localePath(locale, path)}`;
}

/** hreflang map for a page that exists in every locale. */
export function languageAlternates(path: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const l of locales) map[hreflang[l]] = absoluteUrl(l, path);
  map["x-default"] = absoluteUrl("en", path);
  return map;
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  noIndex = false,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(locale, path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

/** Page titles and descriptions from the SEO recommendations (section 4). */
export const pageSeo = {
  home: {
    en: {
      title: "Dentist in Mwanyamala, Dar es Salaam | DECMA Dental Clinic",
      description: (date: string) =>
        `DECMA Dental Clinic in Mwanyamala offers family dental care: check-ups, fillings, whitening, braces, implants and paediatric dentistry for children. Written estimate before treatment. Bookings open ${date}.`,
    },
    sw: {
      title: "Kliniki ya Meno Mwanyamala, Dar es Salaam | DECMA Dental Clinic",
      description: (date: string) =>
        `DECMA Dental Clinic, Mwanyamala: huduma za meno kwa familia nzima, uchunguzi, kujaza meno, kung'arisha, braces, vipandikizi na meno ya watoto. Makadirio kwa maandishi kabla ya matibabu. Miadi itaanza ${date}.`,
    },
  },
  services: {
    en: {
      title: "Dental Services in Dar es Salaam | DECMA Dental Clinic",
      description:
        "Explore DECMA's dental services in Mwanyamala: check-ups and cleaning, fillings and root canal, cosmetic dentistry, orthodontics, implants, and paediatric dentistry.",
    },
    sw: {
      title: "Huduma za Meno Dar es Salaam | DECMA Dental Clinic",
      description:
        "Huduma za meno za DECMA, Mwanyamala: uchunguzi na kusafisha meno, kujaza meno na root canal, urembo wa meno, kunyoosha meno, vipandikizi na meno ya watoto.",
    },
  },
  yourVisit: {
    en: {
      title: "What to Expect at Your First Visit | DECMA Dental Clinic",
      description:
        "What to expect at DECMA: book a time, examination, options and written estimate, then treatment and follow-up, only with your consent.",
    },
    sw: {
      title: "Cha Kutarajia Katika Ziara Yako ya Kwanza | DECMA Dental Clinic",
      description:
        "Cha kutarajia DECMA: panga muda, uchunguzi, chaguo na makadirio kwa maandishi, kisha matibabu na ufuatiliaji, kwa ridhaa yako tu.",
    },
  },
  tips: {
    en: {
      title: "Oral Health Tips | DECMA Dental Clinic",
      description:
        "Practical oral health advice from DECMA Dental Clinic in Mwanyamala: brushing, cleaning between teeth, sugar, and how often to get a check-up.",
    },
    sw: {
      title: "Ushauri wa Afya ya Kinywa | DECMA Dental Clinic",
      description:
        "Ushauri wa vitendo wa afya ya kinywa kutoka DECMA Dental Clinic, Mwanyamala: kupiga mswaki, kusafisha kati ya meno, sukari, na mara ngapi kuchunguzwa.",
    },
  },
  visitUs: {
    en: {
      title: "Contact DECMA Dental Clinic in Mwanyamala | Address & Map",
      description: (p: { street: string; phone: string; email: string; hours: string }) =>
        `Find DECMA Dental Clinic at ${p.street}, Mwanyamala, Dar es Salaam. Phone ${p.phone}, email ${p.email}. Hours: ${p.hours}. Request a call-back.`,
    },
    sw: {
      title: "Wasiliana na DECMA Dental Clinic Mwanyamala | Anwani na Ramani",
      description: (p: { street: string; phone: string; email: string; hours: string }) =>
        `Pata DECMA Dental Clinic, ${p.street}, Mwanyamala, Dar es Salaam. Simu ${p.phone}, barua pepe ${p.email}. Saa: ${p.hours}. Omba tukupigie.`,
    },
  },
  referrals: {
    en: {
      title: "Refer a Patient | DECMA Dental Clinic",
      description:
        "Referring practitioners: send a referral letter with the patient's consent. DECMA returns a treatment summary with the patient's agreement.",
    },
    sw: {
      title: "Toa Rufaa ya Mgonjwa | DECMA Dental Clinic",
      description:
        "Kwa wataalamu: tuma barua ya rufaa pamoja na ridhaa ya mgonjwa. DECMA hurudisha muhtasari wa matibabu kwa idhini ya mgonjwa.",
    },
  },
  book: {
    en: {
      title: "Book a Dental Appointment | DECMA Dental Clinic, Mwanyamala",
      description:
        "Book online at DECMA Dental Clinic in Mwanyamala. Three short steps, no account needed. Times in East Africa Time (EAT).",
    },
    sw: {
      title: "Panga Miadi ya Daktari wa Meno | DECMA Dental Clinic, Mwanyamala",
      description:
        "Panga miadi mtandaoni DECMA Dental Clinic, Mwanyamala. Hatua tatu fupi, huhitaji akaunti. Saa za Afrika Mashariki (EAT).",
    },
  },
  privacy: {
    en: {
      title: "Privacy Notice | DECMA Dental Clinic",
      description:
        "How DECMA Dental Clinic collects, uses and protects your personal data, in line with Tanzania's Personal Data Protection Act.",
    },
    sw: {
      title: "Taarifa ya Faragha | DECMA Dental Clinic",
      description:
        "Jinsi DECMA Dental Clinic inavyokusanya, kutumia na kulinda taarifa zako binafsi, kwa mujibu wa Sheria ya Ulinzi wa Taarifa Binafsi ya Tanzania.",
    },
  },
  terms: {
    en: {
      title: "Terms of Use | DECMA Dental Clinic",
      description: "The terms that apply when you use the DECMA Dental Clinic website and online booking.",
    },
    sw: {
      title: "Masharti ya Matumizi | DECMA Dental Clinic",
      description: "Masharti yanayohusu matumizi ya tovuti ya DECMA Dental Clinic na kupanga miadi mtandaoni.",
    },
  },
} as const;

/** schema.org Dentist data. Placeholder values are left out so no unconfirmed facts are published. */
export function dentistJsonLd(locale: Locale) {
  const known = (v: string) => (isPlaceholder(v) ? undefined : v);
  const { address } = site;
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${site.url}/#clinic`,
    name: site.name,
    url: absoluteUrl(locale, "/"),
    image: `${site.url}/og.png`,
    logo: `${site.url}/brand/web/logo-navy.png`,
    telephone: known(site.phone),
    email: known(site.email),
    address: {
      "@type": "PostalAddress",
      streetAddress: known(address.street),
      addressLocality: address.area,
      addressRegion: address.city,
      addressCountry: address.countryCode,
    },
    geo: site.geo
      ? { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng }
      : undefined,
    hasMap: mapsUrl(),
    openingHours: site.openingHoursSpec.length ? site.openingHoursSpec : undefined,
    areaServed: ["Mwanyamala", "Dar es Salaam"],
    availableLanguage: ["en", "sw"],
    paymentAccepted: site.insurersList.length ? site.insurersList.join(", ") : undefined,
    medicalSpecialty: "Dentistry",
  };
}
