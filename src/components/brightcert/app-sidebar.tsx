"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/assessment/new", icon: ClipboardList, label: "New Assessment" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border-r border-[#E2E8F0] p-4">
      <p className="px-3 mb-2 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Menu</p>
      <nav className="space-y-0.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-sm transition-colors",
                active
                  ? "bg-[#F8FAFC] text-[#0F2044] font-medium"
                  : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F2044]"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={cn("h-4 w-4", active ? "text-[#047857]" : "text-[#94A3B8]")} strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
