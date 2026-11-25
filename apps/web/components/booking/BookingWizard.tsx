"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { fetchDaySlots, fetchMonthAvailability } from "@/lib/actions/booking";
import { formatDay, monthKey, shiftMonth } from "@decma/booking/time";
import type { Locale } from "@/lib/i18n/config";
import type { MonthAvailability, Slot } from "@decma/booking/types";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/forms/Fields";
import { BookingBand, type BandCopy } from "./BookingBand";
import { MonthCalendar, type CalendarCopy } from "./MonthCalendar";
import { TimeSlots, type TimeCopy } from "./TimeSlots";
import { AppointmentSummary, type SummaryCopy } from "./AppointmentSummary";
import { DetailsForm, type DetailsCopy } from "./DetailsForm";

export type WizardCopy = {
  band: BandCopy;
  calendar: CalendarCopy;
  time: TimeCopy;
  summary: SummaryCopy & { chooseFirst: string; continue: string };
  details: DetailsCopy;
};

export function BookingWizard({
  locale,
  copy,
  initial,
  range,
  where,
  privacyHref,
}: {
  locale: Locale;
  copy: WizardCopy;
  initial: MonthAvailability;
  range: { first: string; last: string };
  where: string;
  privacyHref: string;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [month, setMonth] = useState(initial.month);
  const [months, setMonths] = useState<Record<string, MonthAvailability>>({ [initial.month]: initial });
  const [date, setDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [monthPending, startMonth] = useTransition();
  const latestDate = useRef<string | null>(null);

  const loadMonth = useCallback((m: string) => {
    startMonth(async () => {
      const data = await fetchMonthAvailability(m);
      if (data) setMonths((prev) => ({ ...prev, [m]: data }));
    });
  }, []);

  const loadSlots = useCallback(async (d: string) => {
    latestDate.current = d;
    setLoadingSlots(true);
    const result = await fetchDaySlots(d);
    if (latestDate.current !== d) return;
    setSlots(result ?? []);
    setLoadingSlots(false);
  }, []);

  function goMonth(delta: number) {
    const next = shiftMonth(month, delta);
    setMonth(next);
    if (!months[next]) loadMonth(next);
  }

  function pickDate(d: string) {
    setNotice(null);
    setDate(d);
    setSlot(null);
    setSlots(null);
    void loadSlots(d);
  }

  const onSlotTaken = useCallback(() => {
    setNotice(copy.details.slotTaken);
    setStep(1);
    setSlot(null);
    if (date) {
      void loadSlots(date);
      loadMonth(monthKey(date));
    }
  }, [copy.details.slotTaken, date, loadMonth, loadSlots]);

  const s = copy.summary;
  const continueButton =
    step === 1 ? (
      <Button
        type="button"
        variant={slot ? "navy" : "outlineNavy"}
        className={slot ? "w-full" : "w-full bg-white disabled:opacity-100"}
        disabled={!slot}
        onClick={() => {
          setStep(2);
          window.scrollTo?.({ top: 0, behavior: "smooth" });
        }}
      >
        {slot ? s.continue : s.chooseFirst}
      </Button>
    ) : undefined;

  return (
    <>
      <BookingBand copy={copy.band} step={step} />
      <div className="container-page grid gap-6 py-10 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="space-y-6">
          {notice && <FormAlert status="error" message={notice} />}
          {step === 1 ? (
            <>
              <MonthCalendar
                locale={locale}
                copy={copy.calendar}
                month={month}
                availability={months[month]}
                loading={monthPending && !months[month]}
                selected={date}
                canPrev={month > monthKey(range.first)}
                canNext={month < monthKey(range.last)}
                onPrev={() => goMonth(-1)}
                onNext={() => goMonth(1)}
                onSelect={pickDate}
              />
              <TimeSlots
                copy={copy.time}
                date={date}
                slots={slots}
                loading={loadingSlots}
                selected={slot}
                onSelect={setSlot}
              />
            </>
          ) : (
            slot && (
              <DetailsForm
                locale={locale}
                copy={copy.details}
                startsAt={slot.startsAt}
                privacyHref={privacyHref}
                onBack={() => setStep(1)}
                onSlotTaken={onSlotTaken}
              />
            )
          )}
        </div>
        <div className="lg:sticky lg:top-24">
          <AppointmentSummary
            copy={s}
            day={date ? formatDay(date, locale) : copy.time.notChosen}
            time={slot ? slot.time : copy.time.notChosen}
            where={where}
            action={continueButton}
          />
        </div>
      </div>
    </>
  );
}
