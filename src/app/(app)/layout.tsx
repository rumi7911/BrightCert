import Link from "next/link";
import { LogOut } from "lucide-react";
import { AppSidebar } from "@/components/brightcert/app-sidebar";
import { Logo } from "@/components/brightcert/logo";

// Auth protection wired in Phase 2 via proxy.ts + Supabase
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_1px_2px_rgba(15,32,68,0.03)] flex items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center" aria-label="BrightCert home">
          <Logo markClassName="h-7 w-7" textClassName="text-lg" />
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
        <AppSidebar />

        {/* Main content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
