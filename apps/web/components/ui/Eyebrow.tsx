import type { ReactNode } from "react";

export function Eyebrow({
  children,
  tone = "navy",
  as: Tag = "p",
  className = "",
}: {
  children: ReactNode;
  tone?: "navy" | "white" | "deep";
  as?: "p" | "span" | "div";
  className?: string;
}) {
  const color = tone === "white" ? "text-white" : tone === "deep" ? "text-navy-deep" : "text-navy";
  return (
    <Tag
      className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] ${color} ${className}`}
    >
      <span aria-hidden className={`h-0.5 w-6 ${tone === "deep" ? "bg-navy-deep" : "bg-teal"}`} />
      {children}
    </Tag>
  );
}
