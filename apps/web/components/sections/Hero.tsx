import Image from "next/image";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { site, telHref } from "@decma/booking/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";

export async function Hero() {
  const locale = await getLocale();
  const dict = await getDictionary();
  const h = dict.home;

  return (
    <section className="border-b-4 border-teal bg-navy text-white">
      <div className="container-page grid items-center gap-10 py-14 md:grid-cols-[1.25fr_1fr] md:py-16">
        <div>
          <Eyebrow tone="white">{h.eyebrow}</Eyebrow>
          <h1 className="mt-5 font-sans text-lg font-semibold text-white sm:text-xl">{h.h1}</h1>
          <p className="mt-2 font-display text-5xl leading-[1.02] font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {h.tagline.lead} <span className="block text-teal">{h.tagline.accent}</span>
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">{h.intro}</p>
          <p className="mt-5 text-sm font-semibold">{h.quickServices}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href={localePath(locale, "/book")} variant="primary">
              {dict.common.bookAppointment}
            </ButtonLink>
            <ButtonLink href={telHref() ?? localePath(locale, "/contact")} variant="outlineWhite">
              {dict.common.call(site.phone)}
            </ButtonLink>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[300px] md:max-w-[360px]">
          <Image
            src="/images/hero-tooth.webp"
            alt={h.heroImageAlt}
            width={777}
            height={1167}
            priority
            sizes="(min-width: 768px) 360px, 300px"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
