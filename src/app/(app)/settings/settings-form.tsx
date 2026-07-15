"use client";

import { useActionState } from "react";
import { updateOrganisation } from "./actions";
import { CheckCircle2, Loader2 } from "lucide-react";

type Props = {
  orgName: string;
  orgSize: string | null;
  orgSector: string | null;
  email: string;
};

const SIZE_OPTIONS = [
  { value: "micro", label: "Micro (1–9 employees)" },
  { value: "small", label: "Small (10–49 employees)" },
  { value: "medium", label: "Medium (50–249 employees)" },
];

export function SettingsForm({ orgName, orgSize, orgSector, email }: Props) {
  const [state, action, pending] = useActionState(updateOrganisation, null);

  return (
    <form action={action} className="space-y-8">
      {/* Organisation details */}
      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <h2 className="text-[13px] font-semibold text-[#0F2044]">Organisation</h2>
        </div>
        <div className="border-t border-[#EEF1F6]" />

        <div className="pt-4 pb-1">
          <label htmlFor="name" className="block text-sm font-medium text-[#0F2044] mb-1.5">
            Organisation name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={orgName}
            placeholder="Acme Ltd"
            className="w-full h-10 rounded-[8px] border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent"
          />
        </div>

        <div className="pt-4 pb-1">
          <label htmlFor="size" className="block text-sm font-medium text-[#0F2044] mb-1.5">
            Organisation size
          </label>
          <select
            id="size"
            name="size"
            defaultValue={orgSize ?? ""}
            className="w-full h-10 rounded-[8px] border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent"
          >
            <option value="">Select size…</option>
            {SIZE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="pt-4 pb-1">
          <label htmlFor="sector" className="block text-sm font-medium text-[#0F2044] mb-1.5">
            Sector
          </label>
          <input
            id="sector"
            name="sector"
            type="text"
            defaultValue={orgSector ?? ""}
            placeholder="e.g. Professional services, Healthcare, Retail…"
            className="w-full h-10 rounded-[8px] border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#047857] focus:border-transparent"
          />
        </div>
      </div>

      {/* Account details — read-only */}
      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <h2 className="text-[13px] font-semibold text-[#0F2044]">Account</h2>
        </div>
        <div className="border-t border-[#EEF1F6]" />
        <div className="pt-4 pb-1">
          <label className="block text-sm font-medium text-[#0F2044] mb-1.5">Email address</label>
          <div className="h-10 rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 flex items-center">
            <span className="text-sm text-[#64748B]">{email}</span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5">Email is used for magic link login and cannot be changed here.</p>
        </div>
      </div>

      {/* Feedback */}
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">
          {state.error}
        </p>
      )}
      {state?.success && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-[8px] px-4 py-3">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Settings saved successfully.
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 h-10 px-5 rounded-[8px] bg-[#047857] hover:bg-[#065F46] text-white text-sm font-semibold transition-colors disabled:opacity-60"
      >
        {pending && <Loader2 className="w-4 h-4 animate-spin" />}
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
