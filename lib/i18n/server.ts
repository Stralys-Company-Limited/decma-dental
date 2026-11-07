import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";
import { getDictionaryFor, type Dictionary } from "./dictionaries";

/** Current locale from the [lang] root segment. Server Components only. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!isLocale(value)) notFound();
  return value;
}

export async function getDictionary(): Promise<Dictionary> {
  return getDictionaryFor(await getLocale());
}
