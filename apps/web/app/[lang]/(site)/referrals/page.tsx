import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { buildMetadata, pageSeo } from "@/lib/seo";
import { mailHref, site } from "@decma/booking/site";
import { PageHeader } from "@/components/PageHeader";
import { ReferralForm } from "@/components/forms/ReferralForm";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildMetadata({ locale, path: "/referrals", ...pageSeo.referrals[locale] });
}

export default async function ReferralsPage() {
  const locale = await getLocale();
  const dict = await getDictionary();
  const r = dict.referrals;
  const mail = mailHref(site.referralsEmail);

  return (
    <>
      <PageHeader
        eyebrow={dict.referralBand.eyebrow}
        title={r.h1}
        intro={r.intro}
      />
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-10">
          <section aria-labelledby="how-title">
            <h2 id="how-title" className="text-2xl font-bold">
              {r.howTitle}
            </h2>
            <ol className="mt-6 space-y-4">
              {r.how.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="font-display text-2xl font-bold text-navy">{String(i + 1).padStart(2, "0")}</span>
                  <span className="pt-1 leading-relaxed text-ink-80">{step}</span>
                </li>
              ))}
            </ol>
          </section>
          <section aria-labelledby="desk-title" className="bg-navy p-6 text-white">
            <h2 id="desk-title" className="text-xl font-bold text-white">
              {r.emailTitle}
            </h2>
            <p className="mt-2 text-sm text-white/90">{r.emailText}</p>
            <p className="mt-3 flex items-center gap-2 font-semibold">
              <Icon name="mail" className="size-5 text-teal" />
              {mail ? (
                <a href={mail} className="underline underline-offset-4 hover:text-teal">
                  {site.referralsEmail}
                </a>
              ) : (
                site.referralsEmail
              )}
            </p>
          </section>
        </div>
        <section aria-labelledby="ref-form-title" className="bg-navy-20 p-6 sm:p-8">
          <h2 id="ref-form-title" className="text-2xl font-bold">
            {r.formTitle}
          </h2>
          <p className="mt-3 mb-6 text-sm text-ink-80">{r.formText}</p>
          <ReferralForm locale={locale} copy={r} sending={dict.forms.sending} />
        </section>
      </div>
    </>
  );
}
