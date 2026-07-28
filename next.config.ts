import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
