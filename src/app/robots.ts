import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://aipickkit.com/sitemap.xml",
    host: "https://aipickkit.com",
  };
}
