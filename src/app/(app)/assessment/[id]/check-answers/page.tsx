"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SECTIONS, QUESTIONS } from "@/lib/questions";
import { createClient } from "@/lib/supabase/client";
import { use } from "react";

export default function CheckAnswersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: assessmentId } = use(params);
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadAnswers() {
      const supabase = createClient();
      const { data } = await supabase
        .from("responses")
        .select("question_key, answer")
        .eq("assessment_id", assessmentId);

      const loaded: Record<string, string> = {};
      if (data?.length) {
        data.forEach((r) => { loaded[r.question_key] = r.answer; });
      } else {
        // Fall back to localStorage
        QUESTIONS.forEach((q) => {
          const saved = localStorage.getItem(`bc_${assessmentId}_${q.key}`);
          if (saved) loaded[q.key] = saved;
        });
      }
      setAnswers(loaded);
    }
    loadAnswers();
  }, [assessmentId]);

  const getAnswerLabel = (questionKey: string, value: string): string => {
    const question = QUESTIONS.find((q) => q.key === questionKey);
    if (!question) return value;
    return question.options.find((o) => o.value === value)?.label ?? value;
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = QUESTIONS.length;
  const allAnswered = answeredCount === totalQuestions;

  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/assessment/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Analysis failed. Please try again.");
      }

      router.push(`/assessment/${assessmentId}/results`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <Link href={`/assessment/${assessmentId}`} className="text-sm text-[#64748B] hover:text-[#0F2044] mb-6 inline-flex items-center gap-1">
        ← Back to task list
      </Link>

      <h1 className="text-2xl font-bold text-[#0F2044] mb-1 mt-4">Check your answers</h1>
      <p className="text-sm text-[#64748B] mb-8">
        Review your responses before submitting. You can change any answer by clicking the &ldquo;Change&rdquo; link.
      </p>

      {!allAnswered && (
        <div className="rounded-[8px] border border-[#FDE68A] bg-[#FFFBEB] p-4 mb-6">
          <p className="text-sm text-[#92400E]">
            <strong>{totalQuestions - answeredCount} questions</strong> have not been answered yet. Complete all sections before submitting.
          </p>
        </div>
      )}

      {/* Answers by section */}
      <div className="space-y-8 mb-10">
        {SECTIONS.map((section) => {
          const sectionQuestions = QUESTIONS.filter((q) => q.sectionId === section.id);
          return (
            <div key={section.id}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-[#0F2044]">{section.title}</h2>
                <Link
                  href={`/assessment/${assessmentId}/section/${section.id}?q=1`}
                  className="text-sm text-[#047857] hover:underline flex items-center gap-1"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Change
                </Link>
              </div>
              <div className="rounded-[12px] border border-[#E2E8F0] bg-white divide-y divide-[#F1F5F9]">
                {sectionQuestions.map((question) => {
                  const answer = answers[question.key];
                  return (
                    <div key={question.key} className="flex items-start justify-between gap-4 px-5 py-4">
                      <p className="text-sm text-[#475569] flex-1">{question.text}</p>
                      <div className="text-right shrink-0">
                        {answer ? (
                          <p className="text-sm font-medium text-[#0F2044]">
                            {getAnswerLabel(question.key, answer)}
                          </p>
                        ) : (
                          <Link
                            href={`/assessment/${assessmentId}/section/${section.id}?q=${sectionQuestions.indexOf(question) + 1}`}
                            className="text-sm text-[#DC2626] hover:underline"
                          >
                            Not answered
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit */}
      <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-6 mb-6">
        <h3 className="text-base font-semibold text-[#0F2044] mb-2">Submit your assessment</h3>
        <p className="text-sm text-[#64748B] mb-5">
          By submitting, BrightCert will analyse your responses across the five Cyber Essentials control areas and generate your readiness score.
        </p>
        <p className="text-xs text-[#64748B] mb-5">
          You can unlock the full readiness report for £199 after reviewing your score.
        </p>
        {submitError && (
          <p className="text-sm text-[#DC2626] mb-4">{submitError}</p>
        )}
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          size="lg"
          className="w-full sm:w-auto"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Analysing your responses…
            </>
          ) : (
            "Submit Assessment"
          )}
        </Button>
        {submitting && (
          <p className="text-xs text-[#64748B] mt-3">
            Our AI is reviewing all five control areas. This takes around 15–30 seconds.
          </p>
        )}
      </div>
    </div>
  );
}
