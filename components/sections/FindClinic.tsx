import type { ReactNode } from "react";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { directionsUrl, isPlaceholder, mailHref, mapsUrl, site, telHref } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CallbackForm } from "@/components/forms/CallbackForm";

function Value({ href, children }: { href?: string; children: string }) {
  return href ? (
    <a href={href} className="text-navy underline underline-offset-4 hover:text-teal-deep">
      {children}
    </a>
  ) : (
    <span>{children}</span>
  );
}

/** Mockup page 3: contact details, map and call-back form. */
export async function FindClinic({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const locale = await getLocale();
  const dict = await getDictionary();
  const v = dict.visitUs;
  const Heading = headingLevel;
  const { address } = site;

  const rows: [string, ReactNode][] = [
    [
      v.labels.address,
      <>
        {address.street}, {address.area}
        <br />
        {address.city}, {address.country}
      </>,
    ],
    [
      v.labels.plusCode,
      <a
        key="pc"
        href={mapsUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-navy underline underline-offset-4 hover:text-teal-deep"
      >
        {address.plusCode}
      </a>,
    ],
    [v.labels.landmark, address.landmark],
    [v.labels.phone, <Value key="p" href={telHref()}>{site.phone}</Value>],
    [v.labels.email, <Value key="e" href={mailHref()}>{site.email}</Value>],
    [v.labels.monFri, site.hours.weekdays],
    [v.labels.saturday, site.hours.saturday],
    [v.labels.sunday, site.hours.sunday],
  ];

  return (
    <section aria-labelledby="find-title" className="bg-white">
      <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-2">
        <div>
          <Eyebrow>{v.eyebrow}</Eyebrow>
          <Heading id="find-title" className="mt-4 text-3xl font-bold sm:text-4xl">
            {headingLevel === "h1" ? v.h1 : v.title}
          </Heading>
          <dl className="mt-8 grid grid-cols-[7rem_1fr] gap-x-6 gap-y-3 text-sm">
            {rows.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="font-bold text-navy">{label}</dt>
                <dd className="text-ink-80">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 border-l-4 border-teal bg-teal-20 px-4 py-3 text-sm font-semibold text-navy-deep">
            {v.walkIns}
          </p>

          <div className="mt-8 aspect-[16/9] w-full border border-navy-40 bg-teal-20 lg:aspect-[4/3]">
            {site.mapEmbedUrl ? (
              <iframe
                src={site.mapEmbedUrl}
                title={v.mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy">{v.mapPlaceholder}</p>
                {!isPlaceholder(address.landmark) && <p className="text-sm text-ink-80">{address.landmark}</p>}
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonLink href={directionsUrl()} variant="navy" target="_blank" rel="noopener noreferrer">
              <Icon name="pin" className="size-4" strokeWidth={2} />
              {v.directions}
            </ButtonLink>
            <ButtonLink href={mapsUrl()} variant="outlineNavy" target="_blank" rel="noopener noreferrer">
              {v.openInMaps}
            </ButtonLink>
          </div>

          <div className="mt-8 border-l-4 border-teal pl-4 text-xs leading-relaxed text-ink-80">
            <p className="font-bold text-navy">{v.registrationsTitle}</p>
            <p className="mt-1">{v.facilityReg(site.facilityRegNo)}</p>
          </div>
        </div>

        <div className="lg:pt-2">
          <CallbackForm
            locale={locale}
            copy={dict.callback}
            types={dict.appointmentTypes}
            sending={dict.forms.sending}
            bookHref={localePath(locale, "/book")}
            privacyHref={localePath(locale, "/privacy")}
          />
        </div>
      </div>
    </section>
  );
}
