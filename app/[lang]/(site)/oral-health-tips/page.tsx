import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { buildMetadata, pageSeo } from "@/lib/seo";
import { articles } from "@/content/articles";
import { PageHeader } from "@/components/PageHeader";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildMetadata({ locale, path: "/oral-health-tips", ...pageSeo.tips[locale] });
}

export default async function TipsPage() {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <>
      <PageHeader
        eyebrow={dict.tips.eyebrow}
        title={dict.tips.h1}
        intro={dict.tips.intro}
      />
      <div className="container-page py-16">
        <ul className="grid gap-6 md:grid-cols-2">
          {articles.map((a) => {
            const copy = a[locale];
            return (
              <li
                key={a.slug}
                className="group relative flex flex-col border border-line bg-white p-6 transition-colors hover:border-navy-40 hover:bg-navy-20/30 sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center bg-teal-20 text-teal-deep">
                    <Icon name={a.icon} className="size-6" />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-deep">{copy.tipTitle}</p>
                </div>
                <h2 className="mt-5 text-lg leading-snug font-bold text-navy sm:text-xl">
                  <Link
                    href={localePath(locale, `/oral-health-tips/${a.slug}`)}
                    className="after:absolute after:inset-0 group-hover:text-navy-80"
                  >
                    {copy.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-80">{copy.description}</p>
                <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy group-hover:text-teal-deep">
                  {dict.common.readArticle}
                  <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
