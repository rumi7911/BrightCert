"use client";

import { useEffect, useRef, useState } from "react";
import { getScoreColor, getOverallStatus, SCORE_STATUS_MAP } from "@/types/assessment";

type ScoreCircleProps = {
  score: number;
  size?: "sm" | "md" | "lg";
};

const SIZE_CONFIG = {
  sm: { dim: 80, stroke: 6, textSize: "text-xl" },
  md: { dim: 112, stroke: 8, textSize: "text-2xl" },
  lg: { dim: 144, stroke: 10, textSize: "text-3xl" },
};

// Cubic ease-out — quick start, gentle settle.
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function ScoreCircle({ score, size = "md" }: ScoreCircleProps) {
  const config = SIZE_CONFIG[size];
  const { dim, stroke } = config;
  const radius = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Already in view on mount (above the fold): start at once instead of
    // waiting for the observer — otherwise the circle briefly shows 0%.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduceMotion ? 0 : 900;
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      setDisplayScore(Math.round(easeOutCubic(t) * score));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, score]);

  const offset = circumference - (displayScore / 100) * circumference;
  const color = getScoreColor(score);
  const status = getOverallStatus(score);
  const { label } = SCORE_STATUS_MAP[status];

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg
          width={dim}
          height={dim}
          style={{ transform: "rotate(-90deg)" }}
          viewBox={`0 0 ${dim} ${dim}`}
        >
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={stroke}
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke 300ms ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-bold leading-none tabular-nums ${config.textSize}`}
            style={{ color }}
          >
            {displayScore}%
          </span>
        </div>
      </div>
      <span
        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
        style={{
          color: SCORE_STATUS_MAP[status].color,
          backgroundColor: SCORE_STATUS_MAP[status].bgColor,
        }}
      >
        {label}
      </span>
    </div>
  );
}
