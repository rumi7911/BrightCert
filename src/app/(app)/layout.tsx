import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { AppSidebar } from "@/components/brightcert/app-sidebar";

// Auth protection wired in Phase 2 via proxy.ts + Supabase
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] flex items-center justify-between px-4 md:px-6">
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
        <AppSidebar />

        {/* Main content */}
        <main className="flex-1 px-4 md:px-8 py-8 max-w-5xl">{children}</main>
      </div>
    </div>
  );
}
