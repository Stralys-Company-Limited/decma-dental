"use client";

import { useRef, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { addDaysISO, daysInMonth, formatDay, formatMonth, weekdayOf } from "@/lib/booking/time";
import type { Locale } from "@/lib/i18n/config";
import type { MonthAvailability } from "@/lib/booking/types";

export type CalendarCopy = {
  chooseDay: string;
  prevMonth: string;
  nextMonth: string;
  weekdays: string[];
  legend: { available: string; chosen: string; unavailable: string };
};

export function MonthCalendar({
  locale,
  copy,
  month,
  availability,
  loading,
  selected,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onSelect,
}: {
  locale: Locale;
  copy: CalendarCopy;
  month: string;
  availability?: MonthAvailability;
  loading: boolean;
  selected: string | null;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (dateISO: string) => void;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const days = daysInMonth(month);
  const leading = (weekdayOf(days[0]) + 6) % 7;
  const isAvailable = (d: string) => availability?.days[d] === "available";
  const firstAvailable = days.find(isAvailable);
  const focusTarget = selected && selected.startsWith(month) && isAvailable(selected) ? selected : firstAvailable;

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const current = (e.target as HTMLElement).dataset.date;
    if (!current) return;
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (!step) return;
    e.preventDefault();
    let next = addDaysISO(current, step);
    while (next.startsWith(month)) {
      if (isAvailable(next)) {
        gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${next}"]`)?.focus();
        return;
      }
      next = addDaysISO(next, step > 0 ? 1 : -1);
    }
  }

  const navBtn = "flex size-9 items-center justify-center border border-navy-40 text-navy hover:bg-navy-20 disabled:opacity-30";

  return (
    <section aria-labelledby="choose-day" className="border border-line bg-white p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="choose-day" className="text-xl font-bold">
            {copy.chooseDay}
          </h2>
          <p className="mt-1 text-sm text-ink-80" aria-live="polite">
            {formatMonth(month, locale)}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className={navBtn} onClick={onPrev} disabled={!canPrev} aria-label={copy.prevMonth}>
            <Icon name="chevronLeft" className="size-4" strokeWidth={2} />
          </button>
          <button type="button" className={navBtn} onClick={onNext} disabled={!canNext} aria-label={copy.nextMonth}>
            <Icon name="chevronRight" className="size-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-ink-80" aria-hidden>
        {copy.weekdays.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div
        ref={gridRef}
        role="group"
        aria-label={formatMonth(month, locale)}
        aria-busy={loading}
        onKeyDown={onKeyDown}
        className={`mt-2 grid grid-cols-7 gap-1.5 ${loading ? "opacity-50" : ""}`}
      >
        {Array.from({ length: leading }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {days.map((d) => {
          const available = isAvailable(d);
          const chosen = d === selected;
          const dayNum = Number(d.slice(8));
          return (
            <button
              key={d}
              type="button"
              data-date={d}
              disabled={!available}
              tabIndex={available && d === focusTarget ? 0 : -1}
              aria-pressed={chosen}
              aria-label={formatDay(d, locale)}
              onClick={() => onSelect(d)}
              className={`h-11 text-sm font-semibold transition-colors ${
                chosen
                  ? "bg-navy text-white"
                  : available
                    ? "border border-teal bg-teal-20 text-navy hover:bg-teal-40"
                    : "cursor-not-allowed text-ink-60 line-through"
              }`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-80">
        <li className="flex items-center gap-2">
          <span aria-hidden className="size-3.5 border border-teal bg-teal-20" />
          {copy.legend.available}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="size-3.5 bg-navy" />
          {copy.legend.chosen}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="text-ink-60 line-through">
            00
          </span>
          {copy.legend.unavailable}
        </li>
      </ul>
    </section>
  );
}
