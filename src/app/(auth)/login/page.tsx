"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/brightcert/google-button";
import { LogoMark } from "@/components/brightcert/logo";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  // Where proxy.ts sent them from (e.g. /assessment/new), carried through
  // the magic-link round trip via /auth/callback?next=.
  const [nextPath, setNextPath] = useState("/dashboard");

  // Surface auth errors passed back from /auth/callback (e.g. expired link).
  // window.location isn't available during SSR, so this has to run in an effect.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    const next = params.get("next");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL on mount, not an ongoing sync
    if (err) setError(err);
    if (next) setNextPath(next);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    // shouldCreateUser: false — logging in must never create an account,
    // otherwise it bypasses the signup checks (org name, blocked domains).
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        shouldCreateUser: false,
      },
    });

    setLoading(false);
    if (error) {
      setError(
        error.message.toLowerCase().includes("signups not allowed")
          ? "No account found for this email. Create one free from the sign-up page."
          : error.message
      );
    } else {
      setSent(true);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-[22px] border border-[#0F2044]/[0.07] bg-white p-8 shadow-[0_1px_3px_rgba(15,32,68,0.06),0_16px_48px_-16px_rgba(15,32,68,0.12)]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4 lg:hidden">
            <LogoMark className="h-14 w-14" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F2044]">Sign in to BrightCert</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Enter your email to receive a magic link
          </p>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <CheckCircle2 className="h-10 w-10 text-[#047857] mx-auto mb-3" strokeWidth={1.5} />
            <p className="font-semibold text-[#0F2044] mb-1">Check your inbox</p>
            <p className="text-sm text-[#64748B]">
              We sent a sign-in link to <strong>{email}</strong>. Click it to access your account.
            </p>
          </div>
        ) : (
          <>
            <GoogleButton label="Sign in with Google" />
            <div className="flex items-center gap-3 my-4">
              <div className="h-px flex-1 bg-[#0F2044]/[0.08]" />
              <span className="text-xs text-[#94A3B8]">or</span>
              <div className="h-px flex-1 bg-[#0F2044]/[0.08]" />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourcompany.co.uk"
                className="w-full h-11 rounded-[8px] border border-[#0F2044]/[0.12] bg-white px-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent"
              />
            </div>
            {error && (
              <p className="text-sm text-[#DC2626]">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Send magic link"}
            </Button>
            </form>
          </>
        )}

        <p className="text-center text-xs text-[#64748B] mt-6">
          No account yet?{" "}
          <Link
            href={`/signup?next=${encodeURIComponent(nextPath)}`}
            className="text-[#047857] hover:underline font-medium"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
