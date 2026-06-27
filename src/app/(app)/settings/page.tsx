import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-[#0F2044] mb-1">Settings</h1>
      <p className="text-sm text-[#64748B] mb-8">Manage your account and organisation</p>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white divide-y divide-[#F1F5F9]">
        <div className="p-5">
          <p className="text-sm font-semibold text-[#0F2044] mb-1">Organisation name</p>
          <input
            type="text"
            placeholder="Your organisation name"
            className="w-full h-10 rounded-[8px] border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#047857]"
          />
        </div>
        <div className="p-5">
          <p className="text-sm font-semibold text-[#0F2044] mb-1">Email address</p>
          <input
            type="email"
            placeholder="you@yourcompany.co.uk"
            className="w-full h-10 rounded-[8px] border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#047857]"
          />
        </div>
      </div>

      <p className="text-xs text-[#94A3B8] mt-6">
        Settings are wired to Supabase in Phase 2. Save functionality coming soon.
      </p>
    </div>
  );
}
