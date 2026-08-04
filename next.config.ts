import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The report PDF registers its typefaces from `public/fonts` at render time
  // (src/lib/pdf/report/brand-tokens.ts), reading them off disk via a path
  // built from `process.cwd()`. File tracing cannot follow a runtime path like
  // that, so the files are only present in the function because Next currently
  // traces all of `public/` into it by default — verified on Next 16.2.12 by
  // building without this entry and finding all six fonts still traced.
  //
  // This entry is therefore belt-and-braces, not load-bearing today. It is kept
  // because the failure it guards against is silent at build time and total at
  // runtime: if that default ever narrows, every paid PDF render fails with
  // ENOENT and no test would catch it first. Keep in step with brand-tokens.ts.
  outputFileTracingIncludes: {
    "/api/reports/generate": [
      "./public/fonts/**/*",
      // Same reasoning as the fonts: BrandHeader.tsx reads this off disk via a
      // runtime `process.cwd()` path that tracing cannot follow.
      "./public/logo-mark-report.png",
    ],
  },
  async redirects() {
    return [
      {
        source: "/index",
        has: [{ type: "host", value: "www.brightcert.co.uk" }],
        destination: "https://brightcert.co.uk/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.brightcert.co.uk" }],
        destination: "https://brightcert.co.uk/:path*",
        permanent: true,
      },
      {
        source: "/index",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
