import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-[12px] bg-[#ECFDF5] flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-[#047857]" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-xl font-bold text-[#0F2044]">Sign in to BrightCert</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Enter your email to receive a magic link
          </p>
        </div>

        {/* Magic link form — wired to Supabase Auth in Phase 2 */}
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#334155] mb-1.5">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@yourcompany.co.uk"
              className="w-full h-11 rounded-[8px] border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent"
            />
          </div>
          <Button type="submit" className="w-full">
            Send magic link
          </Button>
        </form>

        <p className="text-center text-xs text-[#64748B] mt-6">
          No account yet?{" "}
          <Link href="/signup" className="text-[#047857] hover:underline font-medium">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
