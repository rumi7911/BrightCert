import { describe, expect, test, vi } from "vitest";
import { verifyCompanyNumber } from "./companies-house";

function profile(overrides: Record<string, unknown> = {}) {
  return {
    company_number: "00123456",
    company_status: "active",
    type: "ltd",
    company_name: "EXAMPLE MANUFACTURING LIMITED",
    ...overrides,
  };
}

describe("Companies House verification", () => {
  test("uses an exact normalized company-number profile lookup with Basic auth", async () => {
    let requestUrl = "";
    let authorization = "";
    const fetchImpl: typeof fetch = async (input, init) => {
      requestUrl = String(input);
      authorization = new Headers(init?.headers).get("authorization") ?? "";
      return Response.json(profile());
    };

    const result = await verifyCompanyNumber(" 00-123-456 ", {
      apiKey: "private-test-key",
      fetchImpl,
      now: () => new Date("2026-07-25T12:00:00Z"),
    });

    expect(requestUrl).toBe(
      "https://api.company-information.service.gov.uk/company/00123456"
    );
    expect(authorization).toBe(
      `Basic ${Buffer.from("private-test-key:").toString("base64")}`
    );
    expect(result).toEqual({
      kind: "active",
      companyNumber: "00123456",
      companyStatus: "active",
      companyType: "ltd",
      checkedAt: "2026-07-25T12:00:00.000Z",
    });
    expect(JSON.stringify(result)).not.toContain("private-test-key");
    expect(JSON.stringify(result)).not.toContain("EXAMPLE MANUFACTURING");
  });

  test("maps an inactive exact-number profile without approving it", async () => {
    const result = await verifyCompanyNumber("00123456", {
      apiKey: "test-key",
      fetchImpl: async () =>
        Response.json(profile({ company_status: "dissolved" })),
    });

    expect(result).toMatchObject({
      kind: "inactive",
      companyNumber: "00123456",
      companyStatus: "dissolved",
      companyType: "ltd",
    });
  });

  test("rejects an active unsupported entity type", async () => {
    const result = await verifyCompanyNumber("00123456", {
      apiKey: "test-key",
      fetchImpl: async () => Response.json(profile({ type: "registered-overseas-entity" })),
    });

    expect(result).toMatchObject({
      kind: "unsupported",
      companyNumber: "00123456",
      companyStatus: "active",
      companyType: "registered-overseas-entity",
    });
  });

  test("maps a 404 to not_found without retrying", async () => {
    let attempts = 0;
    const result = await verifyCompanyNumber("00123456", {
      apiKey: "test-key",
      fetchImpl: async () => {
        attempts += 1;
        return Response.json({ errors: [{ error: "company-profile-not-found" }] }, { status: 404 });
      },
    });

    expect(result).toMatchObject({ kind: "not_found", companyNumber: "00123456" });
    expect(attempts).toBe(1);
  });

  test("retries 429 and 5xx responses with bounded backoff up to three total attempts", async () => {
    let attempts = 0;
    const delays: number[] = [];
    const result = await verifyCompanyNumber("00123456", {
      apiKey: "test-key",
      fetchImpl: async () => {
        attempts += 1;
        if (attempts === 1) return new Response(null, { status: 429 });
        if (attempts === 2) return new Response(null, { status: 503 });
        return Response.json(profile());
      },
      sleep: async (milliseconds) => {
        delays.push(milliseconds);
      },
    });

    expect(result.kind).toBe("active");
    expect(attempts).toBe(3);
    expect(delays).toEqual([200, 400]);
  });

  test("stops after three server failures and returns a safe typed error", async () => {
    let attempts = 0;
    const result = await verifyCompanyNumber("00123456", {
      apiKey: "test-key",
      fetchImpl: async () => {
        attempts += 1;
        return Response.json(
          { secret_internal_payload: "must-not-leak" },
          { status: 503 }
        );
      },
      sleep: async () => undefined,
    });

    expect(result).toEqual({
      kind: "error",
      companyNumber: "00123456",
      code: "server_error",
    });
    expect(attempts).toBe(3);
    expect(JSON.stringify(result)).not.toContain("must-not-leak");
  });

  test("aborts a request at the configured timeout", async () => {
    const fetchImpl: typeof fetch = async (_input, init) =>
      await new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("request included private details", "AbortError"));
        });
      });

    const result = await verifyCompanyNumber("00123456", {
      apiKey: "test-key",
      fetchImpl,
      timeoutMs: 5,
    });

    expect(result).toEqual({
      kind: "error",
      companyNumber: "00123456",
      code: "timeout",
    });
  });

  test("rejects a response whose company number does not exactly match", async () => {
    const result = await verifyCompanyNumber("00123456", {
      apiKey: "test-key",
      fetchImpl: async () =>
        Response.json(profile({ company_number: "00999999" })),
    });

    expect(result).toEqual({
      kind: "error",
      companyNumber: "00123456",
      code: "company_number_mismatch",
    });
  });

  test.each([
    ["", "invalid_company_number"],
    ["12345678", "missing_api_key"],
  ])("maps invalid input safely", async (companyNumber, code) => {
    const result = await verifyCompanyNumber(companyNumber, {
      apiKey: "",
      fetchImpl: vi.fn(),
    });

    expect(result).toMatchObject({ kind: "error", code });
  });
});
