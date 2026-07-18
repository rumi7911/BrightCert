"use client";

import { useEffect, useRef, useState } from "react";

export type RailStep = {
  num: string;
  title: string;
  body: string;
  tag: string;
  extra?: React.ReactNode;
};

// Scroll-driven progress rail alongside numbered steps: the rail fills as
// you scroll, and the currently-in-frame step highlights. Shared between the
// homepage's 4-step teaser and the dedicated /how-it-works page's 5 steps.
export function HowItWorksRail({ steps }: { steps: RailStep[] }) {
  const layoutRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [fillPct, setFillPct] = useState(0);
  const [activeSteps, setActiveSteps] = useState<boolean[]>(steps.map(() => false));
  const [revealedSteps, setRevealedSteps] = useState<boolean[]>(steps.map(() => false));

  useEffect(() => {
    const update = () => {
      const layout = layoutRef.current;
      if (!layout) return;
      const r = layout.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(Math.max((vh * 0.72 - r.top) / r.height, 0), 1);
      setFillPct(progress * 100);
      setActiveSteps(
        stepRefs.current.map((el) => {
          if (!el) return false;
          const sr = el.getBoundingClientRect();
          return sr.top < vh * 0.72 && sr.bottom > vh * 0.18;
        })
      );
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = stepRefs.current.findIndex((el) => el === entry.target);
          if (idx !== -1) {
            setRevealedSteps((prev) => {
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={layoutRef} className="grid grid-cols-[3px_1fr] gap-8 md:gap-14">
      <div className="relative rounded-[3px] bg-[#0F2044]/[0.08] overflow-hidden">
        <span
          className="absolute top-0 left-0 w-full rounded-[3px] bg-gradient-to-b from-[#059669] to-[#6EE7B7] transition-[height] duration-150 ease-linear"
          style={{ height: `${fillPct}%` }}
        />
      </div>
      <ol className="grid gap-6 md:gap-8">
        {steps.map((step, i) => (
          <li
            key={step.num}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            className={`grid grid-cols-1 sm:grid-cols-[74px_1fr] gap-4 sm:gap-8 items-start transition-all duration-700 ${
              revealedSteps[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span
              className={`font-display text-[2rem] sm:text-[2.9rem] font-bold leading-none tracking-[-0.03em] pt-[22px] transition-colors duration-500 ${
                activeSteps[i] ? "text-[#059669]" : "text-transparent"
              }`}
              style={{ WebkitTextStroke: activeSteps[i] ? "1.5px #059669" : "1.5px rgba(15,32,68,0.28)" }}
            >
              {step.num}
            </span>
            <div
              className={`rounded-[22px] border bg-white px-7 py-7 transition-all duration-500 ${
                activeSteps[i]
                  ? "border-[#059669]/[0.45] shadow-[0_20px_44px_-22px_rgba(15,32,68,0.22)] sm:translate-x-1.5"
                  : "border-[#0F2044]/[0.07]"
              }`}
            >
              <h3 className="font-display text-xl font-semibold tracking-[-0.015em] text-[#0F2044] mb-2">{step.title}</h3>
              <p className="text-[15px] text-[#475569] max-w-[60ch]">{step.body}</p>
              <span className="mt-4 inline-block rounded-full border border-[#059669]/[0.2] bg-[#059669]/[0.08] px-3 py-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-[#059669]">
                {step.tag}
              </span>
              {step.extra}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
