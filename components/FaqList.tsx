import { Icon } from "@/components/ui/Icon";

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy [&::-webkit-details-marker]:hidden">
            {item.q}
            <Icon name="chevronDown" className="size-5 shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-3 leading-relaxed text-ink-80">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
