import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Icon } from "@/components/ui/Icon";

type CalendarCopy = Dictionary["booking"]["confirmed"]["calendars"];
type Links = { ics: string; google: string; outlook: string; office: string };

/** Brand logos are the official artwork (Wikimedia Commons), stored in public/brand/calendars. */
export function AddToCalendar({
  title,
  text,
  links,
  copy,
}: {
  title: string;
  text: string;
  links: Links;
  copy: CalendarCopy;
}) {
  const options: { key: string; href: string; logo: string | null; download: boolean; label: string; hint: string }[] = [
    { key: "apple", href: links.ics, logo: "/brand/calendars/apple.svg", download: true, ...copy.apple },
    { key: "google", href: links.google, logo: "/brand/calendars/google-calendar.svg", download: false, ...copy.google },
    { key: "outlook", href: links.outlook, logo: "/brand/calendars/outlook.svg", download: false, ...copy.outlook },
    { key: "office", href: links.office, logo: "/brand/calendars/microsoft-365.svg", download: false, ...copy.office },
    { key: "other", href: links.ics, logo: null, download: true, ...copy.other },
  ];

  return (
    <section aria-labelledby="calendar-title" className="border border-line bg-white p-6">
      <h2 id="calendar-title" className="flex items-center gap-2 text-xl font-bold">
        <Icon name="calendar" className="size-5 text-teal-deep" />
        {title}
      </h2>
      <p className="mt-2 text-sm text-ink-80">{text}</p>

      <ul className="mt-5 space-y-2">
        {options.map((o) => (
          <li key={o.key}>
            <a
              href={o.href}
              {...(o.download
                ? { download: "decma-appointment.ics" }
                : { target: "_blank", rel: "noopener noreferrer" })}
              className="group flex items-center gap-4 border border-line px-4 py-3 transition-colors hover:border-navy hover:bg-navy-20/50"
            >
              <span className="flex size-10 shrink-0 items-center justify-center border border-line bg-white">
                {o.logo ? (
                  <Image src={o.logo} alt="" width={24} height={24} unoptimized className="size-6 object-contain" />
                ) : (
                  <Icon name="calendar" className="size-6 text-navy" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-navy">{o.label}</span>
                <span className="block text-xs text-ink-60">{o.hint}</span>
              </span>
              <Icon
                name={o.download ? "download" : "arrowRight"}
                className="size-4 shrink-0 text-navy-60 transition-colors group-hover:text-navy"
                strokeWidth={2}
              />
              {!o.download && <span className="sr-only">(opens in a new tab)</span>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
