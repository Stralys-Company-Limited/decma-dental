import type { MetadataRoute } from "next";
import { site } from "@decma/booking/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/sw/admin", "/book/manage", "/sw/book/manage", "/book/confirmed", "/sw/book/confirmed", "/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
