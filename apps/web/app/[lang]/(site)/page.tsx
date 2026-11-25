import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { buildMetadata, dentistJsonLd, pageSeo } from "@/lib/seo";
import { site } from "@decma/booking/site";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/sections/Hero";
import { InfoStrip } from "@/components/sections/InfoStrip";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { ExploreHub } from "@/components/sections/ExploreHub";
import { OpeningSoonBand } from "@/components/sections/Bands";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const seo = pageSeo.home[locale];
  return buildMetadata({
    locale,
    path: "/",
    title: seo.title,
    description: seo.description(site.openingDateLabel),
  });
}

export default async function HomePage() {
  const locale = await getLocale();
  return (
    <>
      <JsonLd data={dentistJsonLd(locale)} />
      <Hero />
      <InfoStrip />
      <ServicesOverview />
      <ExploreHub />
      <OpeningSoonBand />
    </>
  );
}
