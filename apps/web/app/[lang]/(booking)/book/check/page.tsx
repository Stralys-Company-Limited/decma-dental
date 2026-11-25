import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { site, telHref } from "@decma/booking/site";
import { PageHeader } from "@/components/PageHeader";
import { CheckAppointmentForm } from "@/components/booking/CheckAppointmentForm";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary();
  return buildMetadata({
    locale,
    path: "/book/check",
    title: `${dict.booking.lookup.h1} | DECMA Dental Clinic`,
    description: dict.booking.lookup.intro,
    noIndex: true,
  });
}

export default async function CheckAppointmentPage() {
  const locale = await getLocale();
  const dict = await getDictionary();
  const l = dict.booking.lookup;

  return (
    <>
      <PageHeader title={l.h1} intro={l.intro} />
      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_20rem]">
        <section className="max-w-xl border border-line bg-white p-6 sm:p-8">
          <div className="mb-6 flex size-12 items-center justify-center bg-teal-20 text-teal-deep">
            <Icon name="search" className="size-6" />
          </div>
          <CheckAppointmentForm
            locale={locale}
            copy={{
              reference: l.reference,
              referenceHint: l.referenceHint,
              phone: l.phone,
              submit: l.submit,
              sending: dict.forms.sending,
            }}
          />
        </section>
        <aside className="space-y-4 self-start bg-navy-20 p-6">
          <p className="text-sm leading-relaxed text-ink-80">{l.help}</p>
          <ButtonLink href={telHref() ?? localePath(locale, "/contact")} variant="outlineNavy" className="w-full bg-white">
            {dict.common.call(site.phone)}
          </ButtonLink>
          <ButtonLink href={localePath(locale, "/book")} variant="navy" className="w-full">
            {dict.common.bookAppointment}
          </ButtonLink>
        </aside>
      </div>
    </>
  );
}
