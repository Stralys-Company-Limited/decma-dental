import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { buildMetadata, dentistJsonLd, pageSeo } from "@/lib/seo";
import { site } from "@decma/booking/site";
import { JsonLd } from "@/components/JsonLd";
import { FindClinic } from "@/components/sections/FindClinic";
import { OpeningSoonBand } from "@/components/sections/Bands";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const seo = pageSeo.visitUs[locale];
  return buildMetadata({
    locale,
    path: "/contact",
    title: seo.title,
    description: seo.description({
      street: site.address.street,
      phone: site.phone,
      email: site.email,
      hours: site.hours.weekdays,
    }),
  });
}

export default async function VisitUsPage() {
  const locale = await getLocale();
  return (
    <>
      <JsonLd data={dentistJsonLd(locale)} />
      <div aria-hidden className="h-3 border-b-4 border-teal bg-navy" />
      <FindClinic headingLevel="h1" />
      <OpeningSoonBand />
    </>
  );
}
