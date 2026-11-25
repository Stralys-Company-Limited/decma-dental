import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { buildMetadata, pageSeo } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildMetadata({ locale, path: "/privacy", ...pageSeo.privacy[locale] });
}

export default function PrivacyPage() {
  return <LegalPage doc="privacy" />;
}
