import { Mail, MessageSquareText } from "lucide-react";
import { SignalFooter } from "@/components/brightcert/signal-footer";
import { SignalNav } from "@/components/brightcert/signal-nav";
import { metadataFor, SITE_PAGES } from "@/lib/seo/registry";
import { ContactForm } from "./contact-form";

export const metadata = metadataFor(SITE_PAGES.contact);

export default function ContactPage() {
  return (
    <>
      <SignalNav />
      <main className="min-h-[100dvh] overflow-hidden bg-[#F3F4EC] px-4 pb-20 pt-28 sm:pt-32 lg:pb-28">
        <div className="mx-auto grid max-w-[1120px] gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-start md:gap-14 lg:gap-20">
          <section className="md:sticky md:top-32">
            <div className="mb-6 grid h-12 w-12 place-items-center rounded-[12px] bg-[#0F2044] text-[#6EE7B7] shadow-[0_14px_32px_-18px_rgba(15,32,68,0.7)]">
              <MessageSquareText className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </div>
            <h1 className="font-display max-w-[12ch] text-4xl font-bold leading-[1.04] tracking-tight text-[#0F2044] sm:text-5xl">
              Talk to BrightCert
            </h1>
            <p className="mt-5 max-w-[40ch] text-base leading-relaxed text-[#475569] sm:text-lg">
              Ask about an assessment, report, billing, privacy or working with us.
            </p>

            <div className="mt-9 border-t border-[#0F2044]/10 pt-6">
              <p className="text-sm font-semibold text-[#0F2044]">Email us directly</p>
              <a
                href="mailto:hello@brightcert.co.uk"
                className="mt-2 inline-flex min-h-11 items-center gap-2 break-all rounded-[8px] text-[15px] font-bold text-[#047857] underline decoration-[#047857]/35 underline-offset-4 transition-colors hover:text-[#065F46] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857]"
              >
                <Mail className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                hello@brightcert.co.uk
              </a>
              <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-[#64748B]">
                We reply by email as soon as possible.
              </p>
            </div>
          </section>

          <section className="rounded-[16px] border border-[#0F2044]/[0.08] bg-white p-5 shadow-[0_24px_70px_-38px_rgba(15,32,68,0.32)] sm:p-8 lg:p-10">
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#0F2044]">
              Send a message
            </h2>
            <p className="mt-2 mb-7 max-w-[52ch] text-sm leading-relaxed text-[#64748B]">
              Share enough context for us to route your question and give you a useful reply.
            </p>
            <ContactForm />
          </section>
        </div>
      </main>
      <SignalFooter />
    </>
  );
}
