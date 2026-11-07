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
import { site } from "@/lib/site";

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
