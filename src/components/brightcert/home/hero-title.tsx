import { Fragment } from "react";

type Word = { text: string; type?: "highlight" | "underline" };

const WORDS: Word[] = [
  { text: "Find" },
  { text: "out" },
  { text: "how" },
  { text: "ready", type: "highlight" },
  { text: "you" },
  { text: "are" },
  { text: "for" },
  { text: "Cyber" },
  { text: "Essentials" },
  { text: "in" },
  { text: "around", type: "underline" },
  { text: "2", type: "underline" },
  { text: "hours.", type: "underline" },
];

const HERO_TITLE = "Find out how ready you are for Cyber Essentials in around 2 hours.";

// Each word is its own atomic inline-block so the heading wraps naturally
// while preserving the highlighted and underlined treatments.
export function HeroTitle() {
  return (
    <h1
      aria-label={HERO_TITLE}
      className="font-display text-[2.6rem] sm:text-[3.3rem] lg:text-[4.5rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[#0F2044] mb-6"
    >
      {WORDS.map((word, i) => (
        <Fragment key={`${word.text}-${i}`}>
          <span
            className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]"
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
            >
              {word.text}
            </span>
          </span>
          {i < WORDS.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h1>
  );
}
