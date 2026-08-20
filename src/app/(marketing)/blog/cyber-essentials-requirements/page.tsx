import type { Metadata } from "next";
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

const ARTICLE = ARTICLES.cyberEssentialsRequirements;

export const metadata: Metadata = metadataFor(ARTICLE);

const EVIDENCE_ROWS: { control: string; asks: string; evidence: string }[] = [
  {
    control: "Boundary Firewalls & Internet Gateways",
    asks: "Every device that connects to the internet sits behind a correctly configured firewall, with default administrative passwords changed and each inbound rule justified.",
    evidence:
      "A list of internet-facing devices and cloud boundaries; who approved each open port and why; written confirmation that default administrative passwords were changed.",
  },
  {
    control: "Secure Configuration",
    asks: "Devices and software are configured before use: unused accounts and applications removed, no default credentials left in place, and screens that lock when unattended.",
    evidence:
      "Your build or configuration standard; the software actually installed on each device type; the auto-lock setting on laptops, desktops and mobile devices.",
  },
  {
    control: "User Access Control",
    asks: "Each person has their own account, administrative rights are granted through an approval process, and multi-factor authentication is enabled on cloud services that offer it.",
    evidence:
      "A user list showing role and whether the account is administrative; your leaver process and a recent example of it running; MFA status for each cloud service, covering all users rather than administrators alone.",
  },
  {
    control: "Malware Protection",
    asks: "In-scope devices are protected by anti-malware software, application allow-listing, or code sandboxing.",
    evidence:
      "Which of the three approaches applies to each device type; confirmation that protection is active and updating; how personally owned devices in scope are covered.",
  },
  {
    control: "Security Update Management",
    asks: "Software is still supported by its vendor, and critical or high-risk security updates are applied within 14 days of release.",
    evidence:
      "A software inventory recording vendor support status and end-of-life dates; an update policy stating the 14-day window; a sample patch record showing it was met.",
  },
];

const FAQS = [
  {
    q: "When did Cyber Essentials requirements v3.3 take effect?",
    a: "27 April 2026. Applications started from that date use the Danzell question set and v3.3 of the requirements. Anything written against the earlier Willow question set is out of date for a new application.",
  },
  {
    q: "Did the five Cyber Essentials controls change in v3.3?",
    a: "No. The five control areas are the same: firewalls, secure configuration, user access control, malware protection and security update management. What changed is how scope is drawn around cloud services, remote workers and personally owned devices, and the treatment of multi-factor authentication.",
  },
  {
    q: "Does v3.3 require MFA on every system?",
    a: "It requires multi-factor authentication for users of a cloud service where that service makes MFA available. The obligation follows what the service offers, so the practical first step is establishing which of your cloud services support it.",
  },
  {
    q: "Can we leave cloud services out of scope?",
    a: "No. Cloud services used by the organisation form part of the assessment scope. Scope also needs to account for remote workers and personally owned devices that can access organisational data or services.",
  },
  {
    q: "We are renewing. Can we reuse last year's answers?",
    a: "Read them again before you do. A Cyber Essentials certificate covers 12 months, so a renewal completed after 27 April 2026 is answering a different question set from the one the original answers were written against. The answers may still be honest and still describe the old arrangement.",
  },
  {
    q: "Are these the official Danzell questions?",
    a: "No. This guide explains what v3.3 requires and what evidence to gather. It does not reproduce the official Danzell self-assessment question set, which is completed through an IASME-licensed Certification Body.",
  },
];

export default function CyberEssentialsRequirementsPage() {
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
              title={<>Cyber Essentials requirements v3.3: what changed in 2026</>}
              article={ARTICLE}
              related={{ href: "/blog/what-is-cyber-essentials", label: "plain-English Cyber Essentials guide" }}
            />

            <ShortAnswer>
              Cyber Essentials requirements <strong>v3.3</strong> took effect on{" "}
              <time dateTime="2026-04-27">27 April 2026</time>, and the Danzell question set replaced Willow. The
              five control areas did not change. What changed is how tightly scope is drawn around cloud services,
              remote workers and personally owned devices, and that multi-factor authentication must be enabled for
              users of a cloud service wherever that service makes it available. If your answers were written before
              that date, they were written against a question set that is no longer current.
            </ShortAnswer>

            <ArticleProse>
              <p className="mt-8 text-[#0F2044] font-medium">
                Most of what is written about v3.3 describes it as a minor update. That is true of the controls and
                misleading about the work, because the changes land on scope, and scope is what determines how much
                of your organisation the other requirements apply to.
              </p>
            </ArticleProse>

            <section aria-labelledby="what-changed">
              <ArticleProse>
                <h2 id="what-changed" className="pt-4 text-xl font-bold text-[#0F2044]">
                  What actually changed on 27 April 2026
                </h2>
                <p>
                  Two things happened on the same date. The requirements moved to <strong>v3.3</strong>, and the
                  self-assessment moved to the <strong>Danzell</strong> question set, replacing Willow. Applications
                  started from that date use both.
                </p>
                <p>
                  The five control areas are unchanged, which is why the update is easy to underestimate. The
                  substance sits in three places: cloud services cannot be excluded from scope, multi-factor
                  authentication is required for users of cloud services that offer it, and scope has to account for
                  remote workers and personally owned devices that can reach organisational data or services.
                </p>
                <p>
                  For a business certifying for the first time, this is simply the current standard. For a business
                  renewing, it is the more awkward case: the arrangement that passed last year may be described by
                  answers that no longer map onto the questions being asked.
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="evidence-table">
              <ArticleProse>
                <h2 id="evidence-table" className="pt-4 text-xl font-bold text-[#0F2044]">
                  The five controls, and the evidence to collect for each
                </h2>
                <p>
                  Preparation tends to fail not because a control is missing but because nobody can show it is in
                  place. The table below maps each control area to what v3.3 asks and the evidence worth gathering
                  before you start an application.
                </p>
              </ArticleProse>

              <div className="mt-6 overflow-x-auto rounded-[16px] border border-[#0F2044]/[0.08] bg-white">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Cyber Essentials v3.3 control areas mapped to requirements and the evidence a UK SME should
                    collect
                  </caption>
                  <thead>
                    <tr className="border-b border-[#0F2044]/[0.08] bg-[#F8FAFC]">
                      <th scope="col" className="p-4 font-display text-[13px] font-semibold text-[#0F2044]">
                        Control area
                      </th>
                      <th scope="col" className="p-4 font-display text-[13px] font-semibold text-[#0F2044]">
                        What v3.3 asks
                      </th>
                      <th scope="col" className="p-4 font-display text-[13px] font-semibold text-[#0F2044]">
                        Evidence to collect
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {EVIDENCE_ROWS.map((row) => (
                      <tr key={row.control} className="border-t border-[#0F2044]/[0.06] align-top">
                        <th
                          scope="row"
                          className="p-4 font-display text-[13px] font-semibold text-[#0F2044] whitespace-normal"
                        >
                          {row.control}
                        </th>
                        <td className="p-4 leading-relaxed text-[#475569]">{row.asks}</td>
                        <td className="p-4 leading-relaxed text-[#475569]">{row.evidence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="cloud-scope">
              <ArticleProse>
                <h2 id="cloud-scope" className="pt-4 text-xl font-bold text-[#0F2044]">
                  Cloud services are in scope, and cannot be carved out
                </h2>
                <p>
                  The most common scoping mistake is treating cloud services as somebody else&rsquo;s
                  responsibility. Cloud services used by the organisation form part of the assessment, and the
                  provider being responsible for its own infrastructure does not remove your responsibility for how
                  your organisation configures and grants access to the service.
                </p>
                <p>
                  In practice the work is inventory work. Most SMEs underestimate how many cloud services they use,
                  because the list assembled by the person who manages IT and the list of services actually in use
                  are rarely the same. Services signed up for by a single department, tools attached to a personal
                  login, and anything inherited from a previous supplier all belong on it.
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="mfa">
              <ArticleProse>
                <h2 id="mfa" className="pt-4 text-xl font-bold text-[#0F2044]">
                  Multi-factor authentication, where the service makes it available
                </h2>
                <p>
                  Under v3.3, where a cloud service makes{" "}
                  <abbr title="Multi-factor authentication" className="no-underline">
                    MFA
                  </abbr>{" "}
                  available, it must be enabled for users of that service. The obligation follows the capability of
                  the service, so the question to answer per service is whether MFA is offered, and then whether it
                  is actually switched on.
                </p>
                <p>
                  This is where readiness work most often finds a gap, and the gap has a predictable shape.
                  Multi-factor authentication gets enabled for the people who set the system up, an administrator or
                  two, and then is never completed for everyone else. &ldquo;We have MFA&rdquo; and &ldquo;MFA is
                  enabled for users of this service&rdquo; are different statements, and only the second one answers
                  the question.
                </p>
                <p>Working through it service by service:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>List every cloud service the organisation actually uses.</li>
                  <li>For each, establish whether the provider offers multi-factor authentication.</li>
                  <li>Where it does, confirm it is enabled for all users of that service, not administrators only.</li>
                  <li>Record who confirmed it and on what date, so the answer is evidenced rather than remembered.</li>
                </ol>
              </ArticleProse>
            </section>

            <section aria-labelledby="remote-byod">
              <ArticleProse>
                <h2 id="remote-byod" className="pt-4 text-xl font-bold text-[#0F2044]">
                  Remote workers and personally owned devices
                </h2>
                <p>
                  Scope has to account for remote workers and personally owned devices that can access
                  organisational data or services. A personal laptop used to check work email is within scope for
                  the controls that apply to it, which surprises businesses that think of scope as a list of assets
                  the company bought.
                </p>
                <p>
                  Two consequences follow. Home working arrangements need to be described accurately rather than
                  generically, and any bring-your-own-device arrangement needs an answer for malware protection,
                  updates and access control on devices the organisation does not own. Deciding that personal
                  devices may not access organisational data is a legitimate answer, provided it is genuinely
                  enforced.
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="supported-software">
              <ArticleProse>
                <h2 id="supported-software" className="pt-4 text-xl font-bold text-[#0F2044]">
                  Supported software and the 14-day window
                </h2>
                <p>
                  Software in scope must still be supported by its vendor, and critical or high-risk security
                  updates must be applied within <strong>14 days</strong> of release. Both halves matter, and the
                  first is the one that fails quietly: an operating system or application past its end-of-life date
                  cannot be patched into compliance, because the updates are no longer issued.
                </p>
                <p>
                  The useful artefact here is a software inventory that records the vendor support status and
                  end-of-life date alongside each entry. It answers the supported-software question directly, and it
                  gives you advance warning of the next thing due to fall out of support, rather than discovering it
                  during an assessment.
                </p>
              </ArticleProse>
            </section>

            <section aria-labelledby="renewing">
              <ArticleProse>
                <h2 id="renewing" className="pt-4 text-xl font-bold text-[#0F2044]">
                  If you are renewing rather than certifying for the first time
                </h2>
                <p>
                  A Cyber Essentials certificate covers 12 months, so most organisations meet v3.3 for the first
                  time at renewal rather than at initial certification. The failure mode is specific: last
                  year&rsquo;s saved answers are opened, dates are updated, and the submission goes in. The answers
                  are honest. They were also written against Willow, and they describe an arrangement that predates
                  the current scoping and MFA expectations.
                </p>
                <p>Before reusing anything, three checks are worth the time:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-[#0F2044]">Which question set the answers were written against.</strong>{" "}
                    Anything from before 27 April 2026 was written for Willow.
                  </li>
                  <li>
                    <strong className="text-[#0F2044]">Whether every cloud service appears in scope.</strong> Include
                    services adopted during the year that never reached the central list.
                  </li>
                  <li>
                    <strong className="text-[#0F2044]">What changed in the organisation.</strong> New starters,
                    leavers, a new device type or a supplier change can all leave an old answer describing an
                    arrangement that no longer exists.
                  </li>
                </ul>
                <p>
                  Starting that review 30 to 60 days before the certificate date leaves room to fix what it finds.
                  Starting it in the week of renewal generally does not.
                </p>
              </ArticleProse>
            </section>

            <ArticleFaqList items={FAQS} />

            <ArticleFinalCta prompt="Work through the five control areas against v3.3 and see where your gaps are, with a prioritised list of what to fix first." />

            <ArticleRelatedLinks currentPath={ARTICLE.path} />

            <ArticleDisclaimer>
              <a href="https://www.ncsc.gov.uk/cyberessentials/resources" className="underline" rel="nofollow noopener" target="_blank">
                NCSC: Cyber Essentials v3.3 resources
              </a>
              {" · "}
              <a
                href="https://iasme.co.uk/cyber-essentials/preview-the-self-assessment-questions-for-cyber-essentials/"
                className="underline"
                rel="nofollow noopener"
                target="_blank"
              >
                IASME: preview the self-assessment questions
              </a>
            </ArticleDisclaimer>
          </div>
        </article>
      </main>

      <SignalFooter />
    </div>
  );
}
