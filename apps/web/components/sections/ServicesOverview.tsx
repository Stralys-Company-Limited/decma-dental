import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { services } from "@/content/services";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

/** Homepage teaser: service names only, each linking to its own page. Full descriptions live on /services. */
export async function ServicesOverview() {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <Section id="services" labelledBy="services-title">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <Eyebrow>{dict.services.eyebrow}</Eyebrow>
          <h2 id="services-title" className="mt-4 text-3xl font-bold sm:text-4xl">
            {dict.services.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-80 md:text-base">{dict.home.servicesIntro}</p>
        </div>
        <Link
          href={localePath(locale, "/services")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-navy underline underline-offset-4 hover:text-teal-deep"
        >
          {dict.common.allServices}
          <Icon name="arrowRight" className="size-4" strokeWidth={2} />
        </Link>
      </div>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <li key={s.slug}>
            <Link
              href={localePath(locale, `/services/${s.slug}`)}
              className="group flex items-center gap-4 border border-line bg-white px-5 py-4 transition-colors hover:border-navy hover:bg-navy"
            >
              <span className="flex size-11 shrink-0 items-center justify-center bg-navy-20 text-navy transition-colors group-hover:bg-white/10 group-hover:text-teal">
                <Icon name={s.icon} className="size-6" />
              </span>
              <span className="flex-1 font-display text-base font-bold text-navy group-hover:text-white">
                {s[locale].name}
              </span>
              <Icon
                name="arrowRight"
                className="size-4 text-navy-60 transition-transform group-hover:translate-x-1 group-hover:text-teal"
                strokeWidth={2}
              />
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
