import type { MetadataRoute } from "next";
import { enabledLocales } from "@/lib/i18n/config";
import { absoluteUrl, languageAlternates } from "@/lib/seo";
import { services } from "@/content/services";
import { articles } from "@/content/articles";

const staticPaths = [
  { path: "/", priority: 1 },
  { path: "/services", priority: 0.9 },
  { path: "/what-to-expect", priority: 0.7 },
  { path: "/oral-health-tips", priority: 0.6 },
  { path: "/contact", priority: 0.9 },
  { path: "/referrals", priority: 0.5 },
  { path: "/book", priority: 0.8 },
  { path: "/privacy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    ...staticPaths,
    ...services.map((s) => ({ path: `/services/${s.slug}`, priority: 0.8 })),
    ...articles.map((a) => ({ path: `/oral-health-tips/${a.slug}`, priority: 0.5 })),
  ];

  return pages.flatMap(({ path, priority }) =>
    enabledLocales.map((locale) => ({
      url: absoluteUrl(locale, path),
      priority,
      changeFrequency: "monthly" as const,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
