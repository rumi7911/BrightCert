import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Minimal header */}
      <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center px-4">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="BrightCert" width={148} height={44} priority className="h-8 w-auto" />
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
