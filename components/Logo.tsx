import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

const sources = {
  navy: "/brand/web/logo-navy.png",
  white: "/brand/web/logo-white.png",
} as const;

/** Horizontal primary logo. Source files: public/brand/Primary Logo. Aspect ratio 1200 x 347. */
export function Logo({
  tone = "white",
  href,
  width = 150,
  priority = false,
}: {
  tone?: keyof typeof sources;
  href?: string;
  width?: number;
  priority?: boolean;
}) {
  const img = (
    <Image
      src={sources[tone]}
      alt={site.name}
      width={width}
      height={Math.round((width * 347) / 1200)}
      priority={priority}
    />
  );
  if (!href) return img;
  return (
    <Link href={href} className="inline-block shrink-0" aria-label={site.name}>
      {img}
    </Link>
  );
}
