"use client";

import { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import { LogoMark } from "@/components/brightcert/logo";
import { useTilt } from "@/components/brightcert/motion-hooks";

const BARS = [
  { label: "Firewalls", value: 85, tone: "good" as const },
  { label: "Configuration", value: 72, tone: "mid" as const },
  { label: "User Access", value: 61, tone: "mid" as const },
  { label: "Malware", value: 88, tone: "good" as const },
  { label: "Updates", value: 54, tone: "low" as const },
];

const TONE_COLOR: Record<string, string> = { good: "#059669", mid: "#D97706", low: "#DC2626" };

const RADIUS = 52;
const CIRC = 2 * Math.PI * RADIUS;
const SCORE = 72;

export function ReportPreviewCard() {
  const tiltRef = useTilt<HTMLDivElement>();
  const observeRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = observeRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        const start = performance.now();
        const dur = 1300;
        const tick = (t: number) => {
          const p = Math.min((t - start) / dur, 1);
          setCount(Math.round(SCORE * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={(el) => {
        observeRef.current = el;
        tiltRef.current = el;
      }}
      className="relative rounded-[26px] border border-white/10 bg-[#0A1730] px-6 pb-6 pt-6 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.7)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-5 mb-5">
        <div className="flex items-center gap-3">
          <LogoMark light className="h-[22px] w-[22px] rounded-[6px] shrink-0" />
          <div>
            <strong className="block font-display text-[15px] font-semibold text-white">BrightCert Report</strong>
            <span className="font-mono text-[11.5px] text-white/50">Fenwick &amp; Hale Ltd · readiness summary</span>
          </div>
        </div>
        <span className="rounded-[8px] border border-[#6EE7B7]/[0.4] px-3 py-1.5 font-mono text-[10.5px] font-bold tracking-[0.14em] text-[#6EE7B7]">
          PDF
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
        <div className="relative shrink-0">
          <svg viewBox="0 0 120 120" width={132} height={132}>
            <circle cx={60} cy={60} r={RADIUS} fill="none" stroke="rgba(244,245,239,0.1)" strokeWidth={10} />
            <circle
              cx={60}
              cy={60}
              r={RADIUS}
              fill="none"
              stroke="#6EE7B7"
              strokeWidth={10}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{
                strokeDasharray: CIRC,
                strokeDashoffset: inView ? CIRC * (1 - SCORE / 100) : CIRC,
                transition: "stroke-dashoffset 1.4s cubic-bezier(0.19,1,0.22,1) 0.25s",
                filter: "drop-shadow(0 0 10px rgba(110,231,183,0.35))",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <strong className="font-display text-[34px] font-bold tracking-[-0.03em] text-white">{count}</strong>
            <span className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/55">readiness</span>
          </div>
        </div>
        <div>
          <span className="mb-2.5 inline-block rounded-full bg-[#6EE7B7] px-2.5 py-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#0F2044]">
            Nearly ready
          </span>
          <p className="text-[13.5px] leading-relaxed text-white/60">
            4 gaps to close before you apply: 2 are quick fixes your team can do this week.
          </p>
        </div>
      </div>

      <ul className="grid gap-3 mb-6">
        {BARS.map((bar, i) => (
          <li key={bar.label} className="grid grid-cols-[108px_1fr_42px] items-center gap-3.5">
            <span className="font-mono text-[11px] text-white/50">{bar.label}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-white/[0.09]">
              <span
                className="block h-full rounded-full transition-[width] duration-[1200ms]"
                style={{
                  width: inView ? `${bar.value}%` : "0%",
                  backgroundColor: TONE_COLOR[bar.tone],
                  transitionDelay: `${i * 100}ms`,
                  transitionTimingFunction: "cubic-bezier(0.19,1,0.22,1)",
                }}
              />
            </span>
            <span className="text-right font-mono text-[11px] text-white/70">{bar.value}%</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-3.5 border-t border-dashed border-white/[0.14] pt-[18px]">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#6EE7B7] px-4 py-2 font-mono text-[12px] font-bold text-[#0F2044]">
          <FileText className="h-3.5 w-3.5" strokeWidth={2} />
          Download PDF report
        </span>
        <span className="font-mono text-[10.5px] text-white/45">14 pages · generated instantly</span>
      </div>
    </div>
  );
}
