import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Дата последнего реального изменения контента — обновлять руками при правках.
// new Date() здесь нельзя: «всегда свежий» lastmod поисковики игнорируют.
const LAST_MODIFIED = "2026-07-15";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE.url}/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE.url}/privacy`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
