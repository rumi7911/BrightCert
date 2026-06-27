import { ShieldAlert } from "lucide-react";

export function CertificationDisclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-[#64748B]">
        BrightCert provides readiness assessment and preparation support. It does not issue official Cyber Essentials certification. Official certification is provided through IASME Certification Bodies.
      </p>
    );
  }

  return (
    <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex gap-3">
      <ShieldAlert className="h-5 w-5 text-[#64748B] shrink-0 mt-0.5" strokeWidth={1.5} />
      <div>
        <p className="text-sm font-medium text-[#334155]">Readiness assessment — not official certification</p>
        <p className="text-sm text-[#64748B] mt-1">
          BrightCert helps UK businesses prepare for Cyber Essentials by assessing readiness, identifying gaps, and producing a practical report. BrightCert does not issue the official Cyber Essentials certificate. Official certification must be completed through an IASME-licensed Certification Body.
        </p>
      </div>
    </div>
  );
}
