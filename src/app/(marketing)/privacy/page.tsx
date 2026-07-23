import type { Metadata } from "next";
import { SignalNav } from "@/components/brightcert/signal-nav";
import { SignalFooter } from "@/components/brightcert/signal-footer";
import { ScrollProgress } from "@/components/brightcert/scroll-progress";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How BrightCert (Cognumi Ltd) collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#F3F4EC]">
      <ScrollProgress />
      <SignalNav />

      <main className="pt-[150px] pb-24">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-display text-4xl font-bold text-[#0F2044] mb-2">Privacy Policy</h1>
          <p className="text-sm text-[#64748B] mb-10">Last updated: 2 July 2026</p>

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
              </ul>
            </Section>

            <Section title="3. How we use your data">
              <ul className="list-disc pl-5 space-y-1.5">
                <li>To provide the readiness assessment and generate your report.</li>
                <li>To create and manage your account and process payments.</li>
                <li>To send you service-related emails (sign-in links, report notifications).</li>
                <li>To operate, secure, and improve the service.</li>
              </ul>
              <p className="mt-3">
                Our legal bases are performance of a contract with you, our legitimate
                interests in operating and improving the service, and your consent where
                required.
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
              <p>We use the following processors to run the service:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li><strong>Supabase</strong>{" "}— database and authentication (data hosted in the EU/London region).</li>
                <li><strong>Google Cloud</strong>{" "}— the Gemini API (assessment analysis) and Cloud Storage (report PDFs, EU region).</li>
                <li><strong>Stripe</strong>{" "}— payment processing.</li>
                <li><strong>Resend</strong>{" "}— transactional email delivery.</li>
                <li><strong>Vercel</strong>{" "}— application hosting.</li>
              </ul>
              <p className="mt-3">
                We do not sell your personal data. Where data is transferred outside the
                UK, we rely on appropriate safeguards such as the UK International Data
                Transfer Agreement or adequacy regulations.
              </p>
            </Section>

            <Section title="6. Data retention">
              <p>
                We keep your account and assessment data for as long as your account is
                active or as needed to provide the service, and thereafter only as
                required to meet legal, accounting, or reporting obligations. You may
                request deletion of your account and associated data at any time.
              </p>
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
              </ul>
              <p className="mt-3">
                To exercise any of these, email{" "}
                <a href="mailto:hello@brightcert.co.uk" className="text-[#059669] hover:underline">
                  hello@brightcert.co.uk
                </a>
                . You also have the right to lodge a complaint with the Information
                Commissioner&rsquo;s Office (ICO) at ico.org.uk.
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
