import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

export const buttonVariants = {
  primary: "bg-teal text-navy-deep hover:bg-teal-80",
  navy: "bg-navy text-white hover:bg-navy-80",
  white: "bg-white text-navy hover:bg-navy-20",
  outlineWhite: "border border-white text-white hover:bg-white hover:text-navy",
  outlineNavy: "border border-navy text-navy hover:bg-navy hover:text-white",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

export function buttonClass(variant: ButtonVariant = "primary", className = "") {
  return `${base} ${buttonVariants[variant]} ${className}`.trim();
}

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

/** Renders an internal link, an external/tel/mailto link, or plain text when there is no href. */
export function ButtonLink({ href, variant = "primary", className, children, ...rest }: ButtonLinkProps) {
  const cls = buttonClass(variant, className);
  if (/^(tel:|mailto:|https?:)/.test(href)) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  ...rest
}: { variant?: ButtonVariant } & ComponentProps<"button">) {
  return <button className={buttonClass(variant, className)} {...rest} />;
}
