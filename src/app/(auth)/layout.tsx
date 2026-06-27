import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Minimal header */}
      <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-[#0F2044]">
          <ShieldCheck className="h-5 w-5 text-[#047857]" strokeWidth={1.5} />
          BrightCert
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
      <footer className="py-4 text-center text-xs text-[#64748B]">
        BrightCert provides readiness assessment. It does not issue official Cyber Essentials certification.
      </footer>
    </div>
  );
}
