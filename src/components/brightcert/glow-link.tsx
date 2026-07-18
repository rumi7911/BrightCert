import Link from "next/link";

// Primary "Start your assessment" CTA treatment, styled after the Framer
// community "Premium Glow Button": a glassmorphic pill (see BTN_GLOW in
// signal-primitives.tsx) with an infinite, fluid, rotating conic-gradient
// halo behind it (.bc-glow-ring in globals.css) that brightens on hover.
// Pure CSS — no JS — so this stays a plain server component, unlike
// MagneticLink, which it replaces for this one CTA.
export function GlowLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const glow = <span aria-hidden className="bc-glow-ring" />;

  if (href.startsWith("#")) {
    return (
      <span className="group relative inline-flex">
        {glow}
        <a href={href} className={`relative ${className}`}>
          {children}
        </a>
      </span>
    );
  }

  return (
    <span className="group relative inline-flex">
      {glow}
      <Link href={href} className={`relative ${className}`}>
        {children}
      </Link>
    </span>
  );
}
