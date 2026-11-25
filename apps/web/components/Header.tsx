import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { enabledLocales, localePath } from "@/lib/i18n/config";
import { site, telHref } from "@decma/booking/site";
import { Logo } from "@/components/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { MobileNav } from "@/components/MobileNav";

/** "site" matches mockup page 1; "booking" matches the booking page (Home link, call button). */
export async function Header({ variant = "site" }: { variant?: "site" | "booking" }) {
  const locale = await getLocale();
  const dict = await getDictionary();
  const p = (path: string) => localePath(locale, path);
  const other = enabledLocales.find((l) => l !== locale);

  const links =
    variant === "booking"
      ? [
          { href: p("/"), label: dict.nav.home },
          { href: p("/services"), label: dict.nav.services },
          { href: p("/oral-health-tips"), label: dict.nav.tips },
          { href: p("/contact"), label: dict.nav.visitUs },
        ]
      : [
          { href: p("/"), label: dict.nav.home },
          { href: p("/services"), label: dict.nav.services },
          { href: p("/what-to-expect"), label: dict.nav.yourVisit },
          { href: p("/oral-health-tips"), label: dict.nav.tips },
          { href: p("/contact"), label: dict.nav.visitUs },
        ];

  const cta =
    variant === "booking"
      ? { href: telHref() ?? p("/contact"), label: dict.common.call(site.phone) }
      : { href: p("/book"), label: dict.nav.book };

  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-navy text-white">
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Logo tone="white" href={p("/")} width={140} priority />

        <nav aria-label={dict.a11y.primaryNav} className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm font-semibold hover:text-teal">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          {other && (
            <LanguageSwitch
              target={other}
              label={dict.language.switchTo}
              shortLabel={dict.language.switchToShort}
            />
          )}
          <div className="hidden sm:block">
            <ButtonLink href={cta.href} variant="white">
              {cta.label}
            </ButtonLink>
          </div>
          <MobileNav
            links={links}
            cta={cta}
            openLabel={dict.a11y.openMenu}
            closeLabel={dict.a11y.closeMenu}
            navLabel={dict.a11y.primaryNav}
          />
        </div>
      </div>
    </header>
  );
}
