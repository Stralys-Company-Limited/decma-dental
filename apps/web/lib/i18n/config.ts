export {
  defaultLocale,
  isLocale,
  localePath,
  locales,
  type Locale,
} from "@decma/booking/locale";

import { isLocale, type Locale } from "@decma/booking/locale";

export const hreflang: Record<Locale, string> = { en: "en-TZ", sw: "sw-TZ" };
export const ogLocale: Record<Locale, string> = { en: "en_TZ", sw: "sw_TZ" };
/** BCP 47 tags used for Intl date and number formatting. */
export const intlLocale: Record<Locale, string> = { en: "en-GB", sw: "sw-TZ" };

/**
 * Languages currently published. Swahili content exists but is switched off until a native speaker has
 * reviewed it; add "sw" here to bring back /sw pages, the language button, hreflang and the sitemap entries.
 */
export const enabledLocales: readonly Locale[] = ["en"];

export function isEnabledLocale(value: string | undefined | null): value is Locale {
  return isLocale(value) && enabledLocales.includes(value);
}

/** Strips a leading /en or /sw from a pathname. */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/(en|sw)(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}
