import { getDictionary, getLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";

export async function NotFoundContent() {
  const locale = await getLocale();
  const dict = await getDictionary();
  return (
    <section className="container-page py-24">
      <Eyebrow>{dict.notFound.eyebrow}</Eyebrow>
      <h1 className="mt-4 text-4xl font-bold">{dict.notFound.title}</h1>
      <p className="mt-4 max-w-xl text-ink-80">{dict.notFound.text}</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <ButtonLink href={localePath(locale, "/services")} variant="navy">
          {dict.nav.services}
        </ButtonLink>
        <ButtonLink href={localePath(locale, "/contact")} variant="outlineNavy">
          {dict.nav.visitUs}
        </ButtonLink>
        <ButtonLink href={localePath(locale, "/book")} variant="primary">
          {dict.nav.book}
        </ButtonLink>
      </div>
    </section>
  );
}
