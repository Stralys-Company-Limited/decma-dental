import { Eyebrow } from "@/components/ui/Eyebrow";

/** Navy page banner with the hero's turquoise stripe, used on inner pages. */
export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <div className="border-b-4 border-teal bg-navy text-white">
      <div className="container-page py-12 sm:py-14">
        {eyebrow && <Eyebrow tone="white">{eyebrow}</Eyebrow>}
        <h1 className="mt-4 max-w-3xl text-4xl font-bold text-white sm:text-5xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">{intro}</p>}
      </div>
    </div>
  );
}
