import Link from "next/link";

// Primary "Start your assessment" CTA treatment: a soft ambient blue glow
// that breathes behind the button and brightens on hover, instead of the
// magnetic mouse-follow effect used elsewhere. No client-side JS needed —
// pure CSS (see .bc-glow-pulse in globals.css) — so this can stay a plain
// server component, unlike MagneticLink.
export function GlowLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const glow = (
    <span
      aria-hidden
      className="bc-glow-pulse pointer-events-none absolute -inset-3 rounded-full bg-[#2563EB] opacity-40 blur-xl transition-opacity duration-500 ease-out group-hover:opacity-70"
    />
  );

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
