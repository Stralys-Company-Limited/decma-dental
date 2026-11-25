import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { PageSkeleton } from "@/components/PageSkeleton";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { getService, services } from "@/content/services";
import { site } from "@decma/booking/site";
import { PageHeader } from "@/components/PageHeader";
import { FaqList, faqJsonLd } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { BookCta } from "@/components/sections/Bands";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Icon } from "@/components/ui/Icon";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const service = getService(slug);
  if (!service) return {};
  const copy = service[locale];
  return buildMetadata({
    locale,
    path: `/services/${slug}`,
    title: copy.seoTitle,
    description: copy.metaDescription,
  });
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed text-ink-80">
          <Icon name="check" className="mt-1 size-4 shrink-0 text-teal-deep" strokeWidth={2.5} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ServicePage({ params }: PageProps<"/[lang]/services/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ServiceContent params={params} />
    </Suspense>
  );
}

async function ServiceContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const locale = await getLocale();
  const dict = await getDictionary();
  const copy = service[locale];
  const d = dict.services.detail;

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: copy.h1,
    description: copy.metaDescription,
    url: absoluteUrl(locale, `/services/${slug}`),
    provider: { "@type": "Dentist", "@id": `${site.url}/#clinic`, name: site.name },
  };

  return (
    <>
      <JsonLd data={serviceLd} />
      <JsonLd data={faqJsonLd(copy.faqs)} />
      <PageHeader
        eyebrow={dict.services.eyebrow}
        title={copy.h1}
        intro={copy.intro}
      />

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_20rem]">
        <article className="space-y-10">
          <Block title={d.involves}>
            <Bullets items={copy.involves} />
          </Block>
          <Block title={d.whoFor}>
            <Bullets items={copy.whoFor} />
          </Block>
          <Block title={d.cost}>
            <Bullets items={copy.costFactors} />
            <p className="mt-5 bg-teal-20 p-4 text-sm leading-relaxed text-navy-deep">{d.costNote}</p>
          </Block>
          <Block title={d.timing}>
            <p className="leading-relaxed text-ink-80">{copy.timing}</p>
          </Block>
          <Block title={d.faq}>
            <FaqList items={copy.faqs} />
          </Block>
          <BookCta title={d.ctaTitle} text={d.ctaText} />
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-line p-6">
            <Icon name={service.icon} className="size-8 text-navy" />
            <p className="mt-4 text-sm font-semibold text-navy">{copy.name}</p>
            <p className="mt-2 text-sm text-ink-80">{copy.short}</p>
            <p className="mt-4 text-xs text-ink-60">{dict.common.reviewedBy}</p>
          </div>
        </aside>
      </div>

      <ServicesGrid exclude={slug} title={d.otherServices} />
    </>
  );
}
