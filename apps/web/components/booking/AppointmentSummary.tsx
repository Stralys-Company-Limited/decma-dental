import type { ReactNode } from "react";

export type SummaryCopy = {
  title: string;
  day: string;
  time: string;
  where: string;
  length: string;
  lengthValue: string;
  changes: string;
};

export function AppointmentSummary({
  copy,
  day,
  time,
  where,
  action,
}: {
  copy: SummaryCopy;
  day: string;
  time: string;
  where: string;
  action?: ReactNode;
}) {
  return (
    <aside aria-labelledby="summary-title" className="bg-navy-20 p-6 sm:p-7">
      <h2 id="summary-title" className="text-xl font-bold">
        {copy.title}
      </h2>
      <dl className="mt-5 grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-3 text-sm" aria-live="polite">
        <dt className="font-bold text-navy">{copy.day}</dt>
        <dd className="text-ink-80">{day}</dd>
        <dt className="font-bold text-navy">{copy.time}</dt>
        <dd className="text-ink-80">{time}</dd>
        <dt className="font-bold text-navy">{copy.where}</dt>
        <dd className="text-ink-80">{where}</dd>
        <dt className="font-bold text-navy">{copy.length}</dt>
        <dd className="text-ink-80">{copy.lengthValue}</dd>
      </dl>
      {action && <div className="mt-6">{action}</div>}
      <p className="mt-5 text-xs leading-relaxed text-ink-80">{copy.changes}</p>
    </aside>
  );
}
