"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  Lock,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  PieChart,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { LogoMark } from "@/components/brightcert/logo";
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

// B-style item: quiet row, 2px emerald edge + soft wash when active,
// muted tabular trailing values instead of badges.
function RailItem({
  item,
  active,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-2.5 border-l-2 py-[7px] text-[13px] transition-colors",
        collapsed ? "w-11 justify-center rounded-[8px] border-l-2 px-0" : "rounded-r-[8px] pl-3 pr-2.5",
        active
          ? "border-[#047857] bg-gradient-to-r from-[#047857]/[0.07] to-transparent font-semibold text-[#0F2044]"
          : "border-transparent text-[#5B6579] hover:bg-white/60 hover:text-[#0F2044]"
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-[#047857]" : "text-[#93A0B6]")} strokeWidth={1.5} />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && item.trailing && (
        <span
          className={cn(
            "ml-auto text-[11px] tabular-nums",
            item.trailing.hot ? "font-bold text-[#B91C1C]" : "text-[#99A2B4]"
          )}
        >
          {item.trailing.text}
        </span>
      )}
      {collapsed && item.trailing?.hot && (
        <span
          className="absolute right-1 top-1 h-[7px] w-[7px] rounded-full border-[1.5px] border-[#EEF2F7] bg-[#DC2626]"
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
        background: `conic-gradient(${color} 0 ${Math.min(Math.max(score, 0), 100)}%, #EEF2F7 ${Math.min(Math.max(score, 0), 100)}% 100%)`,
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
  const initials = (email?.slice(0, 2) ?? "??").toUpperCase();

  // Restore the saved rail state after mount (SSR always renders expanded)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage read on mount
    if (localStorage.getItem(COLLAPSE_KEY) === "1") setCollapsed(true);
  }, []);

  // Keyboard shortcut: [ toggles the rail (ignored while typing)
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
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
  }, []);

  function toggle() {
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
      onClick={toggle}
      title={collapsed ? "Expand sidebar  [" : "Collapse sidebar  ["}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={cn(
        "grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-[6px] text-[#93A0B6] transition-colors hover:bg-white hover:text-[#0F2044]",
        !collapsed && "ml-auto"
      )}
    >
      <ToggleIcon className="h-4 w-4" strokeWidth={1.5} />
    </button>
  );

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col py-4 transition-[width] duration-200 motion-reduce:transition-none md:flex",
        collapsed ? "w-[68px] items-center px-2.5" : "w-60 px-3"
      )}
    >
      {/* Org identity + toggle */}
      {collapsed ? (
        <Link href="/dashboard" title={orgName ?? "Dashboard"} className="mb-3">
          <LogoMark className="h-8 w-8" />
        </Link>
      ) : (
        <div className="mb-3 flex items-center gap-2.5 rounded-[10px] px-2 py-1.5">
          <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5">
            <LogoMark className="h-8 w-8 shrink-0" />
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold leading-tight text-[#0F2044]">
                {orgName ?? "Your organisation"}
              </span>
              <span className="block truncate whitespace-nowrap text-[11px] text-[#8A94A8]">Cyber Essentials readiness</span>
            </span>
          </Link>
          {toggleButton}
        </div>
      )}

      {/* C: score ring card */}
      {latest && latest.score != null && (
        collapsed ? (
          <Link
            href={`/assessment/${latest.id}/results`}
            title={`${latest.verdict} · ${latest.score}%`}
            className="mb-3"
          >
            <ScoreRing score={latest.score} color={latest.scoreColor} size="sm" />
          </Link>
        ) : (
          <Link
            href={`/assessment/${latest.id}/results`}
            className="mb-3 flex items-center gap-3 rounded-[12px] border border-[#E5EAF2] bg-white p-3 shadow-[0_1px_2px_rgba(15,32,68,0.05)] transition-colors hover:border-[#CBD5E1]"
          >
            <ScoreRing score={latest.score} color={latest.scoreColor} size="md" />
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold leading-tight text-[#0F2044]">
                {latest.verdict}
              </span>
              <span className="block text-[10.5px] font-semibold text-[#B91C1C]">
                {latest.p1Count > 0
                  ? `${latest.p1Count} ${latest.p1Count === 1 ? "issue" : "issues"} to fix`
                  : ""}
                {latest.p1Count === 0 && (
                  <span className="text-[#047857]">No critical issues</span>
                )}
              </span>
            </span>
          </Link>
        )
      )}

      {!collapsed && (
        <p className="mb-1.5 mt-2 px-3 text-[10px] font-semibold uppercase tracking-[0.09em] text-[#94A3B8]">
          Workspace
        </p>
      )}
      <nav className={cn("space-y-1", collapsed && "mt-1 space-y-1.5")}>
        {workspaceItems.map((item) => (
          <RailItem key={item.href} item={item} active={pathname === item.href} collapsed={collapsed} />
        ))}
      </nav>

      {!collapsed && (
        <p className="mb-1.5 mt-4 px-3 text-[10px] font-semibold uppercase tracking-[0.09em] text-[#94A3B8]">
          Account
        </p>
      )}
      <nav className={cn("space-y-1", collapsed && "mt-1.5 space-y-1.5")}>
        {accountItems.map((item) => (
          <RailItem key={item.href} item={item} active={pathname === item.href} collapsed={collapsed} />
        ))}
      </nav>

      {/* C: state-aware report CTA */}
      {latest?.cta && (
        collapsed ? (
          latest.cta.external ? (
            <a
              href={latest.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              title={`${latest.cta.title} — ${latest.cta.label}`}
              className="mt-3 grid h-10 w-10 place-items-center rounded-[10px] border border-[#A7F3D0] bg-[#ECFDF5] text-[#047857] transition-colors hover:bg-[#D1FAE5]"
            >
              <Lock className="h-4 w-4" strokeWidth={1.5} />
            </a>
          ) : (
            <Link
              href={latest.cta.href}
              title={`${latest.cta.title} — ${latest.cta.label}`}
              className="mt-3 grid h-10 w-10 place-items-center rounded-[10px] border border-[#A7F3D0] bg-[#ECFDF5] text-[#047857] transition-colors hover:bg-[#D1FAE5]"
            >
              <Lock className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          )
        ) : (
          <div className="mt-3 rounded-[12px] border border-[#A7F3D0] bg-[#ECFDF5] p-3">
            <p className="text-[11.5px] font-bold text-[#065F46]">{latest.cta.title}</p>
            <p className="mt-0.5 mb-2.5 text-[10.5px] leading-snug text-[#047857]">{latest.cta.body}</p>
            {latest.cta.external ? (
              <a
                href={latest.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-[7px] bg-[#047857] py-1.5 text-center text-[11px] font-bold text-white transition-colors hover:bg-[#065F46]"
              >
                {latest.cta.label}
              </a>
            ) : (
              <Link
                href={latest.cta.href}
                className="block rounded-[7px] bg-[#047857] py-1.5 text-center text-[11px] font-bold text-white transition-colors hover:bg-[#065F46]"
              >
                {latest.cta.label}
              </Link>
            )}
          </div>
        )
      )}

      <div className="flex-1" />

      {/* User card */}
      {collapsed ? (
        <div className="flex flex-col items-center gap-2 border-t border-[#DFE5EE] pt-3">
          <span
            title={email ?? "Signed in"}
            className="grid h-8 w-8 place-items-center rounded-full bg-[#ECFDF5] text-[11px] font-bold text-[#047857]"
          >
            {initials}
          </span>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              title="Sign out"
              aria-label="Sign out"
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-[8px] text-[#93A0B6] transition-colors hover:bg-white/70 hover:text-[#0F2044]"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </form>
          {toggleButton}
        </div>
      ) : (
        <div className="flex items-center gap-2.5 border-t border-[#DFE5EE] px-2 pt-3 pb-1">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#ECFDF5] text-[11px] font-bold text-[#047857]">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-medium text-[#0F2044]">{email ?? "Signed in"}</span>
            <span className="block text-[11px] text-[#8A94A8]">{orgName ?? "BrightCert"}</span>
          </span>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              title="Sign out"
              aria-label="Sign out"
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-[8px] text-[#93A0B6] transition-colors hover:bg-white/70 hover:text-[#0F2044]"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
