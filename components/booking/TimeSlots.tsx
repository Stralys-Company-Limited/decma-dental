"use client";

import type { Slot } from "@/lib/booking/types";

export type TimeCopy = {
  chooseTime: string;
  notChosen: string;
  eat: string;
  pickDayFirst: string;
  noTimes: string;
  loadingTimes: string;
};

export function TimeSlots({
  copy,
  date,
  slots,
  loading,
  selected,
  onSelect,
}: {
  copy: TimeCopy;
  date: string | null;
  slots: Slot[] | null;
  loading: boolean;
  selected: Slot | null;
  onSelect: (slot: Slot) => void;
}) {
  let body;
  if (!date) body = <p className="bg-navy-20 px-4 py-4 text-sm font-semibold text-navy">{copy.pickDayFirst}</p>;
  else if (loading || !slots) body = <p className="bg-navy-20 px-4 py-4 text-sm text-navy">{copy.loadingTimes}</p>;
  else if (slots.length === 0) body = <p className="bg-navy-20 px-4 py-4 text-sm font-semibold text-navy">{copy.noTimes}</p>;
  else
    body = (
      <div role="group" aria-labelledby="choose-time" className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {slots.map((s) => {
          const chosen = selected?.startsAt === s.startsAt;
          return (
            <button
              key={s.startsAt}
              type="button"
              aria-pressed={chosen}
              onClick={() => onSelect(s)}
              className={`h-11 text-sm font-semibold transition-colors ${
                chosen ? "bg-navy text-white" : "border border-teal bg-teal-20 text-navy hover:bg-teal-40"
              }`}
            >
              {s.time}
            </button>
          );
        })}
      </div>
    );

  return (
    <section aria-labelledby="choose-time" className="border border-line bg-white p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="choose-time" className="text-xl font-bold">
          {copy.chooseTime}
        </h2>
        <p className="text-sm text-ink-80" aria-live="polite">
          {selected ? selected.time : copy.notChosen} · {copy.eat}
        </p>
      </div>
      {body}
    </section>
  );
}
