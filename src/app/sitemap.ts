import type { MetadataRoute } from "next";
import { landingPages } from "@/lib/landing/pages";

const SITE_URL = "https://coralum.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/waitlist`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...landingPages.map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
