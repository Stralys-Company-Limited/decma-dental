import type { IconName } from "@/components/ui/Icon";
import type { Locale } from "@/lib/i18n/config";

export type ServiceCopy = {
  /** Card title and breadcrumb label. */
  name: string;
  /** One-line card description (mockup page 1). */
  short: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  involves: string[];
  whoFor: string[];
  costFactors: string[];
  timing: string;
  faqs: { q: string; a: string }[];
};

export type Service = { slug: string; icon: IconName } & Record<Locale, ServiceCopy>;
