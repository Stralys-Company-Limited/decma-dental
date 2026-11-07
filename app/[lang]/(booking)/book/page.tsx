import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { buildMetadata, pageSeo } from "@/lib/seo";
import { site, telHref } from "@/lib/site";
import { hasBookingBackend, isDemoMode } from "@/lib/booking/store";
import { bookingsOpen, bookingWindow, getMonthAvailability } from "@/lib/booking/availability";
import { monthKey } from "@/lib/booking/time";
import type { MonthAvailability } from "@/lib/booking/types";
import { bandCopy, wizardCopy } from "@/lib/booking/copy";
import { BookingBand } from "@/components/booking/BookingBand";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { ButtonLink } from "@/components/ui/Button";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildMetadata({ locale, path: "/book", ...pageSeo.book[locale] });
}

export default async function BookPage() {
  const dict = await getDictionary();
  return (
    <Suspense
      fallback={
        <>
          <BookingBand copy={bandCopy(dict)} step={1} />
          <div className="container-page grid gap-6 py-10 lg:grid-cols-[1fr_20rem]" aria-hidden>
            <div className="h-[28rem] animate-pulse border border-line bg-navy-20/40" />
            <div className="h-72 animate-pulse bg-navy-20" />
          </div>
        </>
      }
    >
      <BookingLoader />
    </Suspense>
  );
}

async function BookingLoader() {
  await connection();
  const locale = await getLocale();
  const dict = await getDictionary();

  let loaded: { range: ReturnType<typeof bookingWindow>; initial: MonthAvailability } | null = null;
  if (hasBookingBackend() && bookingsOpen()) {
    try {
      const range = bookingWindow();
      loaded = { range, initial: await getMonthAvailability(monthKey(range.first)) };
    } catch (err) {
      console.error("[booking] could not load availability", err);
    }
  }

  if (loaded) {
    return (
      <>
        {isDemoMode() && (
          <p className="bg-amber-100 px-5 py-2.5 text-center text-sm font-semibold text-amber-900">
            Demo mode (only on this computer): bookings are kept in memory until the dev server restarts and no
            emails are sent. Connect Supabase in .env to use the real database.
          </p>
        )}
        <BookingWizard
          locale={locale}
          copy={wizardCopy(dict)}
          initial={loaded.initial}
          range={loaded.range}
          where={`${site.address.street}, ${site.address.area}`}
          privacyHref={localePath(locale, "/privacy")}
        />
        <p className="container-page pb-12 text-sm">
          <Link
            href={localePath(locale, "/book/check")}
            className="font-semibold text-navy underline underline-offset-4 hover:text-teal-deep"
          >
            {dict.booking.lookup.link}
          </Link>
        </p>
      </>
    );
  }

  const message = bookingsOpen()
    ? dict.booking.unavailableOnline
    : dict.booking.notOpenYet(site.openingDateLabel);

  return (
    <>
      <BookingBand copy={bandCopy(dict)} step={1} />
      <div className="container-page py-12">
        <div className="max-w-2xl bg-navy-20 p-8">
          <p className="text-lg font-semibold text-navy">{message}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <ButtonLink href={localePath(locale, "/contact#callback")} variant="navy">
              {dict.common.requestCallback}
            </ButtonLink>
            <ButtonLink href={telHref() ?? localePath(locale, "/contact")} variant="outlineNavy">
              {dict.common.call(site.phone)}
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
