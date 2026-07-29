import type { Metadata } from "next";
import { metadataFor, SITE_PAGES } from "@/lib/seo/registry";

export const metadata: Metadata = metadataFor(SITE_PAGES.login);

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
