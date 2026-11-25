import type { ComponentType } from "react";
import type { Locale } from "@/lib/i18n/config";

type MdxModule = { default: ComponentType };

export const legalUpdated = "2026-11-07";

export const legalDocs = {
  privacy: {
    en: () => import("./en/privacy.mdx"),
    sw: () => import("./sw/privacy.mdx"),
  },
  terms: {
    en: () => import("./en/terms.mdx"),
    sw: () => import("./sw/terms.mdx"),
  },
} satisfies Record<string, Record<Locale, () => Promise<MdxModule>>>;
