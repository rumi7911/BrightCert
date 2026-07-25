const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

type UtmKey = (typeof UTM_KEYS)[number];
type UtmValues = Partial<Record<UtmKey, string>>;

export type SignupAttribution = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  first_utm_source: string | null;
  first_utm_medium: string | null;
  first_utm_campaign: string | null;
  first_utm_content: string | null;
  last_utm_source: string | null;
  last_utm_medium: string | null;
  last_utm_campaign: string | null;
  last_utm_content: string | null;
};

const emptyAttribution: SignupAttribution = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  first_utm_source: null,
  first_utm_medium: null,
  first_utm_campaign: null,
  first_utm_content: null,
  last_utm_source: null,
  last_utm_medium: null,
  last_utm_campaign: null,
  last_utm_content: null,
};

function decode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function toUtmValues(value: unknown): UtmValues | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  if (!Object.keys(value).every((key) => (UTM_KEYS as readonly string[]).includes(key))) return null;
  const result: UtmValues = {};
  for (const key of UTM_KEYS) {
    const candidate = (value as Record<string, unknown>)[key];
    if (candidate === undefined) continue;
    if (typeof candidate !== "string" || candidate.length === 0 || candidate.length > 200 || /[\u0000-\u001F\u007F]/.test(candidate)) {
      return null;
    }
    result[key] = candidate;
  }
  return Object.keys(result).length > 0 ? result : null;
}

function touchColumns(prefix: "first" | "last", touch: UtmValues): Partial<SignupAttribution> {
  return {
    [`${prefix}_utm_source`]: touch.utm_source ?? null,
    [`${prefix}_utm_medium`]: touch.utm_medium ?? null,
    [`${prefix}_utm_campaign`]: touch.utm_campaign ?? null,
    [`${prefix}_utm_content`]: touch.utm_content ?? null,
  } as Partial<SignupAttribution>;
}

// Runs on the server during account provisioning. It accepts legacy flat
// cookies but declines malformed or oversized input before inserting anything.
export function readSignupAttribution(raw: string | undefined): SignupAttribution {
  if (!raw || raw.length > 3800) return emptyAttribution;

  try {
    const parsed: unknown = JSON.parse(decode(raw));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return emptyAttribution;
    const record = parsed as Record<string, unknown>;
    const nested = "first_touch" in record || "last_touch" in record;
    if (
      nested &&
      !Object.keys(record).every((key) =>
        key === "first_touch" || key === "last_touch" || (UTM_KEYS as readonly string[]).includes(key)
      )
    ) {
      return emptyAttribution;
    }
    const firstTouch = toUtmValues(nested ? record.first_touch : record);
    const lastTouch = toUtmValues(nested ? record.last_touch : record);
    if (!firstTouch || !lastTouch) return emptyAttribution;

    return {
      utm_source: lastTouch.utm_source ?? null,
      utm_medium: lastTouch.utm_medium ?? null,
      utm_campaign: lastTouch.utm_campaign ?? null,
      utm_content: lastTouch.utm_content ?? null,
      ...touchColumns("first", firstTouch),
      ...touchColumns("last", lastTouch),
    } as SignupAttribution;
  } catch {
    return emptyAttribution;
  }
}
