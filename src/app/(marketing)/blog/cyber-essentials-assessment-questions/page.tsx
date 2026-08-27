import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/brightcert/json-ld";
import { SignalNav } from "@/components/brightcert/signal-nav";
import { SignalFooter } from "@/components/brightcert/signal-footer";
import { ScrollProgress } from "@/components/brightcert/scroll-progress";
import {
  ArticleHeader,
  ArticleProse,
  ShortAnswer,
  ArticleFaqList,
  ArticleDisclaimer,
  ArticleFinalCta,
  ArticleRelatedLinks,
} from "@/components/brightcert/article-kit";
import { articleStructuredData, ARTICLES, metadataFor } from "@/lib/seo/registry";

const ARTICLE = ARTICLES.cyberEssentialsAssessmentQuestions;

export const metadata: Metadata = metadataFor(ARTICLE);

// Deliberately describes what each part of the self-assessment needs from you,
// never the official Danzell questions themselves. The third column is the
// point of the table: almost no part of the assessment is answerable by one
// person, which is the real reason preparation takes weeks.
const PREPARATION_ROWS: { part: string; needs: string; holder: string }[] = [
  {
    part: "Your organisation",
    needs:
      "The registered name exactly as it should appear on the certificate, the registered address, your employee count for the fee band, and the person senior enough to sign the declaration.",
    holder: "A director, or whoever files at Companies House",
  },
  {
    part: "Scope",
    needs:
      "A written description of what you are certifying — the whole organisation, or a clearly defined part of it — covering locations, networks, and the cloud services it touches.",
    holder: "Rarely one person: it needs the org chart and the IT estate together",
  },
  {
    part: "Devices",
    needs:
      "Every device type that reaches organisational data: laptops, desktops, servers, mobiles, tablets, and personally owned devices in scope. Operating system and version for each, and whether the vendor still supports it.",
    holder: "Your IT provider, or whoever hands out laptops",
  },
  {
    part: "Cloud services",
    needs:
      "The full list of cloud services actually in use, and for each one whether multi-factor authentication is offered and whether it is switched on for everybody who uses it.",
    holder:
      "Finance often knows more than IT here — unlisted subscriptions show up on the card statement",
  },
  {
    part: "Firewalls and the network boundary",
    needs:
      "What sits at each internet boundary, confirmation that default administrative passwords were changed, and a reason for every inbound rule that is open.",
    holder: "Your IT provider or managed service provider",
  },
  {
    part: "People and access",
    needs:
      "A current user list marking which accounts hold administrative rights, how those rights get approved, and your leaver process with a recent example of it actually running.",
    holder: "HR and IT together, which is why this one stalls",
  },
  {
    part: "Updates and malware protection",
    needs:
      "How you apply critical and high-risk security updates against the 14-day window, and which malware protection approach covers each device type.",
    holder: "Your IT provider",
  },
  {
    part: "Insurance",
    needs:
      "Your annual turnover figure. UK organisations turning over under £20 million are offered the included Cyber Liability Insurance, so the assessment asks.",
    holder: "Finance",
  },
];

const FAQS = [
  {
    q: "What is the Cyber Essentials self-assessment questionnaire?",
    a: "It is an online questionnaire completed by the organisation seeking certification and submitted through an IASME-licensed Certification Body, where an assessor marks it. It covers who you are, what you are putting in scope, and how you meet each of the five Cyber Essentials controls.",
  },
  {
    q: "Can I see the Cyber Essentials questions before I apply?",
    a: "Yes. IASME publishes a preview of the self-assessment questions on its own website, and reading it before you start is worth the time. This guide does not reproduce that question set — it explains what each part of the assessment needs from you so that you can gather it first.",
  },
  {
    q: "Which question set is current in 2026?",
    a: "Danzell. It replaced Willow on 27 April 2026, the same day Cyber Essentials requirements moved to v3.3. Answers written before that date were written against a different question set, which matters most at renewal.",
  },
  {
    q: "How long does the Cyber Essentials self-assessment take?",
    a: "Answering it is a matter of hours. Gathering the information the answers depend on is what takes most organisations weeks, because it sits with several different people and no single person can complete the form alone.",
  },
  {
    q: "What happens if the honest answer to a question is no?",
    a: "It is a gap to close, not a disqualification. The mistake that costs organisations time is answering yes for something that is planned rather than in place. The fee includes one free resubmission if you do not pass first time, so an optimistic answer spends that correction on a gap you already knew about, and leaves nothing in hand for one you did not.",
  },
  {
    q: "Does BrightCert submit the self-assessment for me?",
    a: "No. The self-assessment is submitted through an IASME-licensed Certification Body, which is who issues the certificate. BrightCert assesses your readiness beforehand, scores it, and shows you which gaps to close first.",
  },
];

export default function CyberEssentialsAssessmentQuestionsPage() {
  return (
    <div className="bg-[#F3F4EC]">
      <JsonLd data={articleStructuredData(ARTICLE)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
      <ScrollProgress />
      <SignalNav />

      <main className="pt-[150px] pb-24">
        <article>
          <div className="max-w-3xl mx-auto px-4">
            <ArticleHeader
              title={<>Cyber Essentials self-assessment questions: what to prepare</>}
              article={ARTICLE}
              related={{ href: "/blog/what-is-cyber-essentials", label: "plain-English Cyber Essentials guide" }}
            />

            <ShortAnswer>
              The Cyber Essentials self-assessment is an online questionnaire you complete and submit through an
              IASME-licensed Certification Body, where an assessor marks it. Since{" "}
              <time dateTime="2026-04-27">27 April 2026</time> it uses the <strong>Danzell</strong> question set. It
              asks who you are, what you are putting in scope, and how you meet each of the five controls. Answering
              it takes hours; gathering what the answers depend on is the part that takes weeks, so the useful move
              is to collect that information before you open the form.
            </ShortAnswer>

            <ArticleProse>
              <p className="mt-8 text-[#0F2044] font-medium">
                Almost everybody searching for the Cyber Essentials questionnaire wants the same thing: to know what
                they are walking into. That is a reasonable instinct, and the answer is slightly different from the
                one people expect. The questions are not the hard part. Being able to answer them is.
              </p>
            </ArticleProse>

            <section aria-labelledby="what-it-is">
              <ArticleProse>
                <h2 id="what-it-is" className="pt-4 text-xl font-bold text-[#0F2044]">
                  What the self-assessment actually is
                </h2>
                <p>
                  Cyber Essentials is a self-assessed certification. You answer the questionnaire yourself, and a
                  qualified assessor at an IASME-licensed Certification Body marks your answers against the
                  requirements. There is no audit of your systems at this level — that is Cyber Essentials Plus,
                  which adds an independent technical audit on top of the same self-assessment.
                </p>
                <p>
                  Two things follow from that. Your answers are taken at face value, so they need to describe what
                  is genuinely in place. And because they are marked rather than negotiated, an answer that does not
                  meet the requirement comes back for correction, which costs you time you had not planned for.
                </p>
                <p>
                  Since <time dateTime="2026-04-27">27 April 2026</time> the question set is called{" "}
                  <strong>Danzell</strong>, replacing Willow, and the underlying requirements are{" "}
                  <Link href="/blog/cyber-essentials-requirements" className="text-[#047857] underline hover:no-underline">
                    v3.3
                  </Link>
                  . If you are renewing and reaching for last year&rsquo;s saved answers, that date is the one to
                  check first.
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="preparation-table">
              <ArticleProse>
                <h2 id="preparation-table" className="pt-4 text-xl font-bold text-[#0F2044]">
                  What each part asks about, and who in your business holds the answer
                </h2>
                <p>
                  The table below maps the assessment to the information it needs from you. The third column is the
                  one worth reading closely. Preparation is usually described as a technical task, but look at where
                  the answers actually live: a director, an IT provider, HR, finance. That is the real reason a
                  questionnaire you could answer in an afternoon takes a fortnight.
                </p>
              </ArticleProse>

              <div className="mt-6 overflow-x-auto rounded-[16px] border border-[#0F2044]/[0.08] bg-white">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Each part of the Cyber Essentials self-assessment, the information it needs from a UK SME, and
                    who in the business typically holds it
                  </caption>
                  <thead>
                    <tr className="border-b border-[#0F2044]/[0.08] bg-[#F8FAFC]">
                      <th scope="col" className="p-4 font-display text-[13px] font-semibold text-[#0F2044]">
                        Part of the assessment
                      </th>
                      <th scope="col" className="p-4 font-display text-[13px] font-semibold text-[#0F2044]">
                        What it needs from you
                      </th>
                      <th scope="col" className="p-4 font-display text-[13px] font-semibold text-[#0F2044]">
                        Who usually holds it
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PREPARATION_ROWS.map((row) => (
                      <tr key={row.part} className="border-t border-[#0F2044]/[0.06] align-top">
                        <th
                          scope="row"
                          className="p-4 font-display text-[13px] font-semibold text-[#0F2044] whitespace-normal"
                        >
                          {row.part}
                        </th>
                        <td className="p-4 leading-relaxed text-[#475569]">{row.needs}</td>
                        <td className="p-4 leading-relaxed text-[#475569]">{row.holder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ArticleProse>
                <p className="mt-6">
                  If you want this as something to work through and tick off, the{" "}
                  <Link href="/blog/cyber-essentials-checklist" className="text-[#047857] underline hover:no-underline">
                    Cyber Essentials checklist
                  </Link>{" "}
                  covers the same ground as a printable list with owner and status columns.
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="good-answers">
              <ArticleProse>
                <h2 id="good-answers" className="pt-4 text-xl font-bold text-[#0F2044]">
                  What separates an answer that passes from one that comes back
                </h2>
                <p>
                  Assessors are not looking for polished writing. They are checking whether the arrangement you
                  describe meets the requirement, for everybody it needs to cover. Four things distinguish answers
                  that clear that bar:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-[#0F2044]">It covers everyone, not the case you thought of first.</strong>{" "}
                    &ldquo;We have multi-factor authentication&rdquo; and &ldquo;multi-factor authentication is
                    enabled for every user of this service&rdquo; are different statements, and only the second one
                    answers the question. The same gap appears with devices: the answer describes the company
                    laptops and quietly omits the two people using their own.
                  </li>
                  <li>
                    <strong className="text-[#0F2044]">It describes today, not the plan.</strong> Work that is
                    scheduled for next month is not in place. Answering as though it were converts a gap you could
                    have closed into a correction after marking.
                  </li>
                  <li>
                    <strong className="text-[#0F2044]">It is specific about the arrangement.</strong> &ldquo;We
                    patch regularly&rdquo; does not engage with the requirement; &ldquo;critical and high-risk
                    updates are applied within 14 days, checked monthly by our IT provider&rdquo; does.
                  </li>
                  <li>
                    <strong className="text-[#0F2044]">Somebody could check it.</strong> If the answer rests on
                    memory rather than a list, a setting or a record, it will not survive the follow-up question.
                  </li>
                </ul>
              </ArticleProse>
            </section>

            <section aria-labelledby="answering-no">
              <ArticleProse>
                <h2 id="answering-no" className="pt-4 text-xl font-bold text-[#0F2044]">
                  When the honest answer is no
                </h2>
                <p>
                  Every organisation preparing for the first time finds something it does not yet do. That is what
                  preparation is for, and finding it before submission is the good outcome rather than the bad one.
                </p>
                <p>
                  The temptation is to answer optimistically — to say yes because the fix is easy and somebody will
                  get to it. It rarely works out cheaper, and there is a specific reason why. The certification fee
                  includes <strong>one free resubmission</strong> if you do not pass first time. After that, another
                  failed attempt means paying the fee again.
                </p>
                <p>
                  So an optimistic answer is not free. It spends the one correction you were given, on something you
                  already knew about, and leaves you with none in hand for the thing you genuinely missed. Close the
                  gap, then answer yes. If closing it will take longer than the time you have, that is a scheduling
                  conversation, not a wording one.
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="where-people-stall">
              <ArticleProse>
                <h2 id="where-people-stall" className="pt-4 text-xl font-bold text-[#0F2044]">
                  Where preparation usually stalls
                </h2>
                <p>
                  Across the five controls, the same four things account for most of the delay. None of them are
                  difficult. All of them take longer than a day because they need somebody else.
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong className="text-[#0F2044]">The cloud services list.</strong> The list held by whoever
                    manages IT and the list of services actually in use are almost never the same. Departmental
                    sign-ups, tools attached to a personal login, and anything inherited from a previous supplier
                    all belong on it.
                  </li>
                  <li>
                    <strong className="text-[#0F2044]">Personally owned devices.</strong> A personal phone used to
                    check work email is in scope for the controls that apply to it. Deciding that personal devices
                    may not reach organisational data is a legitimate answer — provided it is genuinely enforced
                    rather than merely stated.
                  </li>
                  <li>
                    <strong className="text-[#0F2044]">The leaver process.</strong> Most organisations have one.
                    Fewer can point to it running for the last person who left, which is the form the question
                    effectively takes.
                  </li>
                  <li>
                    <strong className="text-[#0F2044]">Software past end of life.</strong> This one cannot be
                    patched into compliance, because the updates no longer exist. It needs replacing or removing
                    from scope, and both take planning.
                  </li>
                </ol>
              </ArticleProse>
            </section>

            <section aria-labelledby="why-not-the-questions">
              <ArticleProse>
                <h2 id="why-not-the-questions" className="pt-4 text-xl font-bold text-[#0F2044]">
                  Why this guide does not list the questions
                </h2>
                <p>
                  The Danzell question set belongs to IASME, and it is not ours to republish. IASME publishes its
                  own preview of the self-assessment questions, linked at the foot of this page, and that preview is
                  the version that stays current when the question set changes — as it did on 27 April 2026.
                </p>
                <p>
                  There is a practical reason as well as a licensing one. A copied question list goes stale the day
                  the set is updated, and a business preparing against a stale copy is doing the one thing this
                  guide exists to prevent. What does not go stale is the information you need to have gathered, and
                  who in your organisation holds it.
                </p>
              </ArticleProse>
            </section>

            <ArticleFaqList items={FAQS} />

            <ArticleFinalCta prompt="Answer 60 plain-English questions about your organisation and see where the gaps are before you open the official self-assessment." />

            <ArticleRelatedLinks currentPath={ARTICLE.path} />

            <ArticleDisclaimer>
              <a
                href="https://iasme.co.uk/cyber-essentials/preview-the-self-assessment-questions-for-cyber-essentials/"
                className="underline"
                rel="nofollow noopener"
                target="_blank"
              >
                IASME: preview the self-assessment questions
              </a>
              {" · "}
              <a href="https://www.ncsc.gov.uk/cyberessentials/resources" className="underline" rel="nofollow noopener" target="_blank">
                NCSC: Cyber Essentials resources
              </a>
            </ArticleDisclaimer>
          </div>
        </article>
      </main>

      <SignalFooter />
    </div>
  );
}
