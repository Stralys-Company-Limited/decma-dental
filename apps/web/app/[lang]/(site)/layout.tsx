import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MascotPopper } from "@/components/mascot/MascotPopper";
import { getDictionary } from "@/lib/i18n/server";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const dict = await getDictionary();
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <MascotPopper tips={{ brush: dict.mascot.brush, polisher: dict.mascot.polisher }} closeLabel={dict.mascot.hide} />
    </>
  );
}
