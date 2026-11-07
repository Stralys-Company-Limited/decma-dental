import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageSkeleton } from "@/components/PageSkeleton";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { articles, getArticle } from "@/content/articles";
import { site } from "@/lib/site";
import { formatDay } from "@/lib/booking/time";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { BookCta } from "@/components/sections/Bands";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/oral-health-tips/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const article = getArticle(slug);
  if (!article) return {};
  const copy = article[locale];
  return buildMetadata({
    locale,
    path: `/oral-health-tips/${slug}`,
    title: `${copy.title} | DECMA Dental Clinic`,
    description: copy.description,
  });
}

export default function ArticlePage({ params }: PageProps<"/[lang]/oral-health-tips/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ArticleContent params={params} />
    </Suspense>
  );
}

async function ArticleContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const locale = await getLocale();
  const dict = await getDictionary();
  const copy = article[locale];
  const { default: Body } = await article.load[locale]();

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.title,
    description: copy.description,
    inLanguage: locale,
    dateModified: article.updated,
    url: absoluteUrl(locale, `/oral-health-tips/${slug}`),
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: site.name, logo: `${site.url}/brand/web/logo-navy.png` },
  };

  return (
    <>
      <JsonLd data={ld} />
      <PageHeader
        eyebrow={dict.tips.eyebrow}
        title={copy.title}
        intro={copy.description}
      />
      <div className="container-page py-14">
        <article className="mx-auto max-w-3xl">
          <p className="border-l-4 border-teal pl-4 text-sm text-ink-60">
            {dict.common.reviewedBy} · {dict.legal.draftNote} {formatDay(article.updated, locale)}
          </p>
          <div className="mt-6">
            <Body />
          </div>
          <BookCta title={dict.services.detail.ctaTitle} text={dict.services.detail.ctaText} />
        </article>
      </div>
    </>
  );
}
