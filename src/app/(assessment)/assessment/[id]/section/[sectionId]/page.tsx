"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getQuestionsBySection, getSection, QUESTIONS, SECTIONS } from "@/lib/questions";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function QuestionPage({
  params,
}: {
  params: Promise<{ id: string; sectionId: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { id: assessmentId, sectionId: sectionIdParam } = use(params);
  const sectionId = parseInt(sectionIdParam, 10);
  const questionIndex = parseInt(searchParams.get("q") ?? "1", 10) - 1;

  const section = getSection(sectionId);
  const questions = getQuestionsBySection(sectionId);
  const question = questions[questionIndex];

  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [sectionAnswers, setSectionAnswers] = useState<Record<string, string>>({});
  const [whyOpen, setWhyOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sectionDone, setSectionDone] = useState<{
    target: string;
    completedCount: number;
    allDone: boolean;
  } | null>(null);

  // Auto-continue from the section-complete interstitial
  useEffect(() => {
    if (!sectionDone) return;
    const timer = setTimeout(() => router.push(sectionDone.target), 2600);
    return () => clearTimeout(timer);
  }, [sectionDone, router]);

  // Enter advances — 60 questions is a keyboard journey. The ref always
  // points at the latest handler so the listener can be mounted once.
  const enterActionRef = useRef<() => void>(() => {});
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Enter" || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const el = event.target as HTMLElement | null;
      if (el) {
        if (el.isContentEditable) return;
        const tag = el.tagName;
        // Let buttons, links, and disclosures keep their native Enter behaviour;
        // a focused radio is exactly the case Enter should advance from.
        if (/^(TEXTAREA|SELECT|BUTTON|A|SUMMARY)$/.test(tag)) return;
        if (tag === "INPUT" && (el as HTMLInputElement).type !== "radio") return;
      }
      event.preventDefault();
      enterActionRef.current();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Keep the Enter action current: on the interstitial it skips the wait,
  // otherwise it presses Continue (whose disabled state guards double-saves).
  useEffect(() => {
    enterActionRef.current = () => {
      if (sectionDone) {
        router.push(sectionDone.target);
        return;
      }
      document.getElementById("bc-continue")?.click();
    };
  });

  const questionKey = question?.key;

  // Reset per-question UI state during render when the question changes
  const [visibleKey, setVisibleKey] = useState(questionKey);
  if (visibleKey !== questionKey) {
    setVisibleKey(questionKey);
    setSelectedAnswer("");
    setWhyOpen(false);
    setHasError(false);
  }

  useEffect(() => {
    if (!questionKey) return;
    let cancelled = false;

    (async () => {
      // Try Supabase first, fall back to localStorage per question
      const supabase = createClient();
      const { data } = await supabase
        .from("responses")
        .select("question_key, answer")
        .eq("assessment_id", assessmentId)
        .eq("section_id", sectionId);

      const loaded: Record<string, string> = {};
      (data ?? []).forEach((row) => {
        loaded[row.question_key] = row.answer;
      });
      getQuestionsBySection(sectionId).forEach((q) => {
        if (!loaded[q.key]) {
          const saved = localStorage.getItem(`bc_${assessmentId}_${q.key}`);
          if (saved) loaded[q.key] = saved;
        }
      });

      if (cancelled) return;
      setSectionAnswers(loaded);
      setSelectedAnswer(loaded[questionKey] ?? "");
    })();

    return () => {
      cancelled = true;
    };
  }, [assessmentId, sectionId, questionKey]);

  if (!section || !question) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-[#64748B]">Question not found.</p>
        <Link href={`/assessment/${assessmentId}`} className="bc-focus text-sm text-[#047857] hover:underline mt-2 inline-block">
          Back to assessment
        </Link>
      </div>
    );
  }

  const totalInSection = questions.length;
  const currentNumber = questionIndex + 1;
  const isLast = questionIndex === totalInSection - 1;

  // GOV.UK-style running summary: earlier questions in this section, already answered
  const answeredSoFar = questions
    .map((q, index) => ({ question: q, index, answer: sectionAnswers[q.key] }))
    .filter((item) => item.index < questionIndex && item.answer);

  // GOV.UK "Change" behaviour: when this question was reached via a Change
  // link, ?return= carries where to jump back to after saving — instead of
  // forcing the user forward through questions they have already answered.
  const returnParam = searchParams.get("return");
  const returnTarget = (() => {
    if (returnParam === "check") return `/assessment/${assessmentId}/check-answers`;
    const match = /^([1-5])-(\d{1,2})$/.exec(returnParam ?? "");
    if (match) {
      const s = parseInt(match[1], 10);
      const q = parseInt(match[2], 10);
      if (q >= 1 && q <= getQuestionsBySection(s).length) {
        return `/assessment/${assessmentId}/section/${s}?q=${q}`;
      }
    }
    return null;
  })();

  const handleContinue = async () => {
    if (!selectedAnswer) {
      setHasError(true);
      return;
    }
    setHasError(false);
    setSaving(true);

    // Save to localStorage immediately for resilience
    localStorage.setItem(`bc_${assessmentId}_${question.key}`, selectedAnswer);

    // Save to Supabase
    const supabase = createClient();
    await supabase.from("responses").upsert({
      assessment_id: assessmentId,
      section_id: sectionId,
      question_key: question.key,
      answer: selectedAnswer,
    }, { onConflict: "assessment_id,question_key" });

    setSaving(false);

    if (returnTarget) {
      router.push(returnTarget);
    } else if (isLast) {
      // Section finished — celebrate, then return to the section list so the
      // user picks their next section. Only when every question across all
      // five sections is answered do we go straight to check-answers.
      const { data } = await supabase
        .from("responses")
        .select("question_key")
        .eq("assessment_id", assessmentId);

      const answeredKeys = new Set((data ?? []).map((row) => row.question_key));
      if (answeredKeys.size === 0) {
        // Anonymous flow — fall back to localStorage
        QUESTIONS.forEach((q) => {
          if (localStorage.getItem(`bc_${assessmentId}_${q.key}`)) answeredKeys.add(q.key);
        });
      }
      answeredKeys.add(question.key);

      const completedCount = SECTIONS.filter((s) =>
        getQuestionsBySection(s.id).every((q) => answeredKeys.has(q.key))
      ).length;
      const allDone = completedCount === SECTIONS.length;

      setSectionDone({
        target: allDone
          ? `/assessment/${assessmentId}/check-answers`
          : `/assessment/${assessmentId}`,
        completedCount,
        allDone,
      });
    } else {
      router.push(`/assessment/${assessmentId}/section/${sectionId}?q=${questionIndex + 2}`);
    }
  };

  const handleBack = () => {
    if (returnTarget) {
      // Came here via a Change link — Back cancels and returns without saving
      router.push(returnTarget);
      return;
    }
    if (questionIndex === 0) {
      if (sectionId > 1) {
        const prevQuestions = getQuestionsBySection(sectionId - 1);
        router.push(`/assessment/${assessmentId}/section/${sectionId - 1}?q=${prevQuestions.length}`);
      } else {
        router.push(`/assessment/${assessmentId}`);
      }
    } else {
      router.push(`/assessment/${assessmentId}/section/${sectionId}?q=${questionIndex}`);
    }
  };

  if (sectionDone) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center pt-10 text-center sm:pt-16">
        <div className="bc-pop grid h-20 w-20 place-items-center rounded-full bg-[#ECFDF5] ring-1 ring-[#A7F3D0]">
          <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 12.5l5 5L20 6.5"
              stroke="#047857"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="bc-check"
            />
          </svg>
        </div>

        <p className="bc-rise mt-7 text-xs font-semibold uppercase tracking-wider text-[#047857]" style={{ animationDelay: "0.25s" }}>
          Section {sectionId} complete
        </p>
        <h1 className="bc-rise mt-2 text-[26px] font-bold leading-tight tracking-tight text-[#0F2044] sm:text-3xl" style={{ animationDelay: "0.35s" }}>
          {section.title}
        </h1>
        <p className="bc-rise mt-3 text-sm text-[#64748B]" style={{ animationDelay: "0.45s" }}>
          {sectionDone.allDone
            ? "All five sections answered. Time to review and submit."
            : `${sectionDone.completedCount} of ${SECTIONS.length} sections complete.`}
        </p>

        <div className="bc-rise mt-8" style={{ animationDelay: "0.55s" }}>
          <Button asChild size="lg">
            <Link href={sectionDone.target}>
              {sectionDone.allDone ? "Check your answers" : "Choose your next section"}
            </Link>
          </Button>
          <p className="mt-4 text-xs text-[#64748B]">
            {sectionDone.allDone
              ? "Taking you to review automatically…"
              : "Taking you back to the section list automatically…"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={handleBack}
        className="bc-focus text-sm text-[#64748B] hover:text-[#0F2044] mb-8 inline-flex items-center gap-1 cursor-pointer"
      >
        ← Back
      </button>

      {/* GOV.UK-style caption above the question */}
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <p className="text-base text-[#64748B]">{section.title}</p>
        <p className="shrink-0 text-xs text-[#64748B]">
          Question {currentNumber} of {totalInSection}
        </p>
      </div>

      <h1 className="text-[28px] sm:text-[32px] font-bold text-[#0F2044] leading-tight tracking-tight mb-3">
        {question.text}
      </h1>
      {question.hint && (
        <p className="text-[15px] text-[#64748B] mb-6">{question.hint}</p>
      )}

      {hasError && (
        <p className="mb-5 border-l-4 border-[#DC2626] pl-3 text-sm font-semibold text-[#B91C1C]">
          Select an answer to continue
        </p>
      )}

      {/* Plain GOV.UK-style radios — no boxed option cards */}
      <div className="mb-8 mt-4 space-y-1" role="radiogroup" aria-label={question.text}>
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.value;
          return (
            <label
              key={option.value}
              className="group flex cursor-pointer items-center gap-3.5 py-2.5"
            >
              <input
                type="radio"
                name={question.key}
                value={option.value}
                checked={isSelected}
                onChange={() => {
                  setSelectedAnswer(option.value);
                  setHasError(false);
                }}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-[#047857] peer-focus-visible:ring-offset-2",
                  isSelected ? "border-[#047857]" : "border-[#94A3B8] group-hover:border-[#047857]"
                )}
                aria-hidden
              >
                {isSelected && <span className="h-3 w-3 rounded-full bg-[#047857]" />}
              </span>
              <span className="text-base text-[#0F2044]">{option.label}</span>
            </label>
          );
        })}
      </div>

      {/* Disclosure — GOV.UK "help with this question" pattern */}
      <div className="mb-8">
        <button
          onClick={() => setWhyOpen(!whyOpen)}
          className="bc-focus inline-flex items-center gap-1.5 text-sm font-medium text-[#047857] hover:underline cursor-pointer"
          aria-expanded={whyOpen}
        >
          {whyOpen ? (
            <ChevronUp className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
          )}
          Why we ask this
        </button>
        {whyOpen && (
          <p className="mt-3 border-l-4 border-[#E2E8F0] pl-4 text-sm leading-relaxed text-[#475569]">
            {question.whyWeAsk}
          </p>
        )}
      </div>

      <div className="flex items-baseline gap-3">
        <Button id="bc-continue" onClick={handleContinue} size="lg" className="min-w-[140px]" disabled={saving}>
          {saving ? "Saving…" : isLast && sectionId === 5 ? "Check your answers" : "Continue"}
        </Button>
        <p className="hidden text-xs text-[#64748B] sm:block" aria-hidden>
          or press{" "}
          <kbd className="rounded-[4px] border border-[#0F2044]/10 bg-white px-1.5 py-0.5 font-sans text-[11px] text-[#475569]">
            Enter ↵
          </kbd>
        </p>
      </div>

      {/* Your answers — GOV.UK-style running summary for this section */}
      {answeredSoFar.length > 0 && (
        <div className="mt-16 border-t border-[#E2E8F0] pt-8">
          <h2 className="mb-4 text-lg font-bold text-[#0F2044]">Your answers</h2>
          <dl className="divide-y divide-[#F1F5F9]">
            {answeredSoFar.map(({ question: q, index, answer }) => (
              <div key={q.key} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-1 py-3.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,200px)_auto]">
                <dt className="text-sm font-semibold leading-snug text-[#0F2044]">{q.text}</dt>
                <dd className="m-0 col-start-1 sm:col-start-2 text-sm text-[#475569]">
                  {q.options.find((o) => o.value === answer)?.label ?? answer}
                </dd>
                <dd className="m-0 col-start-2 row-start-1 sm:col-start-3 text-right">
                  <Link
                    href={`/assessment/${assessmentId}/section/${sectionId}?q=${index + 1}&return=${sectionId}-${currentNumber}`}
                    className="bc-focus text-sm font-medium text-[#047857] underline underline-offset-2 hover:no-underline"
                  >
                    Change<span className="sr-only"> answer to: {q.text}</span>
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
