// Single source of truth for the bc_consent decision, shared by
// AnalyticsConsent (owns the banner UI + GoogleAnalytics mount), GatedGaEvent
// (needs to know whether it's safe to fire yet), and anything that wants to
// reopen or capture attribution off the back of a consent decision.

const CONSENT_COOKIE = "bc_consent";
const ATTRIBUTION_COOKIE = "bc_attribution";
const PENDING_ATTRIBUTION_KEY = "bc_pending_attribution";
const CHANGE_EVENT = "bc-consent-change";
const REOPEN_EVENT = "bc-consent-reopen";

export type Consent = "granted" | "denied";

export function readConsent(): Consent | null {
  const match = document.cookie.match(/(?:^|; )bc_consent=([^;]*)/);
  const value = match?.[1];
  return value === "granted" || value === "denied" ? value : null;
}

// Deletes any cookie whose name matches GA4's own naming (_ga, _ga_<id>) —
// used on withdrawal so tracking actually stops, not just stops loading on
// future visits. Best-effort: cookies set with a different path/domain than
// this one can't be cleared from here, but GA4's own cookies are always
// path=/ on the current host.
function clearGoogleAnalyticsCookies() {
  document.cookie.split(";").forEach((entry) => {
    const name = entry.split("=")[0]?.trim();
    if (name === "_ga" || name?.startsWith("_ga_")) {
      document.cookie = `${name}=; path=/; max-age=0`;
    }
  });
}

export function writeConsent(value: Consent) {
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=31536000; samesite=lax`;
  if (value === "denied") clearGoogleAnalyticsCookies();
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: value }));
}

export function onConsentChange(handler: (value: Consent) => void): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<Consent>).detail);
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}

// Lets a "Cookie settings" control (footer, /settings) re-show the banner
// regardless of the existing cookie value.
export function reopenConsent() {
  window.dispatchEvent(new Event(REOPEN_EVENT));
}

export function onReopenConsent(handler: () => void): () => void {
  window.addEventListener(REOPEN_EVENT, handler);
  return () => window.removeEventListener(REOPEN_EVENT, handler);
}

// GoogleAnalytics sets window.dataLayer synchronously in its own inline
// script the moment it mounts, but that script insertion+execution isn't
// synchronous with the React render that mounts <GoogleAnalytics> — poll
// briefly rather than assume it's there the instant consent flips to granted.
export function waitForDataLayer(maxWaitMs = 3000): Promise<boolean> {
  return new Promise((resolve) => {
    const start = Date.now();
    (function poll() {
      if (typeof (window as unknown as { dataLayer?: unknown[] }).dataLayer !== "undefined") {
        resolve(true);
        return;
      }
      if (Date.now() - start >= maxWaitMs) {
        resolve(false);
        return;
      }
      setTimeout(poll, 50);
    })();
  });
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

function extractUtm(params: URLSearchParams): Record<string, string> | null {
  const found: Record<string, string> = {};
  let any = false;
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) {
      found[key] = value;
      any = true;
    }
  }
  return any ? found : null;
}

// Bridges "landed on page A with UTMs, decided on page B" within the same
// tab — sessionStorage isn't sent anywhere and is cleared when the tab
// closes, so it isn't itself a tracking cookie needing consent. Call on
// every mount, regardless of consent state.
export function stashPendingAttribution() {
  if (sessionStorage.getItem(PENDING_ATTRIBUTION_KEY)) return;

  const url = new URL(window.location.href);
  let utm = extractUtm(url.searchParams);

  if (!utm) {
    const nextValue = url.searchParams.get("next");
    if (nextValue) {
      try {
        const nextUrl = new URL(nextValue, window.location.origin);
        utm = extractUtm(nextUrl.searchParams);
      } catch {
        // next isn't a resolvable URL — nothing to extract
      }
    }
  }

  if (utm) sessionStorage.setItem(PENDING_ATTRIBUTION_KEY, JSON.stringify(utm));
}

// Only ever called from the Accept path — writes the real, longer-lived
// attribution cookie from whatever UTM signal is available (the stashed
// session value first, falling back to the current page), first-touch only.
export function captureAttributionIfPresent() {
  if (document.cookie.match(/(?:^|; )bc_attribution=/)) return;

  let utm: Record<string, string> | null = null;
  const pending = sessionStorage.getItem(PENDING_ATTRIBUTION_KEY);
  if (pending) {
    try {
      utm = JSON.parse(pending);
    } catch {
      utm = null;
    }
  }
  if (!utm) utm = extractUtm(new URL(window.location.href).searchParams);
  if (!utm) return;

  document.cookie = `${ATTRIBUTION_COOKIE}=${JSON.stringify(utm)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}
