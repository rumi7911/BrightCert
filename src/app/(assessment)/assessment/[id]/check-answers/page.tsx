"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";
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

      sendGAEvent("event", "assessment_completed");
      router.push(`/assessment/${assessmentId}/results`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <Link href={`/assessment/${assessmentId}`} className="bc-focus text-sm text-[#64748B] hover:text-[#0F2044] mb-6 inline-flex items-center gap-1">
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

      {/* Answers by section — fixed answer column keeps the values in a scannable line */}
      <div className="space-y-8 mb-10">
        {SECTIONS.map((section) => {
          const sectionQuestions = QUESTIONS.filter((q) => q.sectionId === section.id);
          return (
            <div key={section.id}>
              <div className="mb-1 flex items-baseline justify-between">
                <h2 className="text-[13px] font-semibold text-[#0F2044]">
                  <b className="font-semibold">{section.id}.</b> {section.title}
                </h2>
              </div>
              <dl className="border-t border-[#EEF1F6]">
                {sectionQuestions.map((question) => {
                  const answer = answers[question.key];
                  const questionNumber = sectionQuestions.indexOf(question) + 1;
                  return (
                    <div
                      key={question.key}
                      className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-1 border-b border-[#F4F6FA] py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,200px)_auto]"
                    >
                      <dt className="text-[13px] leading-snug text-[#33405C]">{question.text}</dt>
                      {answer ? (
                        <>
                          <dd className="col-start-1 m-0 text-[13px] font-medium text-[#0F2044] sm:col-start-2">
                            {getAnswerLabel(question.key, answer)}
                          </dd>
                          <dd className="col-start-2 row-start-1 m-0 text-right sm:col-start-3">
                            <Link
                              href={`/assessment/${assessmentId}/section/${section.id}?q=${questionNumber}&return=check`}
                              className="bc-focus text-[13px] font-medium text-[#047857] underline underline-offset-2 hover:no-underline"
                            >
                              Change<span className="sr-only"> answer to: {question.text}</span>
                            </Link>
                          </dd>
                        </>
                      ) : (
                        <dd className="col-start-2 row-start-1 m-0 text-right sm:col-start-3">
                          <Link
                            href={`/assessment/${assessmentId}/section/${section.id}?q=${questionNumber}`}
                            className="bc-focus text-[13px] font-medium text-[#DC2626] hover:underline"
                          >
                            Not answered
                          </Link>
                        </dd>
                      )}
                    </div>
                  );
                })}
              </dl>
            </div>
          );
        })}
      </div>

      {/* Submit */}
      <div className="border-t border-[#EEF1F6] pt-6 mb-6">
        <h3 className="text-base font-semibold text-[#0F2044] mb-2">Submit your assessment</h3>
        <p className="text-sm text-[#64748B] mb-2">
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
