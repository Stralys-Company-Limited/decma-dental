import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getAppointmentByToken } from "@/lib/booking/repo";
import { calendarLinks } from "@/lib/booking/calendar-event";
import { formatReference } from "@/lib/booking/reference";
import { bandCopy } from "@/lib/booking/copy";
import { BookingBand } from "@/components/booking/BookingBand";
import { AddToCalendar } from "@/components/booking/AddToCalendar";
import { AppointmentDetails } from "@/components/booking/AppointmentDetails";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary();
  return buildMetadata({
    locale,
    path: "/book/confirmed",
    title: `${dict.booking.confirmed.title} | DECMA Dental Clinic`,
    description: dict.booking.intro,
    noIndex: true,
  });
}

export default async function ConfirmedPage({ searchParams }: PageProps<"/[lang]/book/confirmed">) {
  const dict = await getDictionary();
  return (
    <>
      <BookingBand copy={bandCopy(dict)} step={3} />
      <Suspense fallback={<div className="container-page h-96 py-10" aria-hidden />}>
        <Confirmation searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Confirmation({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { token } = await searchParams;
  const locale = await getLocale();
  const dict = await getDictionary();
  const c = dict.booking.confirmed;
  const appt = typeof token === "string" ? await getAppointmentByToken(token) : null;

  if (!appt) {
    return (
      <div className="container-page py-12">
        <p className="max-w-2xl bg-navy-20 p-6 font-semibold text-navy">{c.notFound}</p>
      </div>
    );
  }

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_24rem]">
      <section aria-labelledby="confirmed-title">
        <h2 id="confirmed-title" className="flex items-center gap-3 text-3xl font-bold">
          <span className="flex size-9 items-center justify-center bg-teal text-navy-deep">
            <Icon name="check" className="size-5" strokeWidth={2.5} />
          </span>
          {c.title}
        </h2>
        <p className="mt-3 text-ink-80" role="status">
          {c.text(appt.email)}
        </p>
        <div className="mt-6 border-l-4 border-teal bg-teal-20 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-deep">{c.referenceLabel}</p>
          <p className="mt-1 font-display text-3xl font-bold tracking-wide text-navy">
            {formatReference(appt.reference)}
          </p>
          <p className="mt-2 text-sm text-navy-deep">{c.keepReference}</p>
        </div>
        <div className="mt-6">
          <AppointmentDetails appt={appt} dict={dict} locale={locale} />
        </div>
        <p className="mt-6 text-sm text-ink-80">
          {c.manage}{" "}
          <Link
            href={localePath(locale, `/book/manage/${appt.manage_token}`)}
            className="font-semibold text-navy underline underline-offset-4"
          >
            {c.manageLink}
          </Link>
        </p>
      </section>
      <AddToCalendar
        title={c.addToCalendar}
        text={c.addToCalendarText}
        links={calendarLinks(appt)}
        copy={c.calendars}
      />
    </div>
  );
}
