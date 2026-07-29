"use client";

import { useState } from "react";
import { getCyberEssentialsFee } from "@/lib/seo/cyber-essentials-fees";

function pounds(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CyberEssentialsCostCalculator() {
  const [employeeCount, setEmployeeCount] = useState("5");
  const employees = Number.parseInt(employeeCount || "0", 10);
  const result = getCyberEssentialsFee(Number.isNaN(employees) ? 0 : Math.max(0, employees));

  return (
    <section
      aria-labelledby="cost-calculator-title"
      className="mt-8 rounded-[20px] border border-[#A7F3D0] bg-[#ECFDF5] p-6 sm:p-7"
    >
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#047857]">
        Official fee calculator
      </p>
      <h2 id="cost-calculator-title" className="mt-2 font-display text-xl font-bold text-[#0F2044]">
        Calculate your Cyber Essentials certification fee
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#475569]">
        Enter your total employee count. This calculates the standard IASME assessment fee, not BrightCert
        preparation, remediation work or Cyber Essentials Plus.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-end">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[#0F2044]">Number of employees</span>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={employeeCount}
            onChange={(event) => setEmployeeCount(event.target.value)}
            className="h-12 w-full rounded-[10px] border border-[#0F2044]/15 bg-white px-4 text-base text-[#0F2044] outline-none transition focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20"
          />
        </label>

        <div className="rounded-[14px] bg-white px-5 py-4 shadow-[0_10px_24px_-18px_rgba(15,32,68,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">{result.size} organisation</p>
          <p className="mt-1 font-display text-2xl font-bold text-[#0F2044]">
            {pounds(result.feeExVat)} + VAT
          </p>
          <p className="mt-1 text-sm text-[#475569]">{pounds(result.feeIncVat)} including VAT</p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-[#64748B]">
        Source:{" "}
        <a
          href="https://iasme.co.uk/cyber-essentials/frequently-asked-questions/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#047857] underline hover:no-underline"
        >
          IASME Cyber Essentials pricing FAQ
        </a>
        . Reviewed 28 July 2026.
      </p>
    </section>
  );
}
