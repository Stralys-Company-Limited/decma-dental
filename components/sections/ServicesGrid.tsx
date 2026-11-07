import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { services } from "@/content/services";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

export async function ServicesGrid({
  hideHeader = false,
  exclude,
  title,
}: {
  hideHeader?: boolean;
  exclude?: string;
  title?: string;
}) {
  const locale = await getLocale();
  const dict = await getDictionary();
  const list = services.filter((s) => s.slug !== exclude);
  const CardHeading = hideHeader ? "h2" : "h3";

  return (
    <Section id="services" labelledBy={hideHeader ? undefined : "services-title"}>
      {!hideHeader && (
        <div className="grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div>
            <Eyebrow>{dict.services.eyebrow}</Eyebrow>
            <h2 id="services-title" className="mt-4 text-3xl font-bold sm:text-4xl">
              {title ?? dict.services.title}
            </h2>
          </div>
          {!title && <p className="text-sm leading-relaxed text-ink-80 md:text-base">{dict.services.intro}</p>}
        </div>
      )}

      <ul className={`grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3 ${hideHeader ? "" : "mt-10"}`}>
        {list.map((s) => {
          const copy = s[locale];
          return (
            <li
              key={s.slug}
              className="group relative border-b border-r border-line p-7 transition-colors hover:bg-navy-20/40"
            >
              <Icon name={s.icon} className="size-7 text-navy" />
              <CardHeading className="mt-5 text-lg font-bold">
                <Link
                  href={localePath(locale, `/services/${s.slug}`)}
                  className="after:absolute after:inset-0 group-hover:text-navy-80"
                >
                  {copy.name}
                </Link>
              </CardHeading>
              <p className="mt-2 text-sm leading-relaxed text-ink-80">{copy.short}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
