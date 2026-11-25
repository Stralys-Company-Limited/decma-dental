import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getAppointmentByToken, hasStarted } from "@decma/booking/repo";
import { calendarLinks } from "@decma/booking/calendar-event";
import { AppointmentDetails } from "@/components/booking/AppointmentDetails";
import { AddToCalendar } from "@/components/booking/AddToCalendar";
import { CancelForm } from "@/components/booking/CancelForm";
import { PageHeader } from "@/components/PageHeader";
import { ButtonLink } from "@/components/ui/Button";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary();
  return buildMetadata({
    locale,
    path: "/book",
    title: `${dict.booking.manage.h1} | DECMA Dental Clinic`,
    description: dict.booking.intro,
    noIndex: true,
  });
}

export default async function ManagePage({ params }: PageProps<"/[lang]/book/manage/[token]">) {
  const dict = await getDictionary();
  return (
    <>
      <PageHeader title={dict.booking.manage.h1} />
      <Suspense fallback={<div className="container-page h-96 py-10" aria-hidden />}>
        <ManageContent params={params} />
      </Suspense>
    </>
  );
}

async function ManageContent({ params }: { params: Promise<{ token: string }> }) {
  await connection();
  const { token } = await params;
  const locale = await getLocale();
  const dict = await getDictionary();
  const m = dict.booking.manage;
  const c = dict.booking.confirmed;
  const appt = await getAppointmentByToken(token);

  if (!appt) {
    return (
      <div className="container-page py-12">
        <p className="max-w-2xl bg-navy-20 p-6 font-semibold text-navy">{c.notFound}</p>
      </div>
    );
  }

  const past = hasStarted(appt);
  const active = appt.status !== "cancelled" && !past;

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_24rem]">
      <section className="space-y-6">
        <AppointmentDetails appt={appt} dict={dict} locale={locale} showStatus />
        {active ? (
          <CancelForm
            locale={locale}
            token={appt.manage_token}
            labels={{ cancel: m.cancel, confirm: m.cancelConfirm, sending: dict.forms.sending }}
          />
        ) : (
          <p className="font-semibold text-navy">{past ? m.past : m.cancelled}</p>
        )}
        <ButtonLink href={localePath(locale, "/book")} variant="primary">
          {m.rebook}
        </ButtonLink>
      </section>
      {active && (
        <AddToCalendar
          title={c.addToCalendar}
          text={c.addToCalendarText}
          links={calendarLinks(appt)}
          copy={c.calendars}
        />
      )}
    </div>
  );
}
