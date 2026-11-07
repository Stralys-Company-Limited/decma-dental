import { getDictionary, getLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";

export async function OpeningSoonBand() {
  const locale = await getLocale();
  const dict = await getDictionary();
  const o = dict.openingSoon;

  return (
    <section aria-labelledby="opening-title" className="bg-teal">
      <div className="container-page flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <Eyebrow tone="deep">{o.eyebrow}</Eyebrow>
          <h2 id="opening-title" className="mt-4 text-3xl font-bold text-navy sm:text-4xl">
            {o.title(site.openingDateLabel)}
          </h2>
          <p className="mt-3 text-sm text-navy-deep sm:text-base">{o.text}</p>
        </div>
        <ButtonLink href={localePath(locale, "/contact#callback")} variant="navy" className="shrink-0">
          {dict.common.requestCallback}
        </ButtonLink>
      </div>
    </section>
  );
}

/** Closing call to action used at the end of service and article pages. */
export async function BookCta({ title, text }: { title: string; text: string }) {
  const locale = await getLocale();
  const dict = await getDictionary();
  return (
    <aside className="mt-14 bg-navy-20 p-8 sm:p-10">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-3 max-w-2xl text-ink-80">{text}</p>
      <div className="mt-6 flex flex-wrap gap-4">
        <ButtonLink href={localePath(locale, "/book")} variant="navy">
          {dict.common.bookAppointment}
        </ButtonLink>
        <ButtonLink href={localePath(locale, "/contact#callback")} variant="outlineNavy">
          {dict.common.requestCallback}
        </ButtonLink>
      </div>
    </aside>
  );
}
