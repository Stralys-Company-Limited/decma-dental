import { getDictionary, getLocale } from "@/lib/i18n/server";
import { legalDocs, legalUpdated } from "@/content/legal";
import { formatDay } from "@/lib/booking/time";
import { PageHeader } from "@/components/PageHeader";

export async function LegalPage({ doc }: { doc: keyof typeof legalDocs }) {
  const locale = await getLocale();
  const dict = await getDictionary();
  const { default: Body } = await legalDocs[doc][locale]();
  const title = doc === "privacy" ? dict.legal.privacyTitle : dict.legal.termsTitle;

  return (
    <>
      <PageHeader title={title} />
      <div className="container-page py-14">
        <article className="mx-auto max-w-3xl">
          <p className="text-sm text-ink-60">
            {dict.legal.draftNote} {formatDay(legalUpdated, locale)}
          </p>
          <Body />
        </article>
      </div>
    </>
  );
}
