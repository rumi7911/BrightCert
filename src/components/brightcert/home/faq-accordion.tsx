"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Does BrightCert issue the official Cyber Essentials certificate?",
    a: "No. BrightCert provides readiness assessment and preparation support. Official Cyber Essentials certification must be completed through an IASME-licensed Certification Body.",
  },
  {
    q: "Do I need to pay before starting the assessment?",
    a: "No. You can complete the full assessment first. Payment of £199 is required only when you want to unlock your full readiness report and PDF download.",
  },
  {
    q: "How long does the assessment take?",
    a: "Most businesses complete the assessment in around 2 hours. You can save your progress and return at any time.",
  },
  {
    q: "Is BrightCert suitable for non-technical users?",
    a: "Yes. BrightCert explains Cyber Essentials preparation in plain English. You do not need to be a cyber security expert to complete the assessment.",
  },
  {
    q: "Do you store my answers securely?",
    a: "Yes. Your assessment responses are stored securely and used only to generate your readiness report. We never share your data with third parties.",
  },
  {
    q: "What is the difference between Cyber Essentials and Cyber Essentials Plus?",
    a: "Cyber Essentials is a self-assessed questionnaire reviewed by a Certification Body. Cyber Essentials Plus adds external technical verification. BrightCert supports preparation for both, with specific CE Plus guidance in the CE Plus Pack.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="border-t border-[#0F2044]/[0.12]">
      {FAQS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <article key={item.q} className="border-b border-[#0F2044]/[0.12]">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 px-1 text-left transition-colors hover:text-[#059669]"
            >
              <span className="font-display text-base sm:text-[18.5px] font-semibold leading-[1.35] tracking-[-0.015em] text-[#0F2044]">
                {item.q}
              </span>
              <span
                className={`relative shrink-0 h-8 w-8 rounded-full border transition-all duration-500 ${
                  isOpen ? "rotate-[135deg] border-[#0F2044] bg-[#0F2044]" : "border-[#0F2044]/[0.15]"
                }`}
              >
                <span
                  className={`absolute left-1/2 top-1/2 h-[1.8px] w-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors ${
                    isOpen ? "bg-[#6EE7B7]" : "bg-[#0F2044]"
                  }`}
                />
                <span
                  className={`absolute left-1/2 top-1/2 h-[1.8px] w-3 -translate-x-1/2 -translate-y-1/2 rotate-90 rounded-full transition-colors ${
                    isOpen ? "bg-[#6EE7B7]" : "bg-[#0F2044]"
                  }`}
                />
              </span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className={`max-w-[62ch] text-[15px] leading-relaxed text-[#475569] px-1 ${isOpen ? "pb-6" : ""}`}>{item.a}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
