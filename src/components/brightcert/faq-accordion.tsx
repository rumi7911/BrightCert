"use client";

import { useState } from "react";

export type FaqItem = { q: string; a: string };

// Single-open accordion. Shared between the homepage's 6-item FAQ teaser and
// the dedicated /faq page's full list.
export function FaqAccordion({ items, defaultOpenIndex = 0 }: { items: FaqItem[]; defaultOpenIndex?: number | null }) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div className="border-t border-[#0F2044]/[0.12]">
      {items.map((item, i) => {
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
