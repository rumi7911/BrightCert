import type { MetadataRoute } from "next";

// App routes and APIs are noindex territory; marketing pages are open to all
// crawlers, explicitly including the AI search/citation bots (blocking them
// means ChatGPT/Perplexity/Claude/Gemini cannot cite BrightCert).
const DISALLOW = ["/api/", "/dashboard", "/assessment/", "/settings", "/auth/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: "GPTBot", allow: "/", disallow: DISALLOW },
      { userAgent: "ChatGPT-User", allow: "/", disallow: DISALLOW },
      { userAgent: "PerplexityBot", allow: "/", disallow: DISALLOW },
      { userAgent: "ClaudeBot", allow: "/", disallow: DISALLOW },
      { userAgent: "anthropic-ai", allow: "/", disallow: DISALLOW },
      { userAgent: "Google-Extended", allow: "/", disallow: DISALLOW },
      { userAgent: "Bingbot", allow: "/", disallow: DISALLOW },
    ],
    sitemap: "https://brightcert.co.uk/sitemap.xml",
  };
}
