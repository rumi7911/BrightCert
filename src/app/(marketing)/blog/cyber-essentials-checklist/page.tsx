import type { Metadata } from "next";
import { Download } from "lucide-react";
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
import checklistData from "@/lib/content/cyber-essentials-checklist.json";

// Word version of the checklist, hosted on Google Docs.
// The /export?format=docx form downloads the .docx directly; the /edit share
// link would open the Google Docs editor instead, which is not what the link
// text promises. Set this to "" to hide the download block entirely.
const CHECKLIST_DOCX_URL =
  "https://docs.google.com/document/d/1Wow3RkFaLNT8Krth2nSF_WHStAe3cQCyXGexPO745AU/export?format=docx";

const ARTICLE = ARTICLES.cyberEssentialsChecklist;

export const metadata: Metadata = metadataFor(ARTICLE);

type ChecklistGroup = {
  id: string;
  stage: string;
  purpose: string;
  items: { task: string; evidence: string }[];
};

const CHECKLIST: ChecklistGroup[] = checklistData;

const TOTAL_ITEMS = CHECKLIST.reduce((sum, group) => sum + group.items.length, 0);

const FAQS = [
  {
    q: "Is a Cyber Essentials checklist the same as the application?",
    a: "No. The application is the Danzell self-assessment, submitted through an IASME-licensed Certification Body. A checklist is preparation: it gets you to the point where answering the real questions is a matter of record rather than recall.",
  },
  {
    q: "What should we do first?",
    a: "Scope. Every other answer depends on which locations, devices, people and cloud services are inside the boundary. Working through the controls before scope is settled usually means doing part of it twice.",
  },
  {
    q: "How long does working through a checklist take?",
    a: "The checking is rarely the slow part. Gathering evidence is, because it means finding out things nobody has written down before, such as which cloud services are actually in use and whether MFA is enabled for everyone rather than administrators.",
  },
  {
    q: "Do we need evidence if it is a self-assessment?",
    a: "The self-assessment is answered on your word, but the answers still have to be true and you may be asked to support them. Recording evidence and an owner against each item is what turns a confident answer into a defensible one, and it makes next year's renewal considerably faster.",
  },
  {
    q: "Does completing this checklist mean we will pass?",
    a: "No. It means you will know where you stand before you apply, and you will not be discovering gaps partway through an application. The certification decision belongs to the Certification Body.",
  },
];

export default function CyberEssentialsChecklistPage() {
  return (
    <div className="bg-[#F3F4EC] print:bg-white">
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
      <div className="print:hidden">
        <ScrollProgress />
        <SignalNav />
      </div>

      <main className="pt-[150px] pb-24 print:pt-0 print:pb-0">
        <article>
          <div className="max-w-3xl mx-auto px-4">
            <div className="print:hidden">
              <ArticleHeader
                title={<>Cyber Essentials checklist for UK SMEs</>}
                article={ARTICLE}
                related={{ href: "/blog/what-is-cyber-essentials", label: "plain-English Cyber Essentials guide" }}
              />

              <ShortAnswer>
                A checklist is a preparation aid, not the certification application. The application itself is the
                Danzell self-assessment, submitted through an IASME-licensed Certification Body. What a checklist
                does is get you to the point where answering those questions is a matter of record rather than
                recall. Work through scope first, because every other answer depends on it.
              </ShortAnswer>

              <ArticleProse>
                <p className="mt-8 text-[#0F2044] font-medium">
                  Most Cyber Essentials preparation does not fail on a missing control. It fails because nobody can
                  show the control is in place, and the person who would know is on leave.
                </p>
              </ArticleProse>

              <section aria-labelledby="what-a-checklist-is">
                <ArticleProse>
                  <h2 id="what-a-checklist-is" className="pt-4 text-xl font-bold text-[#0F2044]">
                    What a checklist is for, and what it is not
                  </h2>
                  <p>
                    A checklist does not certify anything and it is not the application. Its job is narrower and more
                    useful than that: it converts a set of things you believe about your organisation into a set of
                    things you can show, each with a name against it and a date.
                  </p>
                  <p>
                    That is why the checklist below has an <strong>owner</strong> column and an{" "}
                    <strong>evidence</strong> column rather than a single tick box. A tick records that somebody felt
                    confident. An owner and a piece of evidence record something that survives that person being
                    unavailable, and it is the difference between a renewal that takes an afternoon next year and one
                    that starts from nothing again.
                  </p>
                </ArticleProse>
              </section>

              <section aria-labelledby="scope-first">
                <ArticleProse>
                  <h2 id="scope-first" className="pt-4 text-xl font-bold text-[#0F2044]">
                    Start with scope, because everything else inherits from it
                  </h2>
                  <p>
                    Scope decides which devices, people, locations and cloud services the other five sections apply
                    to. Settle it first and the rest is bounded work. Leave it until later and you will find yourself
                    redoing sections because a service or a device type turned out to be inside the boundary after
                    all.
                  </p>
                  <p>
                    Two things reliably get missed. Cloud services are one: the list held by whoever manages IT and
                    the list of services actually in use are rarely the same, because teams sign up for things
                    directly. Personally owned devices are the other, since scope covers remote workers and personal
                    devices that can access organisational data or services, not only the equipment the company
                    bought.
                  </p>
                  <p>
                    Both are covered in more detail in the{" "}
                    <a href="/blog/cyber-essentials-requirements" className="text-[#059669] underline hover:no-underline">
                      guide to what changed in requirements v3.3
                    </a>
                    .
                  </p>
                </ArticleProse>
              </section>

              <ArticleProse>
                <h2 id="the-checklist" className="pt-4 text-xl font-bold text-[#0F2044]">
                  The checklist
                </h2>
                <p>
                  {TOTAL_ITEMS} items across seven stages. Print it, or copy it into whatever you already use to
                  track work — the columns matter more than the format. Use your browser&rsquo;s print option
                  (<kbd className="rounded border border-[#0F2044]/20 bg-white px-1 text-xs">Ctrl</kbd>
                  {" / "}
                  <kbd className="rounded border border-[#0F2044]/20 bg-white px-1 text-xs">Cmd</kbd>
                  {" + "}
                  <kbd className="rounded border border-[#0F2044]/20 bg-white px-1 text-xs">P</kbd>) and everything
                  except the checklist itself drops away.
                </p>
              </ArticleProse>

              {CHECKLIST_DOCX_URL ? (
                <a
                  href={CHECKLIST_DOCX_URL}
                  target="_blank"
                  rel="noopener"
                  className="bc-focus mt-6 flex items-start gap-4 rounded-[16px] border border-[#A7F3D0] bg-[#ECFDF5] p-5 transition-colors hover:bg-[#DCFCE7]"
                >
                  <Download className="mt-0.5 h-5 w-5 shrink-0 text-[#059669]" strokeWidth={1.5} aria-hidden />
                  <span>
                    <span className="block font-display text-sm font-semibold text-[#065F46]">
                      Download the checklist as a Word document
                    </span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-[#047857]">
                      All {TOTAL_ITEMS} items with owner and status columns you can fill in and keep. Opens in a new
                      tab.
                    </span>
                  </span>
                </a>
              ) : null}
            </div>

            <section aria-labelledby="checklist-heading" className="mt-8 print:mt-0">
              <h2 id="checklist-heading" className="sr-only print:not-sr-only print:mb-1 print:text-lg print:font-bold">
                Cyber Essentials preparation checklist
              </h2>
              <p className="hidden print:block print:mb-4 print:text-xs print:text-black">
                Organisation: ____________________ · Completed by: ____________________ · Date:
                ____________________ · Source: brightcert.co.uk/blog/cyber-essentials-checklist
              </p>

              <div className="space-y-6 print:space-y-3">
                {CHECKLIST.map((group) => (
                  <div
                    key={group.id}
                    className="overflow-hidden rounded-[16px] border border-[#0F2044]/[0.08] bg-white print:break-inside-avoid print:rounded-none print:border-black/30"
                  >
                    <div className="border-b border-[#0F2044]/[0.08] bg-[#F8FAFC] p-4 print:p-2 print:bg-white">
                      <h3 className="font-display text-sm font-bold text-[#0F2044] print:text-xs">{group.stage}</h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-[#64748B] print:hidden">{group.purpose}</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px] border-collapse text-left text-sm print:min-w-0 print:text-[10px]">
                        <caption className="sr-only">{group.stage}: tasks, evidence, owner and status</caption>
                        <thead>
                          <tr className="border-b border-[#0F2044]/[0.06] text-[11px] uppercase tracking-wide text-[#94A3B8] print:text-[8px] print:text-black">
                            <th scope="col" className="p-3 font-semibold print:p-1">
                              Task
                            </th>
                            <th scope="col" className="p-3 font-semibold print:p-1">
                              Evidence to record
                            </th>
                            <th scope="col" className="w-28 p-3 font-semibold print:p-1">
                              Owner
                            </th>
                            <th scope="col" className="w-24 p-3 font-semibold print:p-1">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.items.map((item) => (
                            <tr
                              key={item.task}
                              className="border-t border-[#0F2044]/[0.06] align-top print:break-inside-avoid"
                            >
                              <th
                                scope="row"
                                className="p-3 text-[13px] font-medium leading-relaxed text-[#0F2044] print:p-1 print:text-[10px]"
                              >
                                {item.task}
                              </th>
                              <td className="p-3 text-[13px] leading-relaxed text-[#475569] print:p-1 print:text-[10px] print:text-black">
                                {item.evidence}
                              </td>
                              <td className="p-3 print:p-1">
                                <span className="block h-5 border-b border-dashed border-[#0F2044]/25" aria-hidden />
                                <span className="sr-only">To be completed</span>
                              </td>
                              <td className="p-3 print:p-1">
                                <span className="block h-5 border-b border-dashed border-[#0F2044]/25" aria-hidden />
                                <span className="sr-only">To be completed</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="print:hidden">
              <section aria-labelledby="evidence">
                <ArticleProse>
                  <h2 id="evidence" className="pt-10 text-xl font-bold text-[#0F2044]">
                    Collecting the evidence
                  </h2>
                  <p>
                    Evidence for Cyber Essentials does not mean a formal audit file. It means that for each claim
                    there is something more durable than memory: an exported list, a dated note of who confirmed a
                    setting, a policy document that states the rule you say you follow.
                  </p>
                  <p>
                    Three that are worth building properly, because they answer several questions at once and they
                    keep their value between renewals:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-[#0F2044]">A cloud service inventory.</strong>{" "}Which services, who
                      owns each one, whether the provider offers multi-factor authentication, and whether it is
                      enabled for all users rather than administrators.
                    </li>
                    <li>
                      <strong className="text-[#0F2044]">A software inventory with support status.</strong>{" "}Recording
                      the vendor end-of-life date alongside each entry answers the supported-software question and
                      warns you about the next thing due to fall out of support.
                    </li>
                    <li>
                      <strong className="text-[#0F2044]">A user access list.</strong>{" "}Role, whether the account is
                      administrative, and when access was last reviewed. This is also the artefact that makes the
                      leaver process demonstrable rather than described.
                    </li>
                  </ul>
                </ArticleProse>
              </section>

              <section aria-labelledby="final-review-section">
                <ArticleProse>
                  <h2 id="final-review-section" className="pt-4 text-xl font-bold text-[#0F2044]">
                    The final review is not a formality
                  </h2>
                  <p>
                    The last stage exists to catch a specific and common failure: answers that were true when they
                    were first written and quietly stopped being true. A supplier changed, a new device type
                    arrived, someone left. The answer still reads well and no longer describes the organisation.
                  </p>
                  <p>
                    It is also where you confirm you are working from the current question set. Applications started
                    from 27 April 2026 use the Danzell questions and v3.3 requirements, so anything drafted against
                    the older Willow set needs re-reading rather than reusing.
                  </p>
                </ArticleProse>
              </section>

              <ArticleFaqList items={FAQS} />

              <ArticleFinalCta prompt="Rather than filling this in from memory, answer the questions once and get a scored view of where the gaps are and which to fix first." />

              <ArticleRelatedLinks currentPath={ARTICLE.path} />

              <ArticleDisclaimer>
                <a
                  href="https://www.ncsc.gov.uk/cyberessentials/resources"
                  className="underline"
                  rel="nofollow noopener"
                  target="_blank"
                >
                  NCSC: Cyber Essentials resources
                </a>
                {" · "}
                <a href="https://iasme.co.uk/cyber-essentials/" className="underline" rel="nofollow noopener" target="_blank">
                  IASME: Cyber Essentials
                </a>
              </ArticleDisclaimer>
            </div>
          </div>
        </article>
      </main>

      <div className="print:hidden">
        <SignalFooter />
      </div>
    </div>
  );
}
