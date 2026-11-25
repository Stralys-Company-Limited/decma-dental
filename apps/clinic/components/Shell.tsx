import Link from "next/link";
import { signOut } from "@/lib/actions";

const links = [
  { href: "/", label: "Today" },
  { href: "/week", label: "Week" },
  { href: "/calendar", label: "Month" },
  { href: "/book", label: "Walk-in" },
  { href: "/hours", label: "Hours" },
  { href: "/inbox", label: "Inbox" },
];

export function Shell({
  staffName,
  children,
}: {
  staffName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-teal-deep uppercase">DECMA Dental Clinic</p>
            <p className="text-sm text-ink-80">Clinic desk · {staffName}</p>
          </div>
          <nav className="flex flex-wrap gap-1" aria-label="Clinic desk">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded px-3 py-1.5 text-sm font-semibold text-navy hover:bg-navy-20"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <form action={signOut}>
            <button type="submit" className="text-sm font-semibold text-navy underline underline-offset-4">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="container-page space-y-6 py-6">{children}</main>
    </div>
  );
}

export function Panel({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function btn(variant: "navy" | "outline" | "danger" = "navy", extra = "") {
  const base = "inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold";
  const styles = {
    navy: "bg-navy text-white hover:bg-navy-deep",
    outline: "border border-navy text-navy hover:bg-navy-20",
    danger: "border border-ink-60 text-ink-80 hover:bg-ink-20",
  };
  return `${base} ${styles[variant]} ${extra}`;
}
