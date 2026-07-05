"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUESTIONS = [
  {
    q: "Does everyone in your business have their own login account?",
    area: "User Access Control",
  },
  {
    q: "Are all your computers and phones still receiving security updates?",
    area: "Security Update Management",
  },
  {
    q: "Have you changed the default passwords on your router and key devices?",
    area: "Secure Configuration",
  },
];

const OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

export function ReadinessTeaser() {
  const [answers, setAnswers] = useState<string[]>([]);
  const step = answers.length;
  const done = step >= QUESTIONS.length;

  const flagged = QUESTIONS.filter((_, i) => answers[i] !== "yes").map((q) => q.area);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(15,32,68,0.06),0_16px_48px_-16px_rgba(15,32,68,0.12)] text-left">
      {!done ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-semibold text-[#047857] uppercase tracking-wider">
              {QUESTIONS[step].area}
            </p>
            <p className="text-xs text-[#94A3B8]">Question {step + 1} of 3</p>
          </div>
          <p className="text-base font-semibold text-[#0F2044] mb-4 leading-snug">
            {QUESTIONS[step].q}
          </p>
          <div className="space-y-2">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAnswers([...answers, opt.value])}
                className="flex w-full items-center gap-2.5 rounded-[8px] border border-[#E2E8F0] px-3.5 py-2.5 text-sm text-[#475569] cursor-pointer transition-all duration-150 hover:border-[#047857] hover:bg-[#ECFDF5] hover:text-[#0F2044]"
              >
                <span className="h-4 w-4 rounded-full border border-[#CBD5E1] shrink-0" aria-hidden />
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#94A3B8] mt-4">Takes 30 seconds. No signup needed.</p>
        </>
      ) : (
        <>
          {flagged.length === 0 ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-[#059669]" strokeWidth={1.5} />
                <p className="text-base font-semibold text-[#0F2044]">Good signs so far</p>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed mb-5">
                These three answers look healthy. The full assessment checks around 60 questions
                across all five Cyber Essentials control areas, in the same plain English.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-[#D97706]" strokeWidth={1.5} />
                <p className="text-base font-semibold text-[#0F2044]">Worth a closer look</p>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed mb-3">
                Based on these answers, your business would likely flag on:
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {flagged.map((area) => (
                  <span
                    key={area}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </>
          )}
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/assessment/new">Start Your Assessment</Link>
            </Button>
            <button
              type="button"
              onClick={() => setAnswers([])}
              className="inline-flex items-center gap-1 text-sm text-[#64748B] hover:text-[#0F2044] cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
              Start again
            </button>
          </div>
        </>
      )}
    </div>
  );
}
