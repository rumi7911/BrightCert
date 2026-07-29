import type { Metadata } from "next";
import { SignalNav } from "@/components/brightcert/signal-nav";
import { SignalFooter } from "@/components/brightcert/signal-footer";
import { ScrollProgress } from "@/components/brightcert/scroll-progress";
import { metadataFor, SITE_PAGES } from "@/lib/seo/registry";

export const metadata: Metadata = metadataFor(SITE_PAGES.privacy);

export default function PrivacyPage() {
  return (
    <div className="bg-[#F3F4EC]">
      <ScrollProgress />
      <SignalNav />

      <main className="pt-[150px] pb-24">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-display text-4xl font-bold text-[#0F2044] mb-2">Privacy Policy</h1>
          <p className="text-sm text-[#64748B] mb-10">Last updated: 25 July 2026</p>

          <div className="space-y-8 text-[#475569] leading-relaxed text-[15px]">
            <section>
              <p>
                This Privacy Policy explains how Cognumi Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;),
                operating the BrightCert service at brightcert.co.uk, collects, uses,
                and protects your personal data. We are the data controller for the
                purposes of the UK General Data Protection Regulation (UK GDPR) and the
                Data Protection Act 2018.
              </p>
            </section>

            <Section title="1. Who we are">
              <p>
                Cognumi Ltd is a company registered in England and Wales, based in
                London. For any privacy questions or to exercise your rights, contact us
                at{" "}
                <a href="mailto:hello@brightcert.co.uk" className="text-[#059669] hover:underline">
                  hello@brightcert.co.uk
                </a>
                .
              </p>
            </Section>

            <Section title="2. What data we collect">
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Account data:</strong>{" "}your email address and organisation name.</li>
                <li><strong>Organisation details:</strong>{" "}business size and sector.</li>
                <li>
                  <strong>Assessment data:</strong>{" "}the answers you provide across the
                  five Cyber Essentials control areas, and the scores and gap analysis
                  generated from them.
                </li>
                <li><strong>Payment data:</strong>{" "}processed by Stripe. We do not store your card details.</li>
                <li>
                  <strong>Technical data:</strong>{" "}basic log and device information
                  collected automatically when you use the service.
                </li>
                <li>
                  <strong>Outreach and prospect data:</strong>{" "}business contact details,
                  job role, company details, public business context, the source and date we
                  collected it, and records of contact, replies, objections, and suppression.
                  We use this only for corporate B2B outreach, not personal consumer marketing.
                </li>
              </ul>
            </Section>

            <Section title="3. How we use your data">
              <ul className="list-disc pl-5 space-y-1.5">
                <li>To provide the readiness assessment and generate your report.</li>
                <li>To create and manage your account and process payments.</li>
                <li>To send you service-related emails (sign-in links, report notifications).</li>
                <li>To operate, secure, and improve the service.</li>
                <li>
                  To identify and contact relevant UK corporate prospects about BrightCert,
                  manage replies and opt-outs, and measure our B2B outreach responsibly.
                </li>
              </ul>
              <p className="mt-3">
                Our legal bases are performance of a contract with you, our legitimate
                interests in operating, improving, and marketing our service to relevant
                businesses, and your consent where required. For B2B outreach, we assess
                our legitimate interests against the rights and expectations of the people
                we contact before sending anything.
              </p>
            </Section>

            <Section title="4. Automated processing (AI)">
              <p>
                Your assessment answers are sent to Google&rsquo;s Gemini API to generate
                control-area scores, plain-English gap descriptions, and remediation
                guidance. This processing supports, but does not replace, your own
                decision-making. BrightCert does not make legally significant decisions
                about you on a solely automated basis.
              </p>
            </Section>

            <Section title="5. Who we share data with">
              <p>
                We use the following processors and sharing categories to run the service
                and our outreach operations:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li><strong>Supabase</strong>{" "}— database and authentication (data hosted in the EU/London region).</li>
                <li><strong>Google Cloud</strong>{" "}— the Gemini API (assessment analysis) and Cloud Storage (report PDFs, EU region).</li>
                <li><strong>Stripe</strong>{" "}— payment processing.</li>
                <li><strong>Resend</strong>{" "}— transactional email delivery.</li>
                <li><strong>Vercel</strong>{" "}— application hosting.</li>
                <li>
                  <strong>Clay and licensed data providers</strong>{" "}— B2B prospect research
                  and enrichment, where we use them. We may also collect public business
                  context from company websites, public professional profiles, and public
                  registers including Companies House.
                </li>
                <li>
                  <strong>Professional advisers and authorities</strong>{" "}— only where needed
                  for legal, accounting, fraud-prevention, or regulatory purposes.
                </li>
              </ul>
              <p className="mt-3">
                We do not sell your personal data. Where data is transferred outside the
                UK, we rely on appropriate safeguards such as the UK International Data
                Transfer Agreement or adequacy regulations.
              </p>
            </Section>

            <Section title="6. Data retention">
              <p>We keep data only for as long as it is needed for the purpose collected:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>
                  Account and assessment data: while your account is active, then only as
                  needed for legal, accounting, or reporting obligations.
                </li>
                <li>
                  Active B2B outreach records: for the sequence and up to 90 days after it
                  ends, unless you become a customer or ask us to stop sooner.
                </li>
                <li>
                  Other non-converted prospect records: deleted or de-identified no later
                  than 180 days after the sequence ends.
                </li>
                <li>
                  Suppression records: the minimum identifier and evidence needed to honour
                  an opt-out are retained for as long as reasonably necessary to make sure
                  we do not contact you again.
                </li>
              </ul>
            </Section>

            <Section title="7. Your rights">
              <p>Under UK GDPR you have the right to:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Access a copy of your personal data.</li>
                <li>Request correction of inaccurate data.</li>
                <li>Request erasure of your data.</li>
                <li>Restrict or object to certain processing.</li>
                <li>Data portability.</li>
                <li>Withdraw consent where processing is based on consent.</li>
                <li>
                  Object at any time to direct marketing. We will stop direct marketing
                  when you object; this right is unconditional.
                </li>
              </ul>
              <p className="mt-3">
                To exercise any of these, email{" "}
                <a href="mailto:hello@brightcert.co.uk" className="text-[#059669] hover:underline">
                  hello@brightcert.co.uk
                </a>
                . You also have the right to lodge a complaint with the Information
                Commissioner&rsquo;s Office (ICO) at ico.org.uk.
              </p>
              <p className="mt-3">
                <strong>To opt out of outreach:</strong>{" "}reply &ldquo;stop&rdquo; or &ldquo;opt out&rdquo; to
                any BrightCert outreach email, or email{" "}
                <a href="mailto:hello@brightcert.co.uk" className="text-[#059669] hover:underline">
                  hello@brightcert.co.uk
                </a>
                . We will add the minimum details needed to our suppression list and stop
                sending direct marketing.
              </p>
            </Section>

            <Section title="8. Cookies">
              <p>
                We use essential cookies required for authentication and to keep you
                signed in. These are necessary for the service to function.
              </p>
              <p className="mt-3">
                We also use Google Analytics to understand how visitors use the site
                (e.g. which pages are viewed). This sets analytics cookies and shares
                usage data with Google. It does not include your assessment responses.
                If you arrived via a marketing link (e.g. an email or campaign), we
                also record which campaign referred you, so we can tell which channels
                are working. Neither of these run until you accept the cookie banner
                shown on your first visit — declining, or never responding, means
                neither loads or is set. You can change your choice at any time via
                &ldquo;Cookie Settings&rdquo; in the footer, or in Settings if you have
                an account — withdrawing consent also removes the analytics cookies
                already set.
              </p>
            </Section>

            <Section title="9. Changes to this policy">
              <p>
                We may update this policy from time to time. Material changes will be
                reflected by updating the &ldquo;Last updated&rdquo; date above.
              </p>
            </Section>
          </div>
        </div>
      </main>

      <SignalFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-lg font-semibold text-[#0F2044] mb-2">{title}</h2>
      {children}
    </section>
  );
}
