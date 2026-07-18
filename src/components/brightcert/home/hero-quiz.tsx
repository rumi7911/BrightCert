"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTilt } from "./motion-hooks";

const QUESTIONS = [
  {
    area: "User Access Control",
    text: "Does everyone in your business have their own login account?",
    options: [
      { label: "Yes, everyone does", pts: 2 },
      { label: "Some people share logins", pts: 1 },
      { label: "I'm not sure", pts: 0 },
    ],
  },
  {
    area: "Malware Protection",
    text: "Is anti-malware software installed and switched on for every device?",
    options: [
      { label: "Yes, on all devices", pts: 2 },
      { label: "On most devices", pts: 1 },
      { label: "I'm not sure", pts: 0 },
    ],
  },
  {
    area: "Security Update Management",
    text: "Do your computers and phones install security updates automatically?",
    options: [
      { label: "Yes, automatically", pts: 2 },
      { label: "Only when prompted", pts: 1 },
      { label: "I'm not sure", pts: 0 },
    ],
  },
];

const VERDICTS = [
  { min: 6, title: "Strong start", msg: "You're well on your way. The full assessment confirms exactly where you stand across all five control areas." },
  { min: 3, title: "Getting there", msg: "Good foundations with a few gaps. The full assessment pinpoints what to fix first, in plain English." },
  { min: 0, title: "Early days", msg: "No worries: that's exactly why BrightCert exists. See precisely what to fix, step by step." },
];

const RADIUS = 46;
const CIRC = 2 * Math.PI * RADIUS;

export function HeroQuiz() {
  const tiltRef = useTilt<HTMLDivElement>();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [leaving, setLeaving] = useState(false);
  const done = index >= QUESTIONS.length;

  const pick = (pts: number, i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setScore((s) => s + pts);
    setTimeout(() => {
      setLeaving(true);
      setTimeout(() => {
        setIndex((v) => v + 1);
        setPicked(null);
        setLeaving(false);
      }, 280);
    }, 420);
  };

  const restart = () => {
    setIndex(0);
    setScore(0);
    setPicked(null);
    setLeaving(false);
  };

  const max = QUESTIONS.length * 2;
  const pct = done ? score / max : 0;
  const verdict = VERDICTS.find((v) => score >= v.min);
  const progressPct = done ? 100 : (index / QUESTIONS.length) * 100;

  return (
    <div
      ref={tiltRef}
      className="relative rounded-[26px] border border-[#0F2044]/[0.07] bg-white p-6 pb-5 shadow-[0_1px_2px_rgba(15,32,68,0.05),0_24px_60px_-20px_rgba(15,32,68,0.22)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="mb-5">
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <span className="rounded-full bg-[#047857] px-2.5 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-white">
            Try a 30-second sample
          </span>
          <span className="font-mono text-[11px] tracking-wide text-[#64748B]">
            {done ? "Sample complete" : QUESTIONS[index].area}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-[#EBEDDE] overflow-hidden">
          <span
            className="block h-full rounded-full bg-gradient-to-r from-[#059669] to-[#6EE7B7] transition-[width] duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="min-h-[252px] relative">
        {!done ? (
          <div className={`transition-all duration-300 ${leaving ? "opacity-0 -translate-x-5" : "opacity-100"}`}>
            <p className="font-display text-[21px] font-semibold leading-[1.3] tracking-[-0.015em] text-[#0F2044] mb-5">
              {QUESTIONS[index].text}
            </p>
            <div className="grid gap-2.5">
              {QUESTIONS[index].options.map((opt, i) => (
                <button
                  key={opt.label}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => pick(opt.pts, i)}
                  className={`flex w-full items-center gap-3 rounded-[14px] border px-4 py-3.5 text-left text-[15px] font-medium text-[#0F2044] transition-all ${
                    picked === i
                      ? "border-[#047857] bg-[#ECFDF5]"
                      : "border-[#0F2044]/[0.08] bg-[#F3F4EC] hover:border-[#0F2044]/30 hover:translate-x-1"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] border font-mono text-[11px] font-bold ${
                      picked === i ? "border-[#0F2044] bg-[#0F2044] text-[#6EE7B7]" : "border-[#0F2044]/[0.12] bg-white text-[#64748B]"
                    }`}
                  >
                    {"ABC"[i]}
                  </span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center pt-1.5">
            <div className="relative mx-auto mb-3.5 h-[108px] w-[108px]">
              <svg viewBox="0 0 104 104" width={108} height={108} className="-rotate-90">
                <circle cx={52} cy={52} r={RADIUS} fill="none" stroke="#EBEDDE" strokeWidth={9} />
                <circle
                  cx={52}
                  cy={52}
                  r={RADIUS}
                  fill="none"
                  stroke="#059669"
                  strokeWidth={9}
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: CIRC,
                    strokeDashoffset: CIRC * (1 - pct),
                    transition: "stroke-dashoffset 1.1s cubic-bezier(0.19,1,0.22,1)",
                  }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-display text-[26px] font-bold tracking-[-0.02em] text-[#0F2044]">
                {Math.round(pct * 100)}%
              </span>
            </div>
            <p className="font-display text-[19px] font-semibold text-[#0F2044] mb-1.5">{verdict?.title}</p>
            <p className="mx-auto mb-4 max-w-[34ch] text-sm text-[#475569]">{verdict?.msg}</p>
            <Link
              href="/assessment/new"
              className="inline-flex items-center gap-2 rounded-full bg-[#0F2044] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Start your full assessment
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
            <br />
            <button
              type="button"
              onClick={restart}
              className="mt-[14px] font-mono text-[11px] uppercase tracking-[0.1em] text-[#64748B] border-b border-[#0F2044]/[0.15] pb-0.5 transition-colors hover:text-[#0F2044] hover:border-[#0F2044]"
            >
              Retake sample
            </button>
          </div>
        )}
      </div>

      <div className="mt-[18px] flex items-center justify-between border-t border-dashed border-[#0F2044]/[0.12] pt-3.5 font-mono text-[11px] tracking-wide text-[#64748B]">
        <span>{done ? "3 of 60 questions sampled" : `Question ${index + 1} of ${QUESTIONS.length}`}</span>
        <span>No signup needed</span>
      </div>
    </div>
  );
}
