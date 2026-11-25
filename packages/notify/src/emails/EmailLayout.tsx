import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { site } from "@decma/booking";

/** Email images must be PNGs at a public URL; same default as scripts/resend-templates.mjs. */
const assetBase = (
  process.env.EMAIL_ASSET_BASE_URL ||
  "https://raw.githubusercontent.com/Stralys-Company-Limited/decma-dental/main/apps/web/public"
).replace(/\/$/, "");

type CalendarCopy = Record<"apple" | "google" | "outlook" | "office" | "other", { label: string; hint: string }>;

/** One full-width button per calendar, each with its own logo (Apple and other apps both use the .ics file). */
export function CalendarButtons({
  links,
  copy,
}: {
  links: { ics: string; google: string; outlook: string; office: string };
  copy: CalendarCopy;
}) {
  const rows = [
    { key: "google", href: links.google, icon: "google-calendar", arrow: "→" },
    { key: "apple", href: links.ics, icon: "apple", arrow: "↓" },
    { key: "outlook", href: links.outlook, icon: "outlook", arrow: "→" },
    { key: "office", href: links.office, icon: "microsoft-365", arrow: "→" },
    { key: "other", href: links.ics, icon: "calendar", arrow: "↓" },
  ] as const;
  return (
    <Section style={{ margin: "0 0 24px" }}>
      {rows.map((r) => (
        <table
          key={r.key}
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ margin: "0 0 8px", border: "1px solid #c9d0e0", background: "#ffffff" }}
        >
          <tbody>
            <tr>
              <td width={44} style={{ padding: "10px 0 10px 12px", verticalAlign: "middle" }}>
                <a href={r.href}>
                  <Img src={`${assetBase}/brand/calendars/${r.icon}.png`} width="28" height="28" alt="" />
                </a>
              </td>
              <td style={{ padding: "10px 12px", verticalAlign: "middle" }}>
                <a href={r.href} style={{ display: "block", textDecoration: "none" }}>
                  <span style={{ display: "block", fontSize: "14px", lineHeight: "20px", fontWeight: 700, color: colors.navy }}>
                    {copy[r.key].label}
                  </span>
                  <span style={{ display: "block", fontSize: "12px", lineHeight: "17px", color: "#6b6b69" }}>
                    {copy[r.key].hint}
                  </span>
                </a>
              </td>
              <td width={32} align="right" style={{ padding: "10px 14px 10px 0", verticalAlign: "middle" }}>
                <a href={r.href} style={{ fontSize: "16px", fontWeight: 700, color: colors.navy, textDecoration: "none" }}>
                  {r.arrow}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      ))}
    </Section>
  );
}

export const colors = {
  navy: "#223f82",
  navy20: "#d3d9e7",
  teal: "#00ada2",
  ink: "#1d1d1b",
  ink80: "#4a4a49",
};

export const textStyle = { fontSize: "15px", lineHeight: "24px", color: colors.ink80, margin: "0 0 16px" };

export function EmailLayout({
  lang,
  preview,
  children,
  footer,
}: {
  lang: string;
  preview: string;
  children: ReactNode;
  footer?: string;
}) {
  return (
    <Html lang={lang}>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: "#f4f6fa", fontFamily: "'Open Sans', Arial, sans-serif", margin: 0 }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#ffffff" }}>
          <Section style={{ backgroundColor: colors.navy, padding: "24px 32px", borderBottom: `4px solid ${colors.teal}` }}>
            <Img src={`${site.url}/brand/web/logo-white.png`} width="150" height="43" alt={site.name} />
          </Section>
          <Section style={{ padding: "32px" }}>{children}</Section>
          <Hr style={{ borderColor: colors.navy20, margin: 0 }} />
          <Section style={{ padding: "20px 32px" }}>
            {footer && <Text style={{ ...textStyle, fontSize: "12px", lineHeight: "18px" }}>{footer}</Text>}
            <Text style={{ fontSize: "12px", lineHeight: "18px", color: colors.ink80, margin: 0 }}>
              {site.name} · {site.address.street}, {site.address.area}, {site.address.city}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function DetailsTable({ rows }: { rows: [string, string][] }) {
  return (
    <Section style={{ backgroundColor: colors.navy20, padding: "16px 20px", margin: "8px 0 24px" }}>
      {rows.map(([label, value]) => (
        <Text key={label} style={{ margin: "4px 0", fontSize: "14px", lineHeight: "22px", color: colors.ink }}>
          <strong style={{ color: colors.navy, display: "inline-block", minWidth: "140px" }}>{label}</strong>
          {value}
        </Text>
      ))}
    </Section>
  );
}
