import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function BookingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header variant="booking" />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer variant="compact" />
    </>
  );
}
