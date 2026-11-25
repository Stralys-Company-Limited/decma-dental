import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { buildMetadata, pageSeo } from "@/lib/seo";
import { site } from "@decma/booking/site";
import { PageHeader } from "@/components/PageHeader";
import { VisitSteps } from "@/components/sections/VisitSteps";
import { FaqList, faqJsonLd } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { BookCta } from "@/components/sections/Bands";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildMetadata({ locale, path: "/what-to-expect", ...pageSeo.yourVisit[locale] });
}

export default async function YourVisitPage() {
  const dict = await getDictionary();
  const v = dict.visit;
  const faqs = v.faqs({
    cancellation: site.cancellationPolicy,
    insurers: site.insurers,
    length: site.appointmentLengthMinutes,
  });

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <PageHeader
        eyebrow={v.eyebrow}
        title={v.h1}
        intro={v.intro}
      />
      <VisitSteps showHeading={false} />

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_1.4fr]">
        <section aria-labelledby="bring-title">
          <h2 id="bring-title" className="text-2xl font-bold">
            {v.bringTitle}
          </h2>
          <ul className="mt-6 space-y-3">
            {v.bring.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed text-ink-80">
                <Icon name="check" className="mt-1 size-4 shrink-0 text-teal-deep" strokeWidth={2.5} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="faq-title">
          <h2 id="faq-title" className="mb-6 text-2xl font-bold">
            {v.faqTitle}
          </h2>
          <FaqList items={faqs} />
        </section>
      </div>

      <div className="container-page pb-20">
        <BookCta title={dict.services.detail.ctaTitle} text={dict.services.detail.ctaText} />
      </div>
    </>
  );
}
