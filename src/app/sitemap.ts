import type { MetadataRoute } from "next";

const BASE = "https://brightcert.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, lastModified: "2026-07-28", changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/pricing`, lastModified: "2026-07-26", changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/how-it-works`, lastModified: "2026-07-22", changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/faq`, lastModified: "2026-07-26", changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: "2026-07-22", changeFrequency: "weekly", priority: 0.7 },
    {
      url: `${BASE}/blog/what-is-cyber-essentials`,
      lastModified: "2026-07-26",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/blog/cyber-essentials-cost`,
      lastModified: "2026-07-26",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/blog/iasme-tool-vs-brightcert`,
      lastModified: "2026-07-26",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/blog/ce-vs-ce-plus`,
      lastModified: "2026-07-26",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${BASE}/privacy`, lastModified: "2026-07-25", changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, lastModified: "2026-07-18", changeFrequency: "yearly", priority: 0.2 },
  ];
}
