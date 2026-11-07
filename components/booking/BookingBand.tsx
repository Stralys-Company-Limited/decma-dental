import { Eyebrow } from "@/components/ui/Eyebrow";

export type BandCopy = {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  intro: string;
  steps: string[];
};

export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex flex-wrap gap-x-8 gap-y-3">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === current;
        const done = n < current;
        return (
          <li key={label} className="flex items-start gap-3" aria-current={active ? "step" : undefined}>
            <span
              className={`flex size-7 shrink-0 items-center justify-center text-xs font-bold ${
                active ? "bg-teal text-navy-deep" : done ? "bg-white text-navy" : "border border-white text-white"
              }`}
            >
              {n}
            </span>
            <span className={`max-w-24 pt-1 text-sm leading-tight ${active ? "font-semibold" : "text-white/85"}`}>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Mockup page 4 banner: title on the left, the three booking steps on the right. */
export function BookingBand({ copy, step }: { copy: BandCopy; step: number }) {
  return (
    <div className="border-b-4 border-teal bg-navy text-white">
      <div className="container-page flex flex-col gap-8 py-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow tone="white">{copy.eyebrow}</Eyebrow>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            {copy.titleLead} <span className="text-teal">{copy.titleAccent}</span>
          </h1>
          <p className="mt-3 text-sm text-white/90 sm:text-base">{copy.intro}</p>
        </div>
        <StepIndicator steps={copy.steps} current={step} />
      </div>
    </div>
  );
}
