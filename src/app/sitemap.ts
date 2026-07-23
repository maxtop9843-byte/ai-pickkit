import type { MetadataRoute } from "next";
import { catalogModels } from "@/lib/model-catalog";
import { providerSlugs } from "@/lib/model-guides";
import { toolRoutes } from "@/lib/tool-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-23");
  return [
    {
      url: "https://aipickkit.com",
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...toolRoutes.map((route) => ({
      url: `https://aipickkit.com${route.href}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...catalogModels.map((model) => ({
      url: `https://aipickkit.com/models/${model.id}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...Object.values(providerSlugs).map((provider) => ({
      url: `https://aipickkit.com/providers/${provider}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
