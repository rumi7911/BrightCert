"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getQuestionsBySection, getSection } from "@/lib/questions";
import { cn } from "@/lib/utils";

// Async params are awaited at the page level in Next.js 16
// This must be a client component to use useSearchParams
export default function QuestionPage({
  params,
}: {
  params: { id: string; sectionId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const assessmentId = params.id;
  const sectionId = parseInt(params.sectionId, 10);
  const questionIndex = parseInt(searchParams.get("q") ?? "1", 10) - 1;

  const section = getSection(sectionId);
  const questions = getQuestionsBySection(sectionId);
  const question = questions[questionIndex];

  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [whyOpen, setWhyOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Load saved answer from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`bc_${assessmentId}_${question?.key}`);
    if (saved) setSelectedAnswer(saved);
  }, [assessmentId, question?.key]);

  if (!section || !question) {
    return (
      <div className="max-w-2xl">
        <p className="text-sm text-[#64748B]">Question not found.</p>
        <Link href={`/assessment/${assessmentId}`} className="text-sm text-[#047857] hover:underline mt-2 inline-block">
          Back to assessment
        </Link>
      </div>
    );
  }

  const totalInSection = questions.length;
  const currentNumber = questionIndex + 1;
  const isLast = questionIndex === totalInSection - 1;

  const handleContinue = () => {
    if (!selectedAnswer) {
      setHasError(true);
      return;
    }
    setHasError(false);

    // Save to localStorage (migrated to Supabase in Phase 2)
    localStorage.setItem(`bc_${assessmentId}_${question.key}`, selectedAnswer);

    if (isLast) {
      // Move to next section or check answers
      if (sectionId < 5) {
        router.push(`/assessment/${assessmentId}/section/${sectionId + 1}?q=1`);
      } else {
        router.push(`/assessment/${assessmentId}/check-answers`);
      }
    } else {
      router.push(`/assessment/${assessmentId}/section/${sectionId}?q=${questionIndex + 2}`);
    }
  };

  const handleBack = () => {
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

  return (
    <div className="max-w-2xl">
      {/* Back link */}
      <button
        onClick={handleBack}
        className="text-sm text-[#64748B] hover:text-[#0F2044] mb-8 inline-flex items-center gap-1"
      >
        ← Back
      </button>

      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-semibold text-[#047857] uppercase tracking-wider">
          {section.title}
        </p>
        <p className="text-xs text-[#64748B]">
          Question {currentNumber} of {totalInSection}
        </p>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F2044] mb-2 leading-snug">
          {question.text}
        </h1>
        {question.hint && (
          <p className="text-sm text-[#64748B]">{question.hint}</p>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <div className="rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] p-3 mb-4">
          <p className="text-sm text-[#B91C1C] font-medium">Select an answer to continue</p>
        </div>
      )}

      {/* Answer options */}
      <div className="space-y-2 mb-8" role="radiogroup" aria-labelledby="question-label">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex items-center gap-3 p-4 rounded-[8px] border cursor-pointer transition-all",
                isSelected
                  ? "border-[#047857] bg-[#ECFDF5] ring-2 ring-[#047857]/20"
                  : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
              )}
            >
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  isSelected ? "border-[#047857]" : "border-[#CBD5E1]"
                )}
              >
                {isSelected && (
                  <div className="h-2.5 w-2.5 rounded-full bg-[#047857]" />
                )}
              </div>
              <input
                type="radio"
                name={question.key}
                value={option.value}
                checked={isSelected}
                onChange={() => {
                  setSelectedAnswer(option.value);
                  setHasError(false);
                }}
                className="sr-only"
              />
              <span className="text-sm text-[#0F2044]">{option.label}</span>
            </label>
          );
        })}
      </div>

      {/* Why we ask — collapsible */}
      <div className="rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] mb-8 overflow-hidden">
        <button
          onClick={() => setWhyOpen(!whyOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm text-[#475569] hover:bg-[#F1F5F9] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-[#64748B]" strokeWidth={1.5} />
            <span className="font-medium">Why we ask this</span>
          </div>
          {whyOpen ? (
            <ChevronUp className="h-4 w-4 text-[#94A3B8]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#94A3B8]" />
          )}
        </button>
        {whyOpen && (
          <div className="px-4 pb-4 pt-1">
            <p className="text-sm text-[#475569] leading-relaxed">{question.whyWeAsk}</p>
          </div>
        )}
      </div>

      {/* Continue button */}
      <div className="flex gap-3">
        <Button onClick={handleContinue} size="lg" className="min-w-[140px]">
          {isLast && sectionId === 5 ? "Check your answers" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
