export type SectionId = 1 | 2 | 3 | 4 | 5;

export type AnswerOption = {
  value: string;
  label: string;
};

export type Question = {
  key: string;
  sectionId: SectionId;
  text: string;
  hint?: string;
  whyWeAsk: string;
  type: "radio" | "checkbox" | "select";
  options: AnswerOption[];
  skipIf?: (answers: Record<string, string>) => boolean;
};

export type Section = {
  id: SectionId;
  title: string;
  shortTitle: string;
  description: string;
};

export type AssessmentDraft = {
  assessmentId: string;
  answers: Record<string, string>;
  completedSections: SectionId[];
};
