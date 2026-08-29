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

const ARTICLE = ARTICLES.cyberEssentialsPlusPreparation;

export const metadata: Metadata = metadataFor(ARTICLE);

// Preparation is shaped by a calendar, not a checklist, because two of the
// constraints are time windows rather than settings: patching is judged on how
// long a fix has been available, and replacing unsupported software takes
// weeks. The table below is therefore ordered by when the work has to start,
// with owner and status columns left blank so a reader can print it and use it.
type PrepStage = {
  id: string;
  when: string;
  why: string;
  items: { task: string; audit: string; evidence: string }[];
};

const PREP: PrepStage[] = [
  {
    id: "four-weeks",
    when: "Four weeks out",
    why:
      "Everything here can force a purchase, a migration or a scope change. None of it can be fixed in the week before the audit, which is the only reason it sits this far out.",
    items: [
      {
        task: "Settle the scope boundary and write it down",
        audit:
          "Scope decides which devices, users and cloud services are eligible for sampling. The assessor tests against the boundary you declared, not the one you meant.",
        evidence: "A dated scope description listing sites, device types, operating systems, cloud services and remote workers.",
      },
      {
        task: "Find every piece of unsupported software",
        audit:
          "Software past its vendor support date cannot receive fixes, so it cannot pass the patching test. There is no compensating-control conversation available.",
        evidence: "An inventory of operating systems and applications with each vendor's end-of-support date against it.",
      },
      {
        task: "List the cloud services actually in use",
        audit:
          "Every in-scope cloud service is tested with at least one standard and one administrative account. Services nobody remembered are found during scoping or during the audit; one of those is cheaper.",
        evidence: "A service list reconciled against expenses or card statements, not against memory.",
      },
      {
        task: "Confirm MFA is on for everyone, not just administrators",
        audit:
          "The MFA test signs in as a standard user and as an administrator from an untrusted device, and watches for the prompt. A standard account without MFA fails it.",
        evidence: "A per-service export showing enrolment across all accounts, including shared and service accounts.",
      },
    ],
  },
  {
    id: "two-weeks",
    when: "Two weeks out",
    why:
      "This is when the patching window opens. A fix released more than fourteen days before the audit and not applied is a fail, so the fortnight before the date is the one that is actually assessed.",
    items: [
      {
        task: "Patch every in-scope device, including the ones nobody uses",
        audit:
          "The authenticated scan checks each sampled device for missing fixes rated critical or high by the vendor, scoring CVSS v3 7.0 or above, or shipped with no vendor detail at all.",
        evidence: "A patch report per device with dates, covering laptops in drawers and machines belonging to people on leave.",
      },
      {
        task: "Prove the update process reaches the whole estate",
        audit:
          "Since April 2026 a retest rechecks the original sample and a new random sample. A fix applied only to the devices that failed is the approach most likely to fail twice.",
        evidence: "Coverage figures from the update tool: devices enrolled versus devices in scope, with the difference explained.",
      },
      {
        task: "Check malware protection on the devices people really use",
        audit:
          "Inert test files are sent to a working mailbox and offered from a website while the assessor observes a normal user trying to open them.",
        evidence: "Confirmation that protection is active, current and not disabled on any sampled device.",
      },
      {
        task: "Agree the external IP addresses in scope",
        audit: "The remote vulnerability assessment scans the addresses you supply. A missing address is a gap; a wrong one wastes the slot.",
        evidence: "A confirmed address list shared with the Certification Body ahead of the day.",
      },
    ],
  },
  {
    id: "one-week",
    when: "One week out",
    why:
      "Three of the five test cases involve the assessor watching one of your staff. From here the constraint stops being technical and becomes a diary.",
    items: [
      {
        task: "Identify who is likely to be sampled, and check they are here",
        audit:
          "The malware and account-separation tests need the person who normally uses the device, signed in as themselves. An administrator standing in does not demonstrate what a standard user experiences.",
        evidence: "Named people against sampled device types, with annual leave checked.",
      },
      {
        task: "Tell those people what will be asked of them",
        audit: "They will be asked to open a file that their protection should block, while someone watches. It goes better when it is expected.",
        evidence: "A short briefing note, sent in advance.",
      },
      {
        task: "Prepare scan credentials for each sampled device",
        audit: "The patching test is a credentialed scan. Without a working login the device cannot be assessed.",
        evidence: "Accounts created and tested on each device type in scope.",
      },
      {
        task: "Finalise the verified self-assessment",
        audit:
          "As of the April 2026 update the self-assessment must be complete, verified and unchanged before Plus testing begins. Answers cannot be revised once the audit starts.",
        evidence: "Confirmation from the Certification Body that the submission is locked.",
      },
    ],
  },
  {
    id: "day-before",
    when: "The day before",
    why: "Short, and entirely about availability. Most audits that lose time lose it here rather than on a control.",
    items: [
      {
        task: "Switch on and connect every device in the sample",
        audit: "A device that is off or unreachable cannot be tested, and the slot is still consumed.",
        evidence: "A confirmation from each device owner.",
      },
      {
        task: "Check the standard and administrative accounts still work",
        audit: "Expired passwords and disabled test accounts are the most common avoidable delay on the day.",
        evidence: "A successful sign-in on each in-scope cloud service, from an untrusted device.",
      },
    ],
  },
];

const TOTAL_PREP_ITEMS = PREP.reduce((sum, stage) => sum + stage.items.length, 0);

const FAQS = [
  {
    q: "How long does it take to prepare for a Cyber Essentials Plus assessment?",
    a: "Plan for about four weeks if your controls are already in reasonable shape. The technical checking is quick; what takes time is replacing unsupported software, enrolling every account in MFA rather than just administrators, and getting the right people free on the day. If preparation turns up unsupported software you still rely on, four weeks is optimistic.",
  },
  {
    q: "When should we start patching before a Cyber Essentials Plus audit?",
    a: "At least two weeks before, because the test is time-based rather than absolute. A vulnerability fails if the vendor rates the fix critical or high, or it scores CVSS v3 7.0 or above, or the vendor gives no detail — and the fix has been available for more than 14 days. Updating everything in the fortnight before the audit date is what puts you on the right side of that line.",
  },
  {
    q: "What is the most common reason for failing Cyber Essentials Plus?",
    a: "Missing updates on devices that are not in daily use, and unsupported software. The first is recoverable by patching and retesting. The second is not, because no fix exists to apply — the software has to be replaced, or the device removed from scope, before the audit rather than after it.",
  },
  {
    q: "Do we need to prepare differently from standard Cyber Essentials?",
    a: "Yes, and the difference is the point. Standard Cyber Essentials asks you to describe your controls accurately. Plus verifies the description on a sample of real machines. Preparation for Plus is therefore about closing the gap between what was claimed and what is true on the devices, which is a different exercise from answering the questions well.",
  },
  {
    q: "Who needs to be available on the day of the assessment?",
    a: "Whoever normally uses the devices in the sample, signed in with their own day-to-day account, plus someone holding a standard and an administrative account for each cloud service in scope. Three of the five test cases are the assessor observing a user attempt something, so availability is a real dependency rather than a courtesy.",
  },
  {
    q: "Can we fix things during the Cyber Essentials Plus assessment?",
    a: "No. The verified self-assessment is locked before testing begins, and remediation during a test case is not how the process works. If something fails you remediate afterwards and retest, and since April 2026 the retest covers the original sample plus a new random sample.",
  },
  {
    q: "Does BrightCert prepare us for the Cyber Essentials Plus audit?",
    a: "BrightCert finds gaps across the same five control areas the audit tests, so you can close them before booking an assessor. It does not carry out the audit and does not issue any certificate — both belong to an IASME-licensed Certification Body.",
  },
];

export default function CyberEssentialsPlusPreparationPage() {
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

      <main className="pt-[150px] pb-24 print:pt-0">
        <article>
          <div className="max-w-3xl mx-auto px-4">
            <ArticleHeader
              title={<>How to prepare for a Cyber Essentials Plus assessment</>}
              article={ARTICLE}
              related={{
                href: "/blog/cyber-essentials-plus-audit",
                label: "What actually happens in a Cyber Essentials Plus audit",
              }}
            />

            <ShortAnswer>
              Preparing for Cyber Essentials Plus is mostly making sure the things you claimed in the self-assessment
              are actually true on the devices the assessor will sample. Two of the constraints are{" "}
              <strong>time windows rather than settings</strong>: a fix available for more than{" "}
              <strong>14 days</strong> and not applied is a fail, and unsupported software cannot be patched into a
              pass at all. So preparation is a calendar problem before it is a technical one — roughly{" "}
              <strong>four weeks</strong>, working backwards from the audit date.
            </ShortAnswer>

            <ArticleProse>
              <p className="mt-8 text-[#0F2044] font-medium">
                Standard Cyber Essentials asks you to describe your controls accurately. Plus sends someone to check
                the description against a sample of real machines. Almost everything that goes wrong on the day lives
                in the gap between those two sentences — not in controls nobody had, but in controls that were true of
                most of the estate and quietly untrue of a handful of devices.
              </p>
            </ArticleProse>

            <section aria-labelledby="the-gap">
              <ArticleProse>
                <h2 id="the-gap" className="pt-4 text-xl font-bold text-[#0F2044]">
                  What preparation is actually for
                </h2>
                <p>
                  It is tempting to prepare for Plus the way you prepared for the questionnaire: read the controls,
                  confirm you meet them, book the date. That approach passes the self-assessment and then fails the
                  audit, because the two ask different questions. The questionnaire asks whether you have a policy of
                  applying updates within fourteen days. The audit picks up a laptop and looks.
                </p>
                <p>
                  The honest version of preparation is an internal dry run of the same five test cases the assessor
                  will run. If you have not read them, the{" "}
                  <Link
                    href="/blog/cyber-essentials-plus-audit"
                    className="text-[#047857] underline hover:no-underline"
                  >
                    walkthrough of what actually happens in the audit
                  </Link>{" "}
                  sets them out in order. This article is the other half: what to do in the weeks before, and when each
                  piece has to start.
                </p>
                <p>
                  It also assumes the underlying controls are in place. If they are not yet, start with{" "}
                  <Link href="/blog/what-is-cyber-essentials" className="text-[#047857] underline hover:no-underline">
                    what Cyber Essentials is
                  </Link>{" "}
                  and the{" "}
                  <Link
                    href="/blog/cyber-essentials-requirements"
                    className="text-[#047857] underline hover:no-underline"
                  >
                    requirements v3.3 guide
                  </Link>
                  , because Plus verifies those same five controls rather than adding new ones.
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="why-calendar">
              <ArticleProse>
                <h2 id="why-calendar" className="pt-4 text-xl font-bold text-[#0F2044]">
                  Why the preparation is a calendar and not a checklist
                </h2>
                <p>
                  Most compliance preparation can be compressed if you throw a weekend at it. Two things here cannot,
                  and they are what set the four-week shape.
                </p>
                <p>
                  <strong>The patching test measures elapsed time, not effort.</strong> A vulnerability fails if the
                  vendor rates the fix critical or high, or it carries a CVSS v3 base score of 7.0 or above, or the
                  vendor publishes no detail about what it fixes — and the fix has been available for more than 14
                  days. You cannot shorten that by patching harder. You can only make sure the fortnight before the
                  audit is one in which every in-scope device was updated.
                </p>
                <p>
                  <strong>Unsupported software has no same-week answer.</strong> If a vendor no longer issues fixes,
                  there is nothing to apply, so the device cannot pass. The remedies are replacement, upgrade, or
                  removing it from scope — and each of those is a procurement or migration task measured in weeks.
                  This is the single most common reason a Plus audit gets postponed, and finding it four weeks out is
                  the difference between moving a licence and moving a date.
                </p>
                <p>
                  Everything else — accounts, credentials, availability, the scope list — is quick to do and easy to
                  forget, which is why it sits in the week before rather than the month before.
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="countdown">
              <ArticleProse>
                <h2 id="countdown" className="pt-4 text-xl font-bold text-[#0F2044]">
                  A four-week countdown to the audit date
                </h2>
                <p>
                  {TOTAL_PREP_ITEMS} items, ordered by when the work has to start rather than by control area. The
                  owner and status columns are deliberately blank: print the page, or copy it into whatever you already
                  use, and fill them in. An item without a name against it is the one that does not happen.
                </p>
              </ArticleProse>

              <div className="mt-6 space-y-8">
                {PREP.map((stage) => (
                  <div key={stage.id}>
                    <h3 className="font-display text-base font-bold text-[#0F2044]">{stage.when}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#475569]">{stage.why}</p>

                    <div className="mt-4 overflow-x-auto rounded-[16px] border border-[#0F2044]/[0.08] bg-white print:border-[#94A3B8]">
                      <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                        <caption className="sr-only">
                          {stage.when}: preparation tasks, why the audit cares, the evidence to have ready, and blank
                          owner and status columns
                        </caption>
                        <thead>
                          <tr className="border-b border-[#0F2044]/[0.08] bg-[#F8FAFC]">
                            <th scope="col" className="p-4 font-display text-[13px] font-semibold text-[#0F2044]">
                              Do this
                            </th>
                            <th scope="col" className="p-4 font-display text-[13px] font-semibold text-[#0F2044]">
                              Why the audit cares
                            </th>
                            <th scope="col" className="p-4 font-display text-[13px] font-semibold text-[#0F2044]">
                              Evidence to have
                            </th>
                            <th scope="col" className="w-[110px] p-4 font-display text-[13px] font-semibold text-[#0F2044]">
                              Owner
                            </th>
                            <th scope="col" className="w-[90px] p-4 font-display text-[13px] font-semibold text-[#0F2044]">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {stage.items.map((row) => (
                            <tr key={row.task} className="border-t border-[#0F2044]/[0.06] align-top">
                              <th
                                scope="row"
                                className="p-4 font-display text-[13px] font-semibold text-[#0F2044] whitespace-normal"
                              >
                                {row.task}
                              </th>
                              <td className="p-4 leading-relaxed text-[#475569]">{row.audit}</td>
                              <td className="p-4 leading-relaxed text-[#475569]">{row.evidence}</td>
                              <td className="p-4 text-[#94A3B8]" aria-label="Owner, to be completed" />
                              <td className="p-4 text-[#94A3B8]" aria-label="Status, to be completed" />
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="sampling">
              <ArticleProse>
                <h2 id="sampling" className="pt-4 text-xl font-bold text-[#0F2044]">
                  You cannot choose the sample, but you can shape it
                </h2>
                <p>
                  The assessor tests a representative sample rather than every device, sized by a method IASME sets
                  and verified against evidence the Certification Body has to retain. You do not pick which machines
                  are tested, and offering a tidy one is not an option.
                </p>
                <p>What you can influence is how large and awkward the sample has to be.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-[#0F2044]">Every operating system in scope must be represented.</strong>{" "}
                    One person on an unusual setup pulls that setup into the sample. A standardised estate is sampled
                    with fewer devices; a varied one cannot be.
                  </li>
                  <li>
                    <strong className="text-[#0F2044]">Cloud services are sampled by account.</strong> Each in-scope
                    service needs a standard and an administrative user tested, so a forgotten subscription adds work
                    rather than staying invisible.
                  </li>
                  <li>
                    <strong className="text-[#0F2044]">Scope honestly, once.</strong> Narrowing scope to make the
                    audit easier is legitimate only if the boundary is real and defensible. Narrowing it on paper
                    while the devices still handle organisational data is not a preparation tactic, it is a
                    misdescription.
                  </li>
                </ul>
                <p>
                  Because the sample follows the scope and the effort follows the sample, scope is also what drives
                  the quote — covered in the{" "}
                  <Link href="/blog/cyber-essentials-cost" className="text-[#047857] underline hover:no-underline">
                    cost guide
                  </Link>
                  .
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="dry-run">
              <ArticleProse>
                <h2 id="dry-run" className="pt-4 text-xl font-bold text-[#0F2044]">
                  Run the tests on yourself first
                </h2>
                <p>
                  The most useful week of preparation is the one where you behave like the assessor. None of this
                  needs specialist tooling, and all of it surfaces the gap between claimed and actual state while
                  there is still time to close it.
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong className="text-[#0F2044]">Pick your own awkward sample.</strong> Not the well-managed
                    laptops. The oldest device, the one belonging to whoever joined most recently, and anything that
                    has not connected to the network in a month.
                  </li>
                  <li>
                    <strong className="text-[#0F2044]">Check what is missing, per device.</strong> Look at what
                    updates each one is short of and how long each fix has been public. Fourteen days is the line, and
                    it is judged per device, not per fleet average.
                  </li>
                  <li>
                    <strong className="text-[#0F2044]">Sign in as a standard user.</strong> On every cloud service, from
                    a browser that has never seen it. If no MFA prompt appears, you have found a fail before the
                    assessor did.
                  </li>
                  <li>
                    <strong className="text-[#0F2044]">Try to install something as a normal user.</strong> Being
                    stopped and asked for separate credentials is the pass. Succeeding quietly is the finding.
                  </li>
                </ol>
                <p>
                  A structured version of the same idea, covering the underlying controls with owner and evidence
                  columns, is in the{" "}
                  <Link
                    href="/blog/cyber-essentials-checklist"
                    className="text-[#047857] underline hover:no-underline"
                  >
                    Cyber Essentials checklist
                  </Link>
                  . If you have not yet completed the self-assessment stage, the{" "}
                  <Link
                    href="/blog/cyber-essentials-assessment-questions"
                    className="text-[#047857] underline hover:no-underline"
                  >
                    guide to what the assessment questions ask for
                  </Link>{" "}
                  comes first — Plus verifies answers that already exist.
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="booking">
              <ArticleProse>
                <h2 id="booking" className="pt-4 text-xl font-bold text-[#0F2044]">
                  Booking the date, and the three-month clock
                </h2>
                <p>
                  The Plus audit has to be completed within three months of your Cyber Essentials certification. Miss
                  that and you repeat the self-assessment stage before you can book, which costs a month for reasons
                  that have nothing to do with your security.
                </p>
                <p>
                  That constraint pushes in the opposite direction to everything above, and the two have to be
                  reconciled deliberately. Booking early protects the three-month window; booking before unsupported
                  software has been dealt with wastes the slot. The workable order is to find the hard stops first,
                  then book a date far enough out that the fortnight before it can be a clean patching window.
                </p>
                <p>
                  Talk to the Certification Body about remote or on-site delivery at the same time. It affects
                  scheduling and travel cost, but not difficulty — the same five test cases are run either way.
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="limits">
              <ArticleProse>
                <h2 id="limits" className="pt-4 text-xl font-bold text-[#0F2044]">
                  What preparation cannot do
                </h2>
                <p>
                  No amount of preparation makes the audit a formality, and nobody outside an IASME-licensed
                  Certification Body can carry it out or issue the certificate. The independence is the entire reason
                  Plus is worth more than the self-assessment, and any service offering to shortcut it is offering
                  something it cannot deliver.
                </p>
                <p>
                  What preparation genuinely buys is the absence of surprises: the gaps that would have failed the
                  audit found while they are still cheap, and a date you are confident booking. BrightCert helps with
                  that first part — finding the gaps across the same five control areas — and stops there.
                </p>
              </ArticleProse>
            </section>

            <ArticleFaqList items={FAQS} />

            <ArticleFinalCta prompt="Find the gaps across the same five control areas a Plus audit tests, before you book an assessor and start the three-month clock." />

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
              <a
                href="https://www.ncsc.gov.uk/files/cyber-essentials-plus-test-specification-v3-2.pdf"
                className="underline"
                rel="nofollow noopener"
                target="_blank"
              >
                NCSC: Cyber Essentials Plus test specification
              </a>
              {" · "}
              <a
                href="https://iasme.co.uk/cyber-essentials/"
                className="underline"
                rel="nofollow noopener"
                target="_blank"
              >
                IASME: Cyber Essentials
              </a>
              {" · "}
              <a
                href="https://iasme.co.uk/articles/important-update-changes-to-cyber-essentials-for-april-2026/"
                className="underline"
                rel="nofollow noopener"
                target="_blank"
              >
                IASME: changes to Cyber Essentials for April 2026
              </a>
            </ArticleDisclaimer>
          </div>
        </article>
      </main>

      <div className="print:hidden">
        <SignalFooter />
      </div>
    </div>
  );
}
