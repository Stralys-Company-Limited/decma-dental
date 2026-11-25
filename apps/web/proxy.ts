import { NextResponse, type NextRequest } from "next/server";
import { enabledLocales } from "@/lib/i18n/config";

const swahiliEnabled = enabledLocales.includes("sw");

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/sw" || pathname.startsWith("/sw/")) {
    if (swahiliEnabled) return NextResponse.next();
    // Swahili is switched off for now: send visitors to the English page (temporary, so it can come back).
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 307);
  }

  // English is served without a prefix; /en/... is a duplicate, so send it to the canonical URL.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
