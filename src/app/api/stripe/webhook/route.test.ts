// @vitest-environment node

import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { getStripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/server";
import { POST } from "./route";

vi.mock("@/lib/stripe/client", () => ({
  getStripe: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: vi.fn(),
}));

function webhookRequest() {
  return new NextRequest("http://localhost/api/stripe/webhook", {
    method: "POST",
    headers: {
      "stripe-signature": "valid-test-signature",
    },
    body: "{}",
  });
}

function assessmentUpdateClient() {
  const query = {
    update: vi.fn(),
    eq: vi.fn(),
  };
  query.update.mockReturnValue(query);
  query.eq.mockReturnValue(query);

  return {
    query,
    client: {
      from: vi.fn().mockReturnValue(query),
    },
  };
}

describe("Stripe refund webhook", () => {
  beforeEach(() => {
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  });

  afterEach(() => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    vi.restoreAllMocks();
  });

  test("revokes the matching paid assessment after a full charge refund", async () => {
    const { client, query } = assessmentUpdateClient();
    const listSessions = vi.fn().mockResolvedValue({
      data: [
        {
          id: "cs_test_refunded",
          metadata: { assessmentId: "assessment-refunded" },
        },
      ],
    });

    vi.mocked(getStripe).mockReturnValue({
      webhooks: {
        constructEvent: vi.fn().mockReturnValue({
          type: "charge.refunded",
          data: {
            object: {
              id: "ch_refunded",
              refunded: true,
              amount_refunded: 9900,
              payment_intent: "pi_refunded",
            },
          },
        }),
      },
      checkout: {
        sessions: {
          list: listSessions,
        },
      },
    } as never);
    vi.mocked(createAdminClient).mockReturnValue(client as never);

    const response = await POST(webhookRequest());

    expect(response.status).toBe(200);
    expect(listSessions).toHaveBeenCalledWith({
      payment_intent: "pi_refunded",
      limit: 1,
    });
    expect(client.from).toHaveBeenCalledWith("assessments");
    expect(query.update).toHaveBeenCalledWith({
      status: "analysed",
      stripe_session_id: null,
      amount_paid: null,
      currency: null,
      paid_at: null,
      reminder_sent_at: expect.any(String),
    });
    expect(query.eq.mock.calls).toEqual([
      ["id", "assessment-refunded"],
      ["stripe_session_id", "cs_test_refunded"],
      ["status", "paid"],
    ]);
  });

  test("keeps entitlement after a partial refund", async () => {
    const { client, query } = assessmentUpdateClient();
    const listSessions = vi.fn();

    vi.mocked(getStripe).mockReturnValue({
      webhooks: {
        constructEvent: vi.fn().mockReturnValue({
          type: "charge.refunded",
          data: {
            object: {
              id: "ch_partially_refunded",
              refunded: false,
              amount_refunded: 1000,
              payment_intent: "pi_partially_refunded",
            },
          },
        }),
      },
      checkout: {
        sessions: {
          list: listSessions,
        },
      },
    } as never);
    vi.mocked(createAdminClient).mockReturnValue(client as never);

    const response = await POST(webhookRequest());

    expect(response.status).toBe(200);
    expect(listSessions).not.toHaveBeenCalled();
    expect(client.from).not.toHaveBeenCalled();
    expect(query.update).not.toHaveBeenCalled();
  });

  test("returns an error so Stripe retries when entitlement revocation fails", async () => {
    const { client, query } = assessmentUpdateClient();
    Object.assign(query, {
      then: (
        resolve: (result: { error: { message: string } }) => unknown
      ) => Promise.resolve({ error: { message: "database unavailable" } }).then(resolve),
    });

    vi.mocked(getStripe).mockReturnValue({
      webhooks: {
        constructEvent: vi.fn().mockReturnValue({
          type: "charge.refunded",
          data: {
            object: {
              id: "ch_refunded",
              refunded: true,
              amount_refunded: 9900,
              payment_intent: "pi_refunded",
            },
          },
        }),
      },
      checkout: {
        sessions: {
          list: vi.fn().mockResolvedValue({
            data: [
              {
                id: "cs_test_refunded",
                metadata: { assessmentId: "assessment-refunded" },
              },
            ],
          }),
        },
      },
    } as never);
    vi.mocked(createAdminClient).mockReturnValue(client as never);
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(webhookRequest());

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "Database update failed",
    });
  });
});
