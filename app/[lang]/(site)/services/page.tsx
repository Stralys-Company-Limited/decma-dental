import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { buildMetadata, pageSeo } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { VisitSteps } from "@/components/sections/VisitSteps";
import { OpeningSoonBand } from "@/components/sections/Bands";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildMetadata({ locale, path: "/services", ...pageSeo.services[locale] });
}

export default async function ServicesPage() {
  const dict = await getDictionary();
  return (
    <>
      <PageHeader
        eyebrow={dict.services.eyebrow}
        title={dict.services.title}
        intro={dict.services.intro}
      />
      <ServicesGrid hideHeader />
      <VisitSteps />
      <OpeningSoonBand />
    </>
  );
}
