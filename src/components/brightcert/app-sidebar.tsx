"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Settings, LogOut } from "lucide-react";
import { LogoMark } from "@/components/brightcert/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/assessment/new", icon: ClipboardList, label: "New Assessment" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

type Props = {
  orgName: string | null;
  email: string | null;
};

// Borderless rail that sits directly on the grey shell — the white content
// canvas next to it carries the elevation (Linear/Attio app-frame pattern).
export function AppSidebar({ orgName, email }: Props) {
  const pathname = usePathname();
  const initials = (email?.slice(0, 2) ?? "??").toUpperCase();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col px-3 py-4">
      {/* Org identity */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 mb-4 hover:bg-white/70 transition-colors"
      >
        <LogoMark className="h-8 w-8 shrink-0" />
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-semibold leading-tight text-[#0F2044]">
            {orgName ?? "Your organisation"}
          </span>
          <span className="block text-[11px] text-[#8A94A8]">Cyber Essentials readiness</span>
        </span>
      </Link>

      <p className="px-3 mb-2 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Workspace</p>
      <nav className="space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-[9px] text-sm border transition-colors",
                active
                  ? "bg-white text-[#0F2044] font-medium border-[#E5EAF2] shadow-[0_1px_2px_rgba(15,32,68,0.06)]"
                  : "text-[#55607A] border-transparent hover:bg-white/60 hover:text-[#0F2044]"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={cn("h-4 w-4", active ? "text-[#047857]" : "text-[#93A0B6]")} strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      {/* User card */}
      <div className="flex items-center gap-2.5 border-t border-[#DFE5EE] px-2.5 pt-3 pb-1">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-[11px] font-bold text-[#047857]">
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
            className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[#93A0B6] hover:bg-white/70 hover:text-[#0F2044] transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </form>
      </div>
    </aside>
  );
}
