import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, ClipboardList, Settings, LogOut } from "lucide-react";

// Auth protection wired in Phase 2 via proxy.ts + Supabase
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top bar */}
      <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="BrightCert" width={148} height={44} priority className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/settings" className="text-sm text-[#64748B] hover:text-[#0F2044]">Settings</Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-sm text-[#64748B] hover:text-[#0F2044] flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar — hidden on mobile */}
        <aside className="hidden md:flex flex-col w-56 bg-white border-r border-[#E2E8F0] p-4">
          <nav className="space-y-1">
            {[
              { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
              { href: "/assessment/new", icon: ClipboardList, label: "New Assessment" },
              { href: "/settings", icon: Settings, label: "Settings" },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-sm text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F2044] transition-colors"
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-4 md:px-8 py-8 max-w-5xl">{children}</main>
      </div>
    </div>
  );
}
