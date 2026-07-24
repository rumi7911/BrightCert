"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import {
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PieChart,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/brightcert/logo";
import { cn } from "@/lib/utils";

const COLLAPSE_KEY = "bc_sidebar_collapsed";

export type SidebarLatest = {
  id: string;
  score: number | null;
  scoreColor: string;
  verdict: string;
  p1Count: number;
  resultsReady: boolean;
  cta: { title: string; body: string; label: string; href: string; external?: boolean } | null;
};

type Props = {
  orgName: string | null;
  email: string | null;
  latest: SidebarLatest | null;
};

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  trailing?: { text: string; hot?: boolean };
};

function getInitials(name: string | null) {
  if (!name) return "BC";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// B-style item: quiet row, 2px emerald edge + soft wash when active,
// muted tabular trailing values instead of badges.
function RailItem({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "bc-focus-light relative flex items-center gap-2.5 border-l-2 py-[7px] text-[13px] transition-colors",
        collapsed ? "md:w-11 md:justify-center md:rounded-[8px] md:px-0" : "rounded-r-[8px] pl-3 pr-2.5",
        active
          ? "border-[#34D399] bg-gradient-to-r from-[#34D399]/[0.22] to-[#34D399]/[0.04] font-bold text-white"
          : "border-transparent font-medium text-[#E4EAF4] hover:bg-white/[0.08] hover:text-white"
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-[#6EE7B7]" : "text-[#AAB8D4]")} strokeWidth={1.5} />
      <span className={cn("truncate", collapsed && "md:hidden")}>{item.label}</span>
      {item.trailing && (
        <span
          className={cn(
            "ml-auto text-[11px] tabular-nums",
            collapsed && "md:hidden",
            item.trailing.hot ? "font-extrabold text-[#F87171]" : "text-[#AAB8D4]"
          )}
        >
          {item.trailing.text}
        </span>
      )}
      {collapsed && item.trailing?.hot && (
        <span
          className="absolute right-1 top-1 hidden h-[7px] w-[7px] rounded-full border-[1.5px] border-[#0F2044] bg-[#F87171] md:block"
          aria-hidden
        />
      )}
    </Link>
  );
}

// C-style score ring, sized for both rail states
function ScoreRing({
  score,
  color,
  size,
}: {
  score: number;
  color: string;
  size: "md" | "sm";
}) {
  const outer = size === "md" ? 44 : 34;
  const inner = size === "md" ? 33 : 25;
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full"
      style={{
        width: outer,
        height: outer,
        background: `conic-gradient(${color} 0 ${Math.min(Math.max(score, 0), 100)}%, rgba(255,255,255,0.16) ${Math.min(Math.max(score, 0), 100)}% 100%)`,
      }}
      aria-hidden
    >
      <span
        className={cn(
          "grid place-items-center rounded-full bg-white font-extrabold text-[#0F2044] tabular-nums",
          size === "md" ? "text-[11px]" : "text-[8.5px]"
        )}
        style={{ width: inner, height: inner }}
      >
        {score}
        {size === "md" && "%"}
      </span>
    </span>
  );
}

export function AppSidebar({ orgName, email, latest }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = (email?.slice(0, 2) ?? "??").toUpperCase();
  const orgInitials = getInitials(orgName);
  const cta = latest?.cta ?? null;
  const isCheckoutCta = cta?.href.startsWith("/api/stripe/checkout") ?? false;

  // Restore the saved rail state after mount (SSR always renders expanded)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage read on mount
    if (localStorage.getItem(COLLAPSE_KEY) === "1") setCollapsed(true);
  }, []);

  // Keyboard shortcut: [ toggles the rail (ignored while typing)
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
        return;
      }
      if (event.key !== "[" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      setCollapsed((value) => {
        localStorage.setItem(COLLAPSE_KEY, value ? "0" : "1");
        return !value;
      });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function toggleCollapsed() {
    setCollapsed((value) => {
      localStorage.setItem(COLLAPSE_KEY, value ? "0" : "1");
      return !value;
    });
  }

  const workspaceItems: NavItem[] = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      trailing: latest && latest.p1Count > 0 ? { text: String(latest.p1Count), hot: true } : undefined,
    },
    { href: "/assessment/new", icon: ClipboardList, label: "New Assessment" },
    ...(latest?.resultsReady
      ? [{
          href: `/assessment/${latest.id}/results`,
          icon: PieChart,
          label: "Latest results",
          trailing: latest.score != null ? { text: `${latest.score}%` } : undefined,
        } satisfies NavItem]
      : []),
  ];

  const accountItems: NavItem[] = [
    { href: "/settings", icon: Settings, label: "Settings" },
    { href: "/how-it-works", icon: HelpCircle, label: "How it works" },
  ];

  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;
  const toggleButton = (
    <button
      type="button"
      onClick={toggleCollapsed}
      title={collapsed ? "Expand sidebar  [" : "Collapse sidebar  ["}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={cn(
        "bc-focus-light hidden h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-[6px] text-[#AAB8D4] transition-colors hover:bg-white/10 hover:text-white md:grid",
        !collapsed && "md:ml-auto"
      )}
    >
      <ToggleIcon className="h-4 w-4" strokeWidth={1.5} />
    </button>
  );

  const sidebarBody = (
    <div
      className={cn(
        "relative flex h-full flex-col py-4",
        collapsed ? "px-3 md:items-center md:px-2.5" : "px-3"
      )}
    >
      {/* Org identity + toggle */}
      <div className={cn("mb-3 flex items-center gap-2.5 rounded-[10px] px-2 py-1.5", collapsed && "md:justify-center md:px-0")}>
        <Link
          href="/dashboard"
          title={collapsed ? (orgName ?? "Dashboard") : undefined}
          onClick={() => setMobileOpen(false)}
          className={cn("bc-focus-light flex min-w-0 items-center gap-2.5 rounded-[8px]", collapsed && "md:hidden lg:hidden")}
        >
          <LogoMark className="h-8 w-8 shrink-0" light />
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold leading-tight text-white">BrightCert</span>
          </span>
        </Link>
        <Link
          href="/dashboard"
          title={orgName ?? "Dashboard"}
          className={cn("bc-focus-light hidden rounded-[8px]", collapsed && "md:block")}
        >
          <LogoMark className="h-8 w-8" light />
        </Link>
        {!collapsed && toggleButton}
        {collapsed && <span className="hidden md:contents">{toggleButton}</span>}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          className="bc-focus-light ml-auto grid h-8 w-8 place-items-center rounded-[8px] text-[#AAB8D4] hover:bg-white/10 hover:text-white md:hidden"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Workspace identity card */}
      {!collapsed && (
        <div className="mb-3 flex items-center gap-2.5 rounded-[14px] border border-white/10 bg-white/[0.05] px-3 py-2.5 transition-colors hover:bg-white/[0.08]">
          <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[10px] bg-[#6EE7B7] font-mono text-[12.5px] font-bold tracking-[0.02em] text-[#0F2044]">
            {orgInitials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-[13.5px] font-semibold tracking-[-0.01em] text-white">
              {orgName ?? "Your organisation"}
            </span>
            <span className="block truncate text-[11px] text-[#AAB8D4]">Cyber Essentials readiness</span>
          </span>
        </div>
      )}

      {/* C: score ring card */}
      {latest && latest.score != null && (
        collapsed ? (
          <Link
            href={`/assessment/${latest.id}/results`}
            title={`${latest.verdict} · ${latest.score}%`}
            onClick={() => setMobileOpen(false)}
            className="mb-3 flex items-center gap-3 rounded-[12px] border border-[#6EE7B7]/[0.18] bg-[#6EE7B7]/[0.07] p-3 md:justify-center md:border-0 md:bg-transparent md:p-0"
          >
            <span className="md:hidden">
              <ScoreRing score={latest.score} color={latest.scoreColor} size="md" />
            </span>
            <span className="hidden md:inline-flex">
              <ScoreRing score={latest.score} color={latest.scoreColor} size="sm" />
            </span>
            <span className="min-w-0 md:hidden">
              <span className="block truncate text-xs font-bold leading-tight text-white">{latest.verdict}</span>
              <span className="block text-[10.5px] font-semibold text-[#FCA5A5]">
                {latest.p1Count > 0 ? `${latest.p1Count} ${latest.p1Count === 1 ? "issue" : "issues"} to fix` : ""}
                {latest.p1Count === 0 && <span className="text-[#6EE7B7]">No critical issues</span>}
              </span>
            </span>
          </Link>
        ) : (
          <Link
            href={`/assessment/${latest.id}/results`}
            onClick={() => setMobileOpen(false)}
            className="bc-focus-light mb-3 flex items-center gap-3 rounded-[12px] border border-[#6EE7B7]/[0.18] bg-[#6EE7B7]/[0.07] p-3 transition-colors hover:border-[#6EE7B7]/35"
          >
            <ScoreRing score={latest.score} color={latest.scoreColor} size="md" />
            <span className="min-w-0">
              <span className="block truncate text-xs font-bold leading-tight text-white">
                {latest.verdict}
              </span>
              <span className="block text-[10.5px] font-semibold text-[#FCA5A5]">
                {latest.p1Count > 0
                  ? `${latest.p1Count} ${latest.p1Count === 1 ? "issue" : "issues"} to fix`
                  : ""}
                {latest.p1Count === 0 && (
                  <span className="text-[#6EE7B7]">No critical issues</span>
                )}
              </span>
            </span>
          </Link>
        )
      )}

      {!collapsed && (
        <p className="mb-1.5 mt-2 px-3 text-[10px] font-semibold uppercase tracking-[0.09em] font-bold text-[#8DA0C4]">
          Workspace
        </p>
      )}
      <nav className={cn("space-y-1", collapsed && "mt-1 space-y-1.5")}>
        {workspaceItems.map((item) => (
          <RailItem
            key={item.href}
            item={item}
            active={pathname === item.href}
            collapsed={collapsed}
            onNavigate={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      {!collapsed && (
        <p className="mb-1.5 mt-4 px-3 text-[10px] font-semibold uppercase tracking-[0.09em] font-bold text-[#8DA0C4]">
          Account
        </p>
      )}
      <nav className={cn("space-y-1", collapsed && "mt-1.5 space-y-1.5")}>
        {accountItems.map((item) => (
          <RailItem
            key={item.href}
            item={item}
            active={pathname === item.href}
            collapsed={collapsed}
            onNavigate={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      {/* C: state-aware report CTA */}
      {cta && (
        collapsed ? (
          cta.external ? (
            <a
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              title={`${cta.title} — ${cta.label}`}
              className="bc-focus-light mt-3 grid h-10 w-10 place-items-center rounded-[10px] border border-[#34D399]/40 bg-[#059669]/[0.22] text-[#A7F3D0] transition-colors hover:bg-[#059669]/30 md:grid hidden"
            >
              <Lock className="h-4 w-4" strokeWidth={1.5} />
            </a>
          ) : (
            <Link
              href={cta.href}
              title={`${cta.title} — ${cta.label}`}
              onClick={() => {
                setMobileOpen(false);
                if (isCheckoutCta) sendGAEvent("event", "checkout_started");
              }}
              className="bc-focus-light mt-3 hidden h-10 w-10 place-items-center rounded-[10px] border border-[#34D399]/40 bg-[#059669]/[0.22] text-[#A7F3D0] transition-colors hover:bg-[#059669]/30 md:grid"
            >
              <Lock className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          )
        ) : (
          <div className="mt-3 rounded-[14px] border border-[#34D399]/40 bg-gradient-to-br from-[#059669]/[0.24] to-[#059669]/[0.08] p-3.5">
            <p className="text-[11.5px] font-bold text-white">{cta.title}</p>
            <p className="mt-0.5 mb-2.5 text-[10.5px] leading-snug text-[#C9D6EC]">{cta.body}</p>
            {cta.external ? (
              <a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bc-focus-light block rounded-full bg-[#047857] py-2 text-center text-[11px] font-extrabold text-white transition-colors hover:bg-[#065F46]"
              >
                {cta.label}
              </a>
            ) : (
              <Link
                href={cta.href}
                onClick={() => {
                  setMobileOpen(false);
                  if (isCheckoutCta) sendGAEvent("event", "checkout_started");
                }}
                className="bc-focus-light block rounded-full bg-[#047857] py-2 text-center text-[11px] font-extrabold text-white transition-colors hover:bg-[#065F46]"
              >
                {cta.label}
              </Link>
            )}
          </div>
        )
      )}

      <div className="flex-1" />

      {/* User card */}
      {collapsed ? (
        <div className="hidden flex-col items-center gap-2 border-t border-white/[0.14] pt-3 md:flex">
          <span
            title={email ?? "Signed in"}
            className="grid h-8 w-8 place-items-center rounded-full bg-[#34D399]/[0.28] text-[11px] font-bold text-[#A7F3D0]"
          >
            {initials}
          </span>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              title="Sign out"
              aria-label="Sign out"
              className="bc-focus-light grid h-8 w-8 cursor-pointer place-items-center rounded-[8px] text-[#AAB8D4] transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </form>
          {toggleButton}
        </div>
      ) : null}
      <div className={cn("flex items-center gap-2.5 border-t border-white/[0.14] px-2 pt-3 pb-1", collapsed && "md:hidden")}>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#34D399]/[0.28] text-[11px] font-bold text-[#A7F3D0]">
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-semibold text-white">{email ?? "Signed in"}</span>
          <span className="block text-[11px] text-[#AAB8D4]">{orgName ?? "BrightCert"}</span>
        </span>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            title="Sign out"
            aria-label="Sign out"
            className="bc-focus-light grid h-8 w-8 cursor-pointer place-items-center rounded-[8px] text-[#AAB8D4] transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile-only persistent top strip: the sidebar's entry point on small screens */}
      <header className="bc-rail sticky top-0 z-40 flex h-14 items-center justify-between px-4 md:hidden">
        <div aria-hidden className="bc-rail-dots pointer-events-none absolute inset-0" />
        <Link href="/dashboard" aria-label="BrightCert dashboard" className="relative">
          <Logo light markClassName="h-7 w-7" textClassName="text-lg" />
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="bc-focus-light relative grid h-9 w-9 place-items-center rounded-[8px] text-[#E4EAF4] hover:bg-white/10 hover:text-white"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </header>

      {/* Mobile backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden
        className={cn(
          "fixed inset-0 z-[95] bg-[#0F2044]/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={cn(
          "bc-rail fixed inset-y-0 left-0 z-[100] w-72 shrink-0 overflow-hidden transition-transform duration-300 ease-out",
          "md:sticky md:top-0 md:h-screen md:w-60 md:translate-x-0 md:transition-[width] md:duration-200 md:motion-reduce:transition-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed && "md:w-[68px]"
        )}
      >
        <div aria-hidden className="bc-rail-dots pointer-events-none absolute inset-0" />
        {sidebarBody}
      </aside>
    </>
  );
}
