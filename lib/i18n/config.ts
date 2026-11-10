export const locales = ["en", "sw"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hreflang: Record<Locale, string> = { en: "en-TZ", sw: "sw-TZ" };
export const ogLocale: Record<Locale, string> = { en: "en_TZ", sw: "sw_TZ" };
/** BCP 47 tags used for Intl date and number formatting. */
export const intlLocale: Record<Locale, string> = { en: "en-GB", sw: "sw-TZ" };

/**
 * Languages currently published. Swahili content exists but is switched off until a native speaker has
 * reviewed it; add "sw" here to bring back /sw pages, the language button, hreflang and the sitemap entries.
 */
export const enabledLocales: readonly Locale[] = ["en"];

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function isEnabledLocale(value: string | undefined | null): value is Locale {
  return isLocale(value) && enabledLocales.includes(value);
}

/** Public URL path for a page in a given language. English has no prefix; Swahili lives under /sw. */
export function localePath(locale: Locale, path: string = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Strips a leading /en or /sw from a pathname. */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/(en|sw)(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}
