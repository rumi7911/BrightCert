import type { Metadata } from "next";
import { SignalNav } from "@/components/brightcert/signal-nav";
import { SignalFooter } from "@/components/brightcert/signal-footer";
import { ScrollProgress } from "@/components/brightcert/scroll-progress";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing your use of BrightCert, operated by Cognumi Ltd.",
};

export default function TermsPage() {
  return (
    <div className="bg-[#F3F4EC]">
      <ScrollProgress />
      <SignalNav />

      <main className="pt-[150px] pb-24">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-display text-4xl font-bold text-[#0F2044] mb-2">Terms of Service</h1>
          <p className="text-sm text-[#64748B] mb-10">Last updated: 2 July 2026</p>

          <div className="space-y-8 text-[#475569] leading-relaxed text-[15px]">
            <section>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) govern your use of BrightCert,
                a service operated by Cognumi Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
                &ldquo;our&rdquo;), registered in England and Wales. By creating an account
                or using the service, you agree to these Terms.
              </p>
            </section>

            <Section title="1. What BrightCert provides">
              <p>
                BrightCert is a <strong>readiness assessment and preparation tool</strong>{" "}
                for the UK Cyber Essentials scheme. It helps you identify gaps and prepare
                before applying for certification.
              </p>
              <p className="mt-3 rounded-[16px] border border-[#FDE68A] bg-[#FFFBEB] p-4 text-[#92400E]">
                <strong>Important:</strong>{" "}BrightCert does not issue official Cyber
                Essentials certificates and is not an IASME-licensed Certification Body.
                Official certification can only be obtained through an IASME-accredited
                Certification Body. Our reports are preparation and gap-analysis tools and
                do not guarantee that you will pass certification.
              </p>
            </Section>

            <Section title="2. Eligibility and accounts">
              <p>
                You must be at least 18 years old and authorised to act on behalf of the
                organisation you register. You are responsible for keeping your account
                secure and for all activity under your account.
              </p>
            </Section>

            <Section title="3. Payment">
              <p>
                Completing an assessment is free. Access to the full report and PDF
                download requires a one-time payment. Prices are shown in GBP and
                processed by Stripe. Additional products or subscriptions are governed by
                the pricing shown at the point of purchase.
              </p>
            </Section>

            <Section title="4. Refunds">
              <p>
                If you are not satisfied with your report, contact us at{" "}
                <a href="mailto:hello@brightcert.co.uk" className="text-[#059669] hover:underline">
                  hello@brightcert.co.uk
                </a>{" "}
                and we will consider refund requests in good faith and in accordance with
                your statutory rights.
              </p>
            </Section>

            <Section title="5. Acceptable use">
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Use the service unlawfully or for any fraudulent purpose.</li>
                <li>Attempt to disrupt, reverse-engineer, or gain unauthorised access to the service.</li>
                <li>Resell or misrepresent the service or its outputs as official certification.</li>
              </ul>
            </Section>

            <Section title="6. Intellectual property">
              <p>
                The service, its content, and its branding are owned by Cognumi Ltd. The
                report generated for your organisation is provided for your internal use.
                You retain ownership of the information you submit.
              </p>
            </Section>

            <Section title="7. Disclaimers">
              <p>
                The service is provided &ldquo;as is&rdquo; without warranties of any kind.
                While we aim for accuracy, assessment outputs are generated with the
                assistance of automated analysis and are provided for guidance only. You
                are responsible for your own compliance decisions.
              </p>
            </Section>

            <Section title="8. Limitation of liability">
              <p>
                To the maximum extent permitted by law, Cognumi Ltd is not liable for any
                indirect or consequential loss, or for any failure to achieve certification.
                Our total liability arising from the service is limited to the amount you
                paid to us in the twelve months preceding the claim. Nothing in these Terms
                limits liability that cannot be limited under applicable law.
              </p>
            </Section>

            <Section title="9. Termination">
              <p>
                You may stop using the service and request account deletion at any time. We
                may suspend or terminate accounts that breach these Terms.
              </p>
            </Section>

            <Section title="10. Governing law">
              <p>
                These Terms are governed by the laws of England and Wales, and the courts
                of England and Wales have exclusive jurisdiction over any disputes.
              </p>
            </Section>

            <Section title="11. Contact">
              <p>
                Questions about these Terms? Email{" "}
                <a href="mailto:hello@brightcert.co.uk" className="text-[#059669] hover:underline">
                  hello@brightcert.co.uk
                </a>
                .
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
