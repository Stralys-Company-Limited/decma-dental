import type { ReactNode } from "react";

const tones = {
  white: "bg-white",
  mist: "bg-navy-20",
  teal: "bg-teal",
  navy: "bg-navy text-white",
} as const;

export function Section({
  children,
  tone = "white",
  id,
  className = "",
  innerClassName = "",
  labelledBy,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  id?: string;
  className?: string;
  innerClassName?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${tones[tone]} ${className}`}>
      <div className={`container-page py-16 sm:py-20 ${innerClassName}`}>{children}</div>
    </section>
  );
}
