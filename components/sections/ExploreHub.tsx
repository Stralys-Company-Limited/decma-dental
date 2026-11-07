import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";

/** Homepage signposts to the pages that hold the detail, so the homepage does not repeat them. */
export async function ExploreHub() {
  const locale = await getLocale();
  const dict = await getDictionary();
  const e = dict.home.explore;

  const cards: { href: string; icon: IconName; title: string; text: string }[] = [
    { href: "/what-to-expect", icon: "calendar", ...e.cards.visit },
    { href: "/oral-health-tips", icon: "tooth", ...e.cards.tips },
    { href: "/contact", icon: "pin", ...e.cards.visitUs },
    { href: "/referrals", icon: "mail", ...e.cards.referrals },
  ];

  return (
    <Section tone="mist" labelledBy="explore-title">
      <Eyebrow>{e.eyebrow}</Eyebrow>
      <h2 id="explore-title" className="mt-4 text-3xl font-bold sm:text-4xl">
        {e.title}
      </h2>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <li key={c.href} className="group relative flex flex-col bg-white p-6 transition-shadow hover:shadow-md">
            <Icon name={c.icon} className="size-7 text-teal-deep" />
            <h3 className="mt-5 text-lg font-bold">
              <Link href={localePath(locale, c.href)} className="after:absolute after:inset-0">
                {c.title}
              </Link>
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-80">{c.text}</p>
            <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy group-hover:text-teal-deep">
              {dict.common.learnMore}
              <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
