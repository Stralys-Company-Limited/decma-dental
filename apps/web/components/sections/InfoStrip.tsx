import { getDictionary } from "@/lib/i18n/server";
import { site } from "@decma/booking/site";

export async function InfoStrip() {
  const { home } = await getDictionary();
  const items = [
    { title: home.info.hoursTitle, text: home.info.hoursText(site.hours.weekdays, site.hours.saturday) },
    { title: home.info.whereTitle, text: home.info.whereText(site.address.street, site.address.landmark) },
    { title: home.info.paymentTitle, text: home.info.paymentText(site.insurers) },
  ];

  return (
    <section className="border-b border-line bg-white">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.title}>
            <span aria-hidden className="block h-0.5 w-6 bg-teal" />
            <h2 className="mt-3 text-base font-bold">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-80">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
