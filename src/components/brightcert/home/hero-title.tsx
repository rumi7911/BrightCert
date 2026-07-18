"use client";

import { useEffect, useState } from "react";

type Word = { text: string; type?: "highlight" | "underline" };

const WORDS: Word[] = [
  { text: "Get" },
  { text: "Cyber", type: "highlight" },
  { text: "Essentials", type: "highlight" },
  { text: "ready" },
  { text: "in" },
  { text: "2", type: "underline" },
  { text: "hours", type: "underline" },
];

// Per-word mask reveal for the hero H1. Each word (not each phrase) is its
// own atomic inline-block, so the browser can still wrap the heading
// naturally at word boundaries — wrapping a whole highlighted phrase as one
// block previously forced "Cyber Essentials" to break awkwardly mid-phrase
// onto its own two lines instead of flowing with the rest of the sentence.
export function HeroTitle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <h1 className="font-display text-[2.6rem] sm:text-[3.3rem] lg:text-[4.5rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[#0F2044] mb-6">
      {WORDS.map((word, i) => (
        <span
          key={`${word.text}-${i}`}
          className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em] mr-[0.28em]"
        >
          <span
            className={
              "inline-block whitespace-nowrap transition-transform duration-[1000ms] " +
              (word.type === "highlight"
                ? "rounded-[0.16em] bg-[#A7F3D0] px-[0.12em]"
                : word.type === "underline"
                  ? "bg-no-repeat [background-image:linear-gradient(#A7F3D0,#A7F3D0)] [background-size:100%_0.22em] [background-position:0_90%]"
                  : "")
            }
            style={{
              transform: mounted ? "none" : "translateY(112%)",
              transitionTimingFunction: "cubic-bezier(0.19,1,0.22,1)",
              transitionDelay: `${i * 55 + 150}ms`,
            }}
          >
            {word.text}
          </span>
        </span>
      ))}
    </h1>
  );
}
