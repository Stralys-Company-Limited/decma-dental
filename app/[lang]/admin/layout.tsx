import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: { absolute: "Booking admin | DECMA Dental Clinic" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="border-b-4 border-teal bg-navy text-white">
        <div className="container-page flex h-16 items-center justify-between">
          <Logo tone="white" href="/admin" width={120} />
          <p className="text-sm font-semibold">Booking admin</p>
        </div>
      </header>
      <main id="main" className="flex-1 bg-navy-20/40">
        {children}
      </main>
    </>
  );
}
