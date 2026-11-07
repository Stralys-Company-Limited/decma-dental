import Link from "next/link";
import type { ReactNode } from "react";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { mailHref, site, telHref } from "@/lib/site";
import { Logo } from "@/components/Logo";

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white">
      {children}
    </h2>
  );
}

const linkCls = "text-sm text-white underline underline-offset-4 decoration-white/40 hover:text-teal hover:decoration-teal";

function MaybeLink({ href, children }: { href?: string; children: ReactNode }) {
  return href ? (
    <a href={href} className={linkCls}>
      {children}
    </a>
  ) : (
    <span className="text-sm">{children}</span>
  );
}

/** "full" matches mockup page 3; "compact" is the single-line booking footer. */
export async function Footer({ variant = "full" }: { variant?: "full" | "compact" }) {
  const locale = await getLocale();
  const dict = await getDictionary();
  const p = (path: string) => localePath(locale, path);
  const f = dict.footer;

  const legal = (
    <ul className="flex gap-6">
      <li>
        <Link href={p("/privacy")} className={linkCls}>
          {f.privacy}
        </Link>
      </li>
      <li>
        <Link href={p("/terms")} className={linkCls}>
          {f.terms}
        </Link>
      </li>
    </ul>
  );

  if (variant === "compact") {
    return (
      <footer className="mt-auto bg-navy text-white">
        <div className="container-page flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.copyrightYear} {site.name} · {dict.visitUs.facilityReg(site.facilityRegNo)}
          </p>
          {legal}
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto">
      <div aria-hidden className="pattern-strip h-20" />
      <div className="bg-navy text-white">
        <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo tone="white" href={p("/")} width={160} />
            <p className="mt-5 max-w-xs text-sm text-white/90">{f.tagline}</p>
          </div>
          <nav aria-label={f.clinic}>
            <FooterHeading>{f.clinic}</FooterHeading>
            <ul className="space-y-2.5">
              <li><Link className={linkCls} href={p("/what-to-expect")}>{dict.nav.yourVisit}</Link></li>
              <li><Link className={linkCls} href={p("/oral-health-tips")}>{dict.nav.tips}</Link></li>
              <li><Link className={linkCls} href={p("/referrals")}>{dict.nav.referrals}</Link></li>
              <li><Link className={linkCls} href={p("/book/check")}>{f.checkAppointment}</Link></li>
            </ul>
          </nav>
          <nav aria-label={f.services}>
            <FooterHeading>{f.services}</FooterHeading>
            <ul className="space-y-2.5">
              <li><Link className={linkCls} href={p("/services/check-ups-cleaning")}>{f.generalCare}</Link></li>
              <li><Link className={linkCls} href={p("/services/cosmetic-dentistry")}>{f.cosmetic}</Link></li>
              <li><Link className={linkCls} href={p("/services/orthodontics")}>{f.orthodontics}</Link></li>
              <li><Link className={linkCls} href={p("/services/implants")}>{f.implants}</Link></li>
            </ul>
          </nav>
          <div>
            <FooterHeading>{f.contact}</FooterHeading>
            <ul className="space-y-2.5">
              <li><MaybeLink href={telHref()}>{site.phone}</MaybeLink></li>
              <li><MaybeLink href={mailHref()}>{site.email}</MaybeLink></li>
              <li className="text-sm">{site.address.street}, {site.address.area}</li>
            </ul>
          </div>
        </div>
        <div className="container-page">
          <div className="flex flex-col gap-4 border-t border-teal py-6 text-xs text-white/90 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p>{f.registrations(site.facilityRegNo)}</p>
              <p>{f.copyright(site.copyrightYear, site.name)}</p>
            </div>
            {legal}
          </div>
        </div>
      </div>
    </footer>
  );
}
