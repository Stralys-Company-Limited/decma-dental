import type { Locale } from "../config";
import { en, type Dictionary } from "./en";
import { sw } from "./sw";

const dictionaries: Record<Locale, Dictionary> = { en, sw };

/** For Server Actions, Route Handlers and emails, where root params are not available. */
export function getDictionaryFor(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
