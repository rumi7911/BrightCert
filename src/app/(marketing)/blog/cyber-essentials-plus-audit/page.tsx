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

const ARTICLE = ARTICLES.cyberEssentialsPlusAudit;

export const metadata: Metadata = metadataFor(ARTICLE);

// The five test cases in the order the published NCSC test specification gives
// them. The third column is the point of the table: most of these are not a
// scan run against you in the background, they are a person watching one of
// your staff attempt something. That is what determines who has to be free on
// the day, which is the part organisations get wrong.
const TEST_CASES: { name: string; what: string; needs: string }[] = [
  {
    name: "1. Remote vulnerability assessment",
    what:
      "An external scan of the internet-facing addresses in scope, looking for services that should not be reachable and for known vulnerabilities in the ones that should.",
    needs:
      "A confirmed list of your external IP addresses, agreed before the day. Nobody needs to be present for this part.",
  },
  {
    name: "2. Patching, by authenticated scan",
    what:
      "A credentialed vulnerability scan of each sampled device — logged in, not viewed from outside — checking what is installed and what is missing.",
    needs:
      "An account the scanner can log in with on each sampled device, and the devices switched on and reachable for the duration.",
  },
  {
    name: "3. Malware protection",
    what:
      "Inert test files are sent to a real mailbox and offered from a website, and your user is watched trying to open and run them. Devices using application allow listing are checked differently.",
    needs:
      "A real user at a real device, with their normal mailbox and normal browser. Not an administrator, and not a clean machine built for the occasion.",
  },
  {
    name: "4. Multi-factor authentication",
    what:
      "A user and an administrator sign in to each cloud service from an untrusted device or an incognito session, and the assessor watches for the MFA prompt.",
    needs:
      "One standard and one administrative account for every cloud service in scope, and the people who hold them available to log in.",
  },
  {
    name: "5. Account separation",
    what:
      "A standard user attempts to run an administrative process on every sampled device. The pass is being stopped and asked for separate credentials.",
    needs:
      "The person who normally uses each sampled device, signed in as themselves with their day-to-day account.",
  },
];

const FAQS = [
  {
    q: "What actually happens during a Cyber Essentials Plus audit?",
    a: "An assessor from an IASME-licensed Certification Body runs five test cases: an external vulnerability scan, an authenticated scan of a sample of your devices, malware protection tests delivered by email and by browser, a multi-factor authentication check on your cloud services, and an account separation check. Most of them involve the assessor observing one of your staff attempting something on their own device, rather than software running in the background.",
  },
  {
    q: "How long do I have between Cyber Essentials and Cyber Essentials Plus?",
    a: "Three months. The Plus audit has to be completed within three months of your Cyber Essentials certification. If you certify to Plus inside that window you do not repeat the self-assessment questions stage.",
  },
  {
    q: "How many devices does the assessor test?",
    a: "A representative sample rather than everything, sized by a method IASME sets and verified by the assessor, who must retain evidence of how it was calculated. Every operating system and device type in scope has to appear in the sample. Cloud services are tested with at least one standard and one administrative account each.",
  },
  {
    q: "What happens if we fail part of the audit?",
    a: "You remediate and retest. Since the April 2026 update the retest is wider than it used to be: the assessor rechecks the original sample and also tests a new random sample, to establish that the fix reached the whole estate rather than the devices that were caught. A second failure means the certification is not awarded.",
  },
  {
    q: "Is the Cyber Essentials Plus audit remote or on-site?",
    a: "Both are used, and it is a matter for the Certification Body and the shape of your estate. Remote delivery is common, with the assessor observing over a screen share while your staff drive their own machines. Remote does not make it lighter — the same five test cases are run either way.",
  },
  {
    q: "Can we change our self-assessment answers once the audit starts?",
    a: "No. As of the April 2026 update the verified self-assessment must be completed, finalised and unchanged before Plus testing begins. Anything you discover during preparation has to be corrected before that point, not during the audit.",
  },
  {
    q: "Does BrightCert carry out the Cyber Essentials Plus audit?",
    a: "No. The audit can only be carried out by an assessor at an IASME-licensed Certification Body, and only they can issue the certificate. BrightCert helps you find the gaps beforehand, across the same five control areas the audit tests.",
  },
];

export default function CyberEssentialsPlusAuditPage() {
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
              title={<>What actually happens in a Cyber Essentials Plus audit</>}
              article={ARTICLE}
              related={{ href: "/blog/ce-vs-ce-plus", label: "Cyber Essentials vs Cyber Essentials Plus" }}
            />

            <ShortAnswer>
              Cyber Essentials Plus adds an independent technical audit on top of the same self-assessment that
              standard Cyber Essentials uses. An assessor from an IASME-licensed Certification Body runs{" "}
              <strong>five test cases</strong> against a representative sample of your devices and cloud services. It
              has to happen within <strong>three months</strong> of your Cyber Essentials certification. The part most
              organisations do not plan for is that the assessor mostly watches <em>your people</em> attempt things on
              their own machines, so the day needs the right humans free, not just the right settings.
            </ShortAnswer>

            <ArticleProse>
              <p className="mt-8 text-[#0F2044] font-medium">
                Most descriptions of a Cyber Essentials Plus audit stop at &ldquo;an assessor tests your systems&rdquo;,
                which makes it sound like something done to your network while you get on with your day. It is not
                really that. Three of the five test cases are a qualified assessor sitting with one of your staff,
                watching them try to open a file, sign in to a service, or install something — and recording what
                happens.
              </p>
            </ArticleProse>

            <section aria-labelledby="where-it-sits">
              <ArticleProse>
                <h2 id="where-it-sits" className="pt-4 text-xl font-bold text-[#0F2044]">
                  Where the audit sits, and the clock attached to it
                </h2>
                <p>
                  Plus is not a separate scheme. It is standard Cyber Essentials — the same five controls, the same
                  self-assessment — with a technical audit added on top to verify that what you described is actually
                  true on the machines. If you want the comparison in full, the{" "}
                  <Link href="/blog/ce-vs-ce-plus" className="text-[#047857] underline hover:no-underline">
                    Cyber Essentials vs Cyber Essentials Plus
                  </Link>{" "}
                  guide covers how the two differ on cost, timeline and assurance.
                </p>
                <p>
                  Two dates govern the sequence, and both catch people out.
                </p>
                <p>
                  <strong>The audit must be completed within three months of your Cyber Essentials certification.</strong>{" "}
                  Certify inside that window and you do not repeat the self-assessment questions stage. Let it lapse and
                  you are starting the self-assessment again before you can book the audit — which is a scheduling
                  problem, not a technical one, and the most avoidable way to lose a month.
                </p>
                <p>
                  <strong>Your self-assessment answers are locked before testing begins.</strong> Since the April 2026
                  update, the verified self-assessment has to be completed, finalised and unchanged before Plus testing
                  starts. You cannot quietly revise an answer once the assessor is in. Anything preparation turns up has
                  to be fixed on the front side of that line.
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="five-tests">
              <ArticleProse>
                <h2 id="five-tests" className="pt-4 text-xl font-bold text-[#0F2044]">
                  The five test cases, in the order they run
                </h2>
                <p>
                  The published test specification sets these out as five numbered test cases. The third column is the
                  one to read if you are planning the day, because it is where the audit stops being a technical
                  exercise and starts being a diary exercise.
                </p>
              </ArticleProse>

              <div className="mt-6 overflow-x-auto rounded-[16px] border border-[#0F2044]/[0.08] bg-white">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    The five Cyber Essentials Plus test cases, what the assessor does in each, and what the
                    organisation has to have ready
                  </caption>
                  <thead>
                    <tr className="border-b border-[#0F2044]/[0.08] bg-[#F8FAFC]">
                      <th scope="col" className="p-4 font-display text-[13px] font-semibold text-[#0F2044]">
                        Test case
                      </th>
                      <th scope="col" className="p-4 font-display text-[13px] font-semibold text-[#0F2044]">
                        What the assessor does
                      </th>
                      <th scope="col" className="p-4 font-display text-[13px] font-semibold text-[#0F2044]">
                        What you need ready
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {TEST_CASES.map((row) => (
                      <tr key={row.name} className="border-t border-[#0F2044]/[0.06] align-top">
                        <th
                          scope="row"
                          className="p-4 font-display text-[13px] font-semibold text-[#0F2044] whitespace-normal"
                        >
                          {row.name}
                        </th>
                        <td className="p-4 leading-relaxed text-[#475569]">{row.what}</td>
                        <td className="p-4 leading-relaxed text-[#475569]">{row.needs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="patching-bar">
              <ArticleProse>
                <h2 id="patching-bar" className="pt-4 text-xl font-bold text-[#0F2044]">
                  The patching test has a specific bar, and it is arithmetic
                </h2>
                <p>
                  Test case 2 is the one that fails most often, and it is worth knowing exactly where the line is
                  rather than hoping you are on the right side of it. The authenticated scan looks for vulnerabilities
                  that meet any of three criteria: the vendor describes the fix as critical or high risk; the issue has
                  a CVSS v3 base score of <strong>7 or above</strong>; or the vendor gives no detail about what the
                  update fixes at all.
                </p>
                <p>
                  If any of those has a fix that has been available for <strong>more than 14 days</strong>, that is a
                  fail. Not a discussion about compensating controls — a fail.
                </p>
                <p>
                  So the practical move before an audit date is not &ldquo;patch everything&rdquo;. It is to run
                  updates on every in-scope device in the fortnight before the assessor arrives, and to check the
                  devices that do not get used daily. The laptop in a drawer, the machine belonging to someone on
                  leave, and the server nobody logs into are the three that reliably carry a fix that went public five
                  weeks ago. Unsupported software is the harder version of the same problem: no updates exist, so it
                  cannot be patched into a pass and has to be replaced or removed from scope.
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="sampling">
              <ArticleProse>
                <h2 id="sampling" className="pt-4 text-xl font-bold text-[#0F2044]">
                  How the device sample is chosen
                </h2>
                <p>
                  On anything but the smallest network, testing every device is impractical, so the assessor tests a
                  representative sample. Everything inside the scope boundary is eligible: end user devices that can
                  reach organisational data, internally hosted servers, and cloud services of every type.
                </p>
                <p>Three things about sampling are worth knowing before you agree a scope.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-[#0F2044]">Every operating system in scope has to be represented.</strong>{" "}
                    A standardised, well-provisioned estate can be covered by a small number of samples. A varied one
                    cannot. Two people on an unusual setup will pull their machines into the sample and can enlarge it.
                  </li>
                  <li>
                    <strong className="text-[#0F2044]">The sample size is not the assessor&rsquo;s opinion.</strong> It
                    is calculated by a method IASME sets, the assessor has to verify it was calculated correctly, and
                    the Certification Body has to keep evidence of the calculation for at least the life of the
                    certificate.
                  </li>
                  <li>
                    <strong className="text-[#0F2044]">Cloud services are sampled by account, not by device.</strong>{" "}
                    Every cloud service in scope needs at least one standard user and one administrative user tested.
                    That is the point at which forgotten subscriptions become expensive, so the list of what you
                    actually use has to be right before scoping, not during.
                  </li>
                </ul>
                <p>
                  Because scope drives the sample and the sample drives the effort, scope is also what drives the
                  quote. That is covered in the{" "}
                  <Link href="/blog/cyber-essentials-cost" className="text-[#047857] underline hover:no-underline">
                    cost guide
                  </Link>
                  .
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="observed">
              <ArticleProse>
                <h2 id="observed" className="pt-4 text-xl font-bold text-[#0F2044]">
                  The part nobody warns you about: it is observed, not automated
                </h2>
                <p>
                  Read the test descriptions closely and the same verb keeps appearing. The assessor{" "}
                  <em>observes</em> the user attempting to open the test attachment. The assessor{" "}
                  <em>observes</em> the user accessing the cloud service. The assessor <em>observes</em> a standard user
                  attempting to run an administrative process. This is a supervised session with your staff in it.
                </p>
                <p>Three consequences follow, and all three are logistical rather than technical.</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong className="text-[#0F2044]">Real people on real devices.</strong> The malware tests need a
                    genuine user, using their own mailbox and their own browser on the machine they use every day. A
                    freshly built laptop is not a sample of your estate, and an administrator clicking through the
                    tests does not demonstrate what a standard user experiences.
                  </li>
                  <li>
                    <strong className="text-[#0F2044]">Availability is a real dependency.</strong> If the sample
                    includes a device belonging to someone on annual leave, that is not a small problem. Book the audit
                    around the people whose devices are likely to be sampled, and tell them beforehand what will be
                    asked of them — the malware test is uncomfortable if it is a surprise.
                  </li>
                  <li>
                    <strong className="text-[#0F2044]">Test files are inert by design.</strong> Nothing harmful is
                    delivered to your network. They are known, benign files used to check whether your protection
                    notices, and the whole exercise is arranged with you in advance.
                  </li>
                </ol>
              </ArticleProse>
            </section>

            <section aria-labelledby="failing">
              <ArticleProse>
                <h2 id="failing" className="pt-4 text-xl font-bold text-[#0F2044]">
                  What happens when something fails — and what changed in 2026
                </h2>
                <p>
                  A failed test case is not the end of the process. You remediate the issue and retest. What changed in
                  the April 2026 update is how much the retest covers, and it is a meaningful tightening.
                </p>
                <p>
                  Previously a retest could reasonably be read as rechecking what failed. Now the assessor rechecks the
                  original sample <strong>and tests a new random sample as well</strong>. The intent is plain: to
                  establish that the fix reached the whole estate rather than the specific devices that got caught. A
                  second failure means the certification is not awarded.
                </p>
                <p>
                  This changes what a sensible response to a failure looks like. Patching the three laptops that failed
                  and rebooking used to be a viable strategy. It is now the strategy most likely to fail twice, because
                  the retest deliberately looks somewhere else. If one device was missing an update because a process
                  did not reach it, the honest question is which other devices that process also does not reach.
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="remote">
              <ArticleProse>
                <h2 id="remote" className="pt-4 text-xl font-bold text-[#0F2044]">
                  Remote or on-site
                </h2>
                <p>
                  Both are used. Remote delivery has become common: the assessor works over a screen share while your
                  staff drive their own machines, which suits a distributed team and removes travel from the quote.
                  On-site suits estates with physical constraints, restricted networks, or devices that cannot be
                  reached remotely.
                </p>
                <p>
                  It is a conversation to have with the Certification Body early, because it affects scheduling and
                  cost. What it does not affect is difficulty. The same five test cases are run, against the same
                  criteria, either way — remote is not a lighter audit.
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="ready">
              <ArticleProse>
                <h2 id="ready" className="pt-4 text-xl font-bold text-[#0F2044]">
                  What to have ready on the day
                </h2>
                <p>
                  None of this is difficult. All of it takes longer than the morning of the audit, which is the
                  argument for reading it now rather than the night before.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>A confirmed and unchanged verified self-assessment, finalised before testing starts.</li>
                  <li>The external IP addresses in scope, agreed in advance.</li>
                  <li>
                    Every in-scope device switched on, reachable, and updated — including the ones that are not in
                    daily use.
                  </li>
                  <li>Credentials the authenticated scan can use on each sampled device.</li>
                  <li>
                    One standard and one administrative account for each cloud service, with the people who hold them
                    available.
                  </li>
                  <li>
                    The users whose devices are likely to be sampled, briefed and free — not their IT provider standing
                    in for them.
                  </li>
                  <li>An answer for any unsupported software, since it cannot be patched into a pass.</li>
                </ul>
                <p>
                  If you want to work through the underlying controls first, the{" "}
                  <Link href="/blog/cyber-essentials-checklist" className="text-[#047857] underline hover:no-underline">
                    Cyber Essentials checklist
                  </Link>{" "}
                  covers them with owner and status columns, and the{" "}
                  <Link href="/blog/cyber-essentials-requirements" className="text-[#047857] underline hover:no-underline">
                    requirements v3.3 guide
                  </Link>{" "}
                  explains what each control asks for.
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="who-does-it">
              <ArticleProse>
                <h2 id="who-does-it" className="pt-4 text-xl font-bold text-[#0F2044]">
                  Who can carry out the audit
                </h2>
                <p>
                  Only an assessor at an IASME-licensed Certification Body can run a Cyber Essentials Plus audit, and
                  only a Certification Body can issue the certificate. That is not a formality — the independence is
                  the entire point of the Plus level, and no preparation service can stand in for it or shorten it.
                </p>
                <p>
                  What preparation can do is make sure the audit is the first time nobody is surprised. The five test
                  cases map onto the same five control areas the self-assessment covers, so the gaps that would fail an
                  audit are largely findable before you book one.
                </p>
              </ArticleProse>
            </section>

            <ArticleFaqList items={FAQS} />

            <ArticleFinalCta prompt="Check your readiness across the same five control areas the Plus audit tests, and see which gaps to close before you book an assessor." />

            <ArticleRelatedLinks currentPath={ARTICLE.path} />

            <ArticleDisclaimer>
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
                href="https://iasme.co.uk/articles/important-update-changes-to-cyber-essentials-for-april-2026/"
                className="underline"
                rel="nofollow noopener"
                target="_blank"
              >
                IASME: changes to Cyber Essentials for April 2026
              </a>
              {" · "}
              <a
                href="https://www.ncsc.gov.uk/cyberessentials/resources"
                className="underline"
                rel="nofollow noopener"
                target="_blank"
              >
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
