"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { getQuestionsBySection } from "@/lib/questions";

const AREAS = [
  {
    id: 1,
    name: "Boundary Firewalls & Internet Gateways",
    body: "Whether your business has suitable protection between your internal systems and the internet: the first line of defence against external attack.",
  },
  {
    id: 2,
    name: "Secure Configuration",
    body: "Whether devices, systems and software are configured securely before they are used: removing default passwords, unneeded accounts and services.",
  },
  {
    id: 3,
    name: "User Access Control",
    body: "Who has access to your systems and whether permissions are appropriate: unique accounts, least privilege, and proper joiners and leavers processes.",
  },
  {
    id: 4,
    name: "Malware Protection",
    body: "Whether your devices are protected from malware and unsafe applications: active anti-malware, application allow-listing and safe defaults.",
  },
  {
    id: 5,
    name: "Security Update Management",
    body: "Whether software and devices are kept updated against known vulnerabilities: patching within 14 days for critical and high-risk updates.",
  },
];

export function ControlAccordion() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <div className="grid gap-3.5">
      {AREAS.map((area) => {
        const count = getQuestionsBySection(area.id).length;
        const isOpen = openId === area.id;
        return (
          <article
            key={area.id}
            className={`overflow-hidden rounded-[22px] border bg-white transition-all duration-300 ${
              isOpen ? "border-[#059669]/[0.4] shadow-[0_18px_44px_-24px_rgba(15,32,68,0.22)]" : "border-[#0F2044]/[0.07]"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : area.id)}
              aria-expanded={isOpen}
              className="grid w-full grid-cols-[36px_1fr_40px] sm:grid-cols-[60px_1fr_auto_40px] items-center gap-3 sm:gap-4 px-5 sm:px-6 py-6 text-left"
            >
              <span className={`font-mono text-[13px] font-bold transition-colors ${isOpen ? "text-[#059669]" : "text-[#64748B]"}`}>
                0{area.id}
              </span>
              <span className="font-display text-[16px] sm:text-[21px] font-semibold tracking-[-0.015em] text-[#0F2044]">
                {area.name}
              </span>
              <span
                className={`hidden sm:inline-block rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${
                  isOpen ? "bg-[#047857] text-white" : "bg-[#EBEDDE] text-[#64748B]"
                }`}
              >
                {count} questions
              </span>
              <span
                className={`flex h-[34px] w-[34px] items-center justify-center rounded-full border transition-all duration-500 ${
                  isOpen ? "rotate-180 border-[#0F2044] bg-[#0F2044] text-[#6EE7B7]" : "border-[#0F2044]/[0.15] text-[#475569]"
                }`}
              >
                <ChevronDown className="h-4 w-4" strokeWidth={1.8} />
              </span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className={`px-5 sm:pl-[104px] sm:pr-6 ${isOpen ? "pb-6" : ""}`}>
                  <p className="text-[15px] text-[#475569] max-w-[64ch] mb-[18px]">{area.body}</p>
                  <div className="h-1.5 max-w-[420px] overflow-hidden rounded-full bg-[#EBEDDE]">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-[#059669] to-[#6EE7B7] transition-[width] duration-700"
                      style={{ width: isOpen ? "100%" : "0%" }}
                    />
                  </div>
                  <span className="mt-2.5 block font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#64748B]">
                    {count} of 60 questions · assessed in depth
                  </span>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
