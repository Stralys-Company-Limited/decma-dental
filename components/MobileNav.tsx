"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";

type NavLink = { href: string; label: string };

export function MobileNav({
  links,
  cta,
  openLabel,
  closeLabel,
  navLabel,
}: {
  links: NavLink[];
  cta: NavLink;
  openLabel: string;
  closeLabel: string;
  navLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="-mr-2 p-2 text-white"
      >
        <span className="sr-only">{open ? closeLabel : openLabel}</span>
        <Icon name={open ? "close" : "menu"} />
      </button>
      <nav
        id={panelId}
        aria-label={navLabel}
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 border-t border-white/15 bg-navy shadow-lg"
      >
        <ul className="container-page flex flex-col py-4">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-base font-semibold text-white hover:text-teal"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-3">
            <Link
              href={cta.href}
              onClick={() => setOpen(false)}
              className={buttonClass("white", "w-full")}
            >
              {cta.label}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
