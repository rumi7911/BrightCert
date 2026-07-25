import { SUPPORTED_COMPANY_TYPES, normalizeCompanyNumber } from "./gate";

const COMPANIES_HOUSE_BASE_URL =
  "https://api.company-information.service.gov.uk/company";
const DEFAULT_TIMEOUT_MS = 8_000;
const MAX_ATTEMPTS = 3;

interface CompanyProfile {
  company_number: string;
  company_status: string;
  type: string;
}

interface VerificationBase {
  companyNumber: string;
}

export type CompanyVerificationResult =
  | (VerificationBase & {
      kind: "active";
      companyStatus: "active";
      companyType: string;
      checkedAt: string;
    })
  | (VerificationBase & {
      kind: "inactive";
      companyStatus: string;
      companyType: string;
      checkedAt: string;
    })
  | (VerificationBase & {
      kind: "unsupported";
      companyStatus: string;
      companyType: string;
      checkedAt: string;
    })
  | (VerificationBase & { kind: "not_found" })
  | (VerificationBase & {
      kind: "error";
      code:
        | "invalid_company_number"
        | "missing_api_key"
        | "unauthorized"
        | "rate_limited"
        | "server_error"
        | "http_error"
        | "timeout"
        | "network_error"
        | "invalid_response"
        | "company_number_mismatch";
    });

export interface CompaniesHouseOptions {
  apiKey: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  sleep?: (milliseconds: number) => Promise<void>;
  now?: () => Date;
}

function defaultSleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function isCompanyProfile(value: unknown): value is CompanyProfile {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.company_number === "string" &&
    typeof candidate.company_status === "string" &&
    typeof candidate.type === "string"
  );
}

async function requestWithTimeout(
  url: string,
  authorization: string,
  fetchImpl: typeof fetch,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: authorization,
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function verifyCompanyNumber(
  value: string,
  options: CompaniesHouseOptions
): Promise<CompanyVerificationResult> {
  const companyNumber = normalizeCompanyNumber(value);
  if (!companyNumber || !/^[A-Z0-9]{2,8}$/.test(companyNumber)) {
    return { kind: "error", companyNumber, code: "invalid_company_number" };
  }
  if (!options.apiKey) {
    return { kind: "error", companyNumber, code: "missing_api_key" };
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const sleep = options.sleep ?? defaultSleep;
  const now = options.now ?? (() => new Date());
  const authorization = `Basic ${Buffer.from(`${options.apiKey}:`).toString("base64")}`;
  const url = `${COMPANIES_HOUSE_BASE_URL}/${encodeURIComponent(companyNumber)}`;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    let response: Response;
    try {
      response = await requestWithTimeout(
        url,
        authorization,
        fetchImpl,
        timeoutMs
      );
    } catch (error) {
      if (
        error instanceof DOMException
          ? error.name === "AbortError"
          : error instanceof Error && error.name === "AbortError"
      ) {
        return { kind: "error", companyNumber, code: "timeout" };
      }
      return { kind: "error", companyNumber, code: "network_error" };
    }

    if (response.status === 404) return { kind: "not_found", companyNumber };
    if (response.status === 401 || response.status === 403) {
      return { kind: "error", companyNumber, code: "unauthorized" };
    }

    const retryable = response.status === 429 || response.status >= 500;
    if (retryable) {
      if (attempt < MAX_ATTEMPTS) {
        await sleep(Math.min(200 * 2 ** (attempt - 1), 1_000));
        continue;
      }
      return {
        kind: "error",
        companyNumber,
        code: response.status === 429 ? "rate_limited" : "server_error",
      };
    }

    if (!response.ok) {
      return { kind: "error", companyNumber, code: "http_error" };
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      return { kind: "error", companyNumber, code: "invalid_response" };
    }
    if (!isCompanyProfile(payload)) {
      return { kind: "error", companyNumber, code: "invalid_response" };
    }
    if (normalizeCompanyNumber(payload.company_number) !== companyNumber) {
      return {
        kind: "error",
        companyNumber,
        code: "company_number_mismatch",
      };
    }

    const checkedAt = now().toISOString();
    const companyStatus = payload.company_status.trim().toLowerCase();
    const companyType = payload.type.trim().toLowerCase();
    if (
      !SUPPORTED_COMPANY_TYPES.includes(
        companyType as (typeof SUPPORTED_COMPANY_TYPES)[number]
      )
    ) {
      return {
        kind: "unsupported",
        companyNumber,
        companyStatus,
        companyType,
        checkedAt,
      };
    }
    if (companyStatus !== "active") {
      return {
        kind: "inactive",
        companyNumber,
        companyStatus,
        companyType,
        checkedAt,
      };
    }
    return {
      kind: "active",
      companyNumber,
      companyStatus: "active",
      companyType,
      checkedAt,
    };
  }

  return { kind: "error", companyNumber, code: "server_error" };
}
