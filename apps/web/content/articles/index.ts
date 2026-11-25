import type { ComponentType } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { IconName } from "@/components/ui/Icon";

type ArticleCopy = {
  title: string;
  description: string;
  /** Short title and text for the homepage tip card (mockup page 2). */
  tipTitle: string;
  tipText: string;
};

type MdxModule = { default: ComponentType };

export type Article = {
  slug: string;
  icon: IconName;
  updated: string;
  load: Record<Locale, () => Promise<MdxModule>>;
} & Record<Locale, ArticleCopy>;

export const articles: Article[] = [
  {
    slug: "how-to-brush-your-teeth",
    icon: "toothbrush",
    updated: "2026-11-07",
    load: {
      en: () => import("./en/how-to-brush-your-teeth.mdx"),
      sw: () => import("./sw/how-to-brush-your-teeth.mdx"),
    },
    en: {
      title: "How to brush your teeth properly (two minutes, twice a day)",
      description:
        "A simple routine for cleaner teeth and healthier gums: how long to brush, which toothpaste to use and the most common mistakes.",
      tipTitle: "Brush twice a day",
      tipText: "Two minutes, morning and night, with a fluoride toothpaste.",
    },
    sw: {
      title: "Jinsi ya kupiga mswaki vizuri (dakika mbili, mara mbili kwa siku)",
      description:
        "Utaratibu rahisi kwa meno safi na fizi zenye afya: muda wa kupiga mswaki, dawa ya meno ya kutumia na makosa ya kawaida.",
      tipTitle: "Piga mswaki mara mbili kwa siku",
      tipText: "Dakika mbili, asubuhi na usiku, kwa dawa ya meno yenye floraidi.",
    },
  },
  {
    slug: "cleaning-between-teeth",
    icon: "floss",
    updated: "2026-11-07",
    load: {
      en: () => import("./en/cleaning-between-teeth.mdx"),
      sw: () => import("./sw/cleaning-between-teeth.mdx"),
    },
    en: {
      title: "Floss or interdental brushes: what reaches where a toothbrush can't",
      description:
        "Why cleaning between your teeth matters, how to choose between floss and interdental brushes, and how to do it well.",
      tipTitle: "Clean between teeth",
      tipText: "Floss or interdental brushes once a day reach where a toothbrush can't.",
    },
    sw: {
      title: "Kusafisha kati ya meno: uzi (floss) na brashi za kati ya meno",
      description:
        "Kwa nini kusafisha kati ya meno ni muhimu, jinsi ya kuchagua kati ya uzi na brashi ndogo, na jinsi ya kufanya vizuri.",
      tipTitle: "Safisha kati ya meno",
      tipText: "Uzi au brashi za kati ya meno mara moja kwa siku hufika mahali mswaki haufiki.",
    },
  },
  {
    slug: "sugar-and-your-teeth",
    icon: "candy",
    updated: "2026-11-07",
    load: {
      en: () => import("./en/sugar-and-your-teeth.mdx"),
      sw: () => import("./sw/sugar-and-your-teeth.mdx"),
    },
    en: {
      title: "Sugar and your teeth: simple habits that help",
      description:
        "How sugar causes tooth decay, why how often you eat it matters more than how much, and easy swaps for the whole family.",
      tipTitle: "Cut back on sugar",
      tipText: "Keep sweets and sugary drinks to mealtimes rather than through the day.",
    },
    sw: {
      title: "Sukari na meno yako: tabia rahisi zinazosaidia",
      description:
        "Jinsi sukari inavyosababisha meno kuoza, kwa nini mara ngapi unakula sukari ni muhimu kuliko kiasi, na mbadala rahisi kwa familia nzima.",
      tipTitle: "Punguza sukari",
      tipText: "Kula pipi na kunywa vinywaji vyenye sukari wakati wa mlo tu, si siku nzima.",
    },
  },
  {
    slug: "how-often-dental-check-up",
    icon: "calendarCheck",
    updated: "2026-11-07",
    load: {
      en: () => import("./en/how-often-dental-check-up.mdx"),
      sw: () => import("./sw/how-often-dental-check-up.mdx"),
    },
    en: {
      title: "How often should you get a dental check-up?",
      description:
        "Why the right check-up interval is different for everyone, what happens at a check-up and the signs that you should come in sooner.",
      tipTitle: "Have regular check-ups",
      tipText: "Problems found early are simpler to treat. Ask your dentist how often you need one.",
    },
    sw: {
      title: "Unapaswa kuchunguzwa meno mara ngapi?",
      description:
        "Kwa nini muda sahihi wa uchunguzi hutofautiana kwa kila mtu, kinachofanyika wakati wa uchunguzi na dalili zinazoonyesha unapaswa kuja mapema.",
      tipTitle: "Fanya uchunguzi wa mara kwa mara",
      tipText: "Matatizo yanayogunduliwa mapema ni rahisi kutibu. Uliza daktari wa meno ni mara ngapi unahitaji.",
    },
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
