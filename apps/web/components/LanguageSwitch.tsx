"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useSyncExternalStore } from "react";
import { hreflang, localePath, stripLocale, type Locale } from "@/lib/i18n/config";

type Props = { target: Locale; label: string; shortLabel: string };

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

const readLocation = () => window.location.pathname + window.location.search;

function LanguageLink({ target, label, shortLabel, href }: Props & { href: string }) {
  return (
    <Link
      href={href}
      hrefLang={hreflang[target]}
      lang={target}
      aria-label={label}
      title={label}
      className="inline-flex h-9 min-w-11 items-center justify-center border border-white/70 px-2.5 text-xs font-bold tracking-[0.1em] text-white transition-colors hover:border-teal hover:bg-teal hover:text-navy-deep"
    >
      {shortLabel}
    </Link>
  );
}

function CurrentPageLanguageLink(props: Props) {
  // Re-render on client-side navigations, which do not fire popstate.
  usePathname();
  const location = useSyncExternalStore(subscribe, readLocation, () => null);

  let href = localePath(props.target, "/");
  if (location) {
    const [path, search = ""] = location.split("?");
    href = localePath(props.target, stripLocale(path)) + (search ? `?${search}` : "");
  }
  return <LanguageLink {...props} href={href} />;
}

/**
 * Links to the same page in the other language. Pages are prerendered and reached through a proxy
 * rewrite, so the browser URL is only read on the client; until then it links to that language's home page.
 */
export function LanguageSwitch(props: Props) {
  return (
    <Suspense fallback={<LanguageLink {...props} href={localePath(props.target, "/")} />}>
      <CurrentPageLanguageLink {...props} />
    </Suspense>
  );
}
