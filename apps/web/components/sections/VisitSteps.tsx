import { getDictionary } from "@/lib/i18n/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

/** One icon per step, in the order of dictionary `visit.steps`. */
const stepIcons: IconName[] = ["calendar", "search", "document", "tooth"];

export async function VisitSteps({ showHeading = true }: { showHeading?: boolean }) {
  const { visit } = await getDictionary();

  return (
    <Section tone="mist" id="what-to-expect" labelledBy={showHeading ? "visit-title" : undefined}>
      {showHeading && (
        <>
          <Eyebrow>{visit.eyebrow}</Eyebrow>
          <h2 id="visit-title" className="mt-4 text-3xl font-bold sm:text-4xl">
            {visit.title}
          </h2>
        </>
      )}
      <ol className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${showHeading ? "mt-10" : ""}`}>
        {visit.steps.map((step, i) => (
          <li key={step.title} className="flex flex-col bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="flex size-12 items-center justify-center bg-teal-20 text-teal-deep">
                <Icon name={stepIcons[i] ?? "tooth"} className="size-6" />
              </span>
              <span aria-hidden className="font-display text-3xl font-bold text-navy-40">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-5 text-lg leading-snug font-bold text-navy">{step.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-80">{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
