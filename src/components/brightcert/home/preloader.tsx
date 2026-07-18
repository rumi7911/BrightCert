"use client";

import { useEffect, useState } from "react";

// Homepage-only entrance overlay. Removes itself after window load (or a
// safety timeout) so it never blocks first paint on slow connections.
export function Preloader() {
  const [done, setDone] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setRemoved(true));
      return () => cancelAnimationFrame(id);
    }

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setDone(true);
      setTimeout(() => setRemoved(true), 1100);
    };
    const onLoad = () => setTimeout(finish, 900);

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);

    const safety = setTimeout(finish, 3200);
    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(safety);
    };
  }, []);

  if (removed) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-[#0F2044] to-[#08152e] transition-transform duration-[900ms] ${done ? "-translate-y-full" : ""}`}
      style={{ transitionTimingFunction: "cubic-bezier(0.19,1,0.22,1)" }}
    >
      <div className="flex flex-col items-center gap-[18px]">
        <svg viewBox="0 0 64 64" width="72" height="72" aria-hidden>
          <rect width="64" height="64" rx="16" fill="#059669" />
          <path
            d="M18 33.5 28 43 46 22"
            fill="none"
            stroke="#0F2044"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 44,
              strokeDashoffset: 44,
              animation: "bc-preloader-check 0.7s 0.25s cubic-bezier(0.22,0.61,0.36,1) forwards",
            }}
          />
        </svg>
        <span
          className="font-display text-xl font-semibold text-white opacity-0 translate-y-2"
          style={{ animation: "bc-preloader-word 0.6s 0.55s cubic-bezier(0.22,0.61,0.36,1) forwards" }}
        >
          Bright<span className="text-[#6EE7B7]">Cert</span>
        </span>
      </div>
    </div>
  );
}
