import Link from "next/link";
import { Logo, LogoMark } from "@/components/brightcert/logo";
import { AssessmentProgress } from "@/components/brightcert/assessment-progress";

// Focused questionnaire chrome: no sidebar, no workspace nav — just brand,
// section progress, and a way out. Answers save on Continue, so exiting is safe.
export default async function AssessmentFocusLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <header className="sticky top-0 z-40 h-14 bg-white border-b border-[#E5EAF2] grid grid-cols-[1fr_auto_1fr] items-center px-4 md:px-6">
        <Link href="/dashboard" className="justify-self-start" aria-label="BrightCert dashboard">
          <span className="hidden sm:inline-flex">
            <Logo markClassName="h-7 w-7" textClassName="text-lg" />
          </span>
          <span className="sm:hidden inline-flex">
            <LogoMark className="h-7 w-7" />
          </span>
        </Link>

        <AssessmentProgress />

        <Link
          href={`/assessment/${id}`}
          className="justify-self-end inline-flex h-9 items-center whitespace-nowrap rounded-[8px] border border-[#E2E8F0] bg-white px-3 text-[13px] font-medium text-[#475569] hover:border-[#CBD5E1] hover:text-[#0F2044] transition-colors sm:px-3.5 sm:text-sm"
        >
          Save and exit
        </Link>
      </header>

      <main className="flex-1 px-4 py-10 md:py-14">
        <div className="mx-auto w-full max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
