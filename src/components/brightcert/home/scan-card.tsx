"use client";

import { useEffect, useRef, useState } from "react";

const ROWS = [
  { label: "Boundary firewalls", value: 85 },
  { label: "Secure configuration", value: 72 },
  { label: "User access control", value: 61 },
  { label: "Malware protection", value: 88 },
  { label: "Update management", value: 54 },
];

const LOG_LINES = [
  { text: "▸ analysing 60 responses...", delaySec: 0.7 },
  { text: "▸ 4 gaps identified across 2 control areas", delaySec: 1.6 },
  { text: "✓ readiness report ready: score 67/100", delaySec: 2.5, ok: true },
];

// The solution section's animated "live analysis" demo, ported from the
// original design's scan-card. Purely decorative, triggers once on view.
export function ScanCard() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative overflow-hidden rounded-[22px] border border-white/[0.07] bg-gradient-to-b from-[#0F2044] to-[#08152e] p-6 shadow-[0_34px_70px_-28px_rgba(15,32,68,0.5)]"
    >
      <div className="flex items-center gap-1.5 border-b border-white/[0.08] pb-[18px] mb-5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#DC2626]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#D97706]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#6EE7B7]" />
        <span className="ml-auto font-mono text-[11px] tracking-wide text-white/40">brightcert / analysis</span>
      </div>

      <div className="grid gap-3.5 mb-[22px]">
        {ROWS.map((row, i) => (
          <div key={row.label} className="grid grid-cols-[150px_1fr_30px] items-center gap-3.5 font-mono text-[11.5px] text-white/65">
            <span>{row.label}</span>
            <span className="h-[5px] rounded-full bg-white/10 overflow-hidden">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-[#059669] to-[#6EE7B7] transition-[width] duration-[1200ms]"
                style={{
                  width: inView ? `${row.value}%` : "0%",
                  transitionDelay: `${i * 120}ms`,
                  transitionTimingFunction: "cubic-bezier(0.19,1,0.22,1)",
                }}
              />
            </span>
            <span className="text-right text-[#6EE7B7]">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-1.5 border-t border-dashed border-white/[0.12] pt-4">
        {LOG_LINES.map((line) => (
          <p
            key={line.text}
            className={`font-mono text-[11.5px] transition-all duration-500 ${line.ok ? "text-[#6EE7B7]" : "text-white/55"} ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5"
            }`}
            style={{ transitionDelay: `${line.delaySec}s` }}
          >
            {line.text}
          </p>
        ))}
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 -top-[20%] h-[20%] bg-gradient-to-b from-transparent via-[#6EE7B7]/[0.07] to-transparent"
        style={{ animation: inView ? "bc-scan-beam 4.5s ease-in-out infinite" : "none" }}
      />
    </div>
  );
}
