import type { MetadataRoute } from "next";

const BASE = "https://brightcert.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/pricing`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/how-it-works`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/faq`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/blog/cyber-essentials-cost`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog/iasme-tool-vs-brightcert`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog/ce-vs-ce-plus`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
