// @vitest-environment node

import { afterEach, describe, expect, test, vi } from "vitest";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
import ReportPage from "./page";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/stripe/client", () => ({
  getStripe: vi.fn(),
}));

vi.mock("@/lib/gcs/upload", () => ({
  getReportSignedUrl: vi.fn(),
}));

function reportPageClient() {
  const assessment = {
    id: "assessment-refunded",
    status: "analysed",
    overall_score: 72,
    overall_status: "nearly_ready",
    stripe_session_id: null,
    amount_paid: null,
    currency: null,
    organisations: { name: "Refunded Ltd" },
  };
  const assessmentQuery = {
    select: vi.fn(),
    update: vi.fn(),
    eq: vi.fn(),
    single: vi.fn().mockResolvedValue({ data: assessment, error: null }),
  };
  assessmentQuery.select.mockReturnValue(assessmentQuery);
  assessmentQuery.update.mockReturnValue(assessmentQuery);
  assessmentQuery.eq.mockReturnValue(assessmentQuery);

  const reportQuery = {
    select: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  };
  reportQuery.select.mockReturnValue(reportQuery);
  reportQuery.eq.mockReturnValue(reportQuery);
  reportQuery.order.mockReturnValue(reportQuery);
  reportQuery.limit.mockReturnValue(reportQuery);

  return {
    assessmentQuery,
    client: {
      from: vi.fn((table: string) => {
        if (table === "assessments") return assessmentQuery;
        if (table === "reports") return reportQuery;
        throw new Error(`Unexpected table: ${table}`);
      }),
    },
  };
}

describe("refunded Checkout Session report access", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test("does not restore paid access from a fully refunded success URL", async () => {
    const { client, assessmentQuery } = reportPageClient();
    const retrieveSession = vi.fn().mockResolvedValue({
      id: "cs_test_refunded",
      payment_status: "paid",
      metadata: { assessmentId: "assessment-refunded" },
      amount_total: 9900,
      currency: "gbp",
      payment_intent: {
        id: "pi_refunded",
        latest_charge: {
          id: "ch_refunded",
          refunded: true,
        },
      },
    });

    vi.mocked(createClient).mockResolvedValue(client as never);
    vi.mocked(getStripe).mockReturnValue({
      checkout: {
        sessions: {
          retrieve: retrieveSession,
        },
      },
    } as never);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response()));

    await expect(
      ReportPage({
        params: Promise.resolve({ id: "assessment-refunded" }),
        searchParams: Promise.resolve({ session_id: "cs_test_refunded" }),
      })
    ).rejects.toThrow(
      "NEXT_REDIRECT:/assessment/assessment-refunded/results"
    );

    expect(retrieveSession).toHaveBeenCalledWith("cs_test_refunded", {
      expand: ["payment_intent.latest_charge"],
    });
    expect(assessmentQuery.update).not.toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith(
      "/assessment/assessment-refunded/results"
    );
  });

  test("still unlocks a paid Checkout Session whose charge was not refunded", async () => {
    const { client, assessmentQuery } = reportPageClient();
    const retrieveSession = vi.fn().mockResolvedValue({
      id: "cs_test_paid",
      payment_status: "paid",
      metadata: { assessmentId: "assessment-refunded" },
      amount_total: 9900,
      currency: "gbp",
      payment_intent: {
        id: "pi_paid",
        latest_charge: {
          id: "ch_paid",
          refunded: false,
        },
      },
    });

    vi.mocked(createClient).mockResolvedValue(client as never);
    vi.mocked(getStripe).mockReturnValue({
      checkout: {
        sessions: {
          retrieve: retrieveSession,
        },
      },
    } as never);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response()));

    await expect(
      ReportPage({
        params: Promise.resolve({ id: "assessment-refunded" }),
        searchParams: Promise.resolve({ session_id: "cs_test_paid" }),
      })
    ).resolves.toBeDefined();

    expect(retrieveSession).toHaveBeenCalledWith("cs_test_paid", {
      expand: ["payment_intent.latest_charge"],
    });
    expect(assessmentQuery.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "paid",
        stripe_session_id: "cs_test_paid",
        amount_paid: 9900,
        currency: "gbp",
      })
    );
  });
});
