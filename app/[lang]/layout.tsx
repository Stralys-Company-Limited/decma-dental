import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { enabledLocales } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import "../globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#223f82",
};

export async function generateStaticParams() {
  return enabledLocales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <html lang={locale} className={openSans.variable} data-scroll-behavior="smooth">
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-navy"
        >
          {dict.a11y.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
