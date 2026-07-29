import type { MetadataRoute } from "next";
import { absoluteUrl, SEO_PAGES } from "@/lib/seo/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  return SEO_PAGES.filter((page) => page.indexable).map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: page.lastModified,
  }));
}
