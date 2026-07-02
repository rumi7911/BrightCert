"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/brightcert/google-button";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    // Sign up via magic link — org name stored in metadata, profile created in callback
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { org_name: orgName },
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-[12px] bg-[#ECFDF5] flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-[#047857]" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-xl font-bold text-[#0F2044]">Start your Cyber Essentials assessment</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Create your free account. No payment required to start.
          </p>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <CheckCircle2 className="h-10 w-10 text-[#047857] mx-auto mb-3" strokeWidth={1.5} />
            <p className="font-semibold text-[#0F2044] mb-1">Check your inbox</p>
            <p className="text-sm text-[#64748B]">
              We sent a sign-in link to <strong>{email}</strong>. Click it to finish creating your account.
            </p>
          </div>
        ) : (
          <>
            <GoogleButton label="Sign up with Google" />
            <div className="flex items-center gap-3 my-4">
              <div className="h-px flex-1 bg-[#E2E8F0]" />
              <span className="text-xs text-[#94A3B8]">or</span>
              <div className="h-px flex-1 bg-[#E2E8F0]" />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="org-name" className="block text-sm font-medium text-[#334155] mb-1.5">
                Organisation name
              </label>
              <input
                id="org-name"
                name="org_name"
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Acme Ltd"
                className="w-full h-11 rounded-[8px] border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#334155] mb-1.5">
                Work email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourcompany.co.uk"
                className="w-full h-11 rounded-[8px] border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent"
              />
            </div>
            {error && (
              <p className="text-sm text-[#DC2626]">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Create account & start assessment"}
            </Button>
            </form>
          </>
        )}

        <p className="text-center text-xs text-[#64748B] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#047857] hover:underline font-medium">
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-[#94A3B8] mt-4">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="hover:underline">Terms</Link> and{" "}
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
