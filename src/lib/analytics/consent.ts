"use client";

import { sendGAEvent } from "@next/third-parties/google";

const CONSENT_COOKIE = "bc_consent";
const ATTRIBUTION_COOKIE = "bc_attribution";
const LEGACY_PENDING_ATTRIBUTION_KEY = "bc_pending_attribution";
const CHANGE_EVENT = "bc-consent-change";
const REOPEN_EVENT = "bc-consent-reopen";
const ATTRIBUTION_COOKIE_MAX_BYTES = 3800;
const UTM_VALUE_MAX_LENGTH = 200;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
const GA_DISABLE_FLAG = "ga-disable-G-YW9BG1DXPC";

type UtmKey = (typeof UTM_KEYS)[number];
type UtmValues = Partial<Record<UtmKey, string>>;

export type Attribution = {
  first_touch: UtmValues;
  last_touch: UtmValues;
} & UtmValues;

export type Consent = "granted" | "denied";

function cookieOptions(maxAge: number) {
  const secure = window.location.protocol === "https:" && process.env.NODE_ENV === "production" ? "; secure" : "";
  return `path=/; max-age=${maxAge}; samesite=lax${secure}`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; ${cookieOptions(0)}`;
}

function isValidUtmValue(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= UTM_VALUE_MAX_LENGTH &&
    !/[\u0000-\u001F\u007F]/.test(value)
  );
}

function pickUtmValues(value: unknown): UtmValues | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  if (!Object.keys(value).every((key) => (UTM_KEYS as readonly string[]).includes(key))) return null;

  const result: UtmValues = {};
  for (const key of UTM_KEYS) {
    const candidate = (value as Record<string, unknown>)[key];
    if (candidate === undefined) continue;
    if (!isValidUtmValue(candidate)) return null;
    result[key] = candidate;
  }
  return Object.keys(result).length > 0 ? result : null;
}

function decodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// Accepts both the former flat shape and the consented first-/last-touch
// shape. Invalid cookies are declined rather than partially trusted.
export function parseAttributionCookie(raw: string | undefined): Attribution | null {
  if (!raw || raw.length > ATTRIBUTION_COOKIE_MAX_BYTES) return null;

  try {
    const parsed: unknown = JSON.parse(decodeCookieValue(raw));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const record = parsed as Record<string, unknown>;
    const hasTouchShape = "first_touch" in record || "last_touch" in record;
    if (
      hasTouchShape &&
      !Object.keys(record).every((key) =>
        key === "first_touch" || key === "last_touch" || (UTM_KEYS as readonly string[]).includes(key)
      )
    ) {
      return null;
    }
    const firstTouch = pickUtmValues(hasTouchShape ? record.first_touch : record);
    const lastTouch = pickUtmValues(hasTouchShape ? record.last_touch : record);
    if (!firstTouch || !lastTouch) return null;

    return {
      first_touch: firstTouch,
      last_touch: lastTouch,
      ...lastTouch,
    };
  } catch {
    return null;
  }
}

function readCookie(name: string): string | undefined {
  return document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1];
}

export function readConsent(): Consent | null {
  const value = readCookie(CONSENT_COOKIE);
  return value === "granted" || value === "denied" ? value : null;
}

function clearGoogleAnalyticsCookies() {
  document.cookie.split(";").forEach((entry) => {
    const name = entry.split("=")[0]?.trim();
    if (name === "_ga" || name?.startsWith("_ga_")) deleteCookie(name);
  });
}

function removeLegacyAttributionStorage() {
  // Earlier builds used session storage before consent. Clearing both stores is
  // intentionally best effort: privacy withdrawal must never fail on a browser
  // that has storage disabled.
  for (const storage of [window.sessionStorage, window.localStorage]) {
    try {
      storage.removeItem(LEGACY_PENDING_ATTRIBUTION_KEY);
    } catch {
      // Storage is unavailable; there is no in-browser state we can remove.
    }
  }
}

export function clearTrackingState() {
  (window as Window & { [GA_DISABLE_FLAG]?: boolean })[GA_DISABLE_FLAG] = true;
  deleteCookie(ATTRIBUTION_COOKIE);
  clearGoogleAnalyticsCookies();
  removeLegacyAttributionStorage();
  document
    .querySelectorAll('script#_next-ga, script#_next-ga-init, script[src*="googletagmanager.com/gtag/js"]')
    .forEach((script) => script.remove());
  delete (window as Window & { dataLayer?: unknown[]; gtag?: unknown }).dataLayer;
  delete (window as Window & { dataLayer?: unknown[]; gtag?: unknown }).gtag;
}

export function writeConsent(value: Consent) {
  document.cookie = `${CONSENT_COOKIE}=${value}; ${cookieOptions(31536000)}`;
  if (value === "granted") delete (window as Window & { [GA_DISABLE_FLAG]?: boolean })[GA_DISABLE_FLAG];
  else clearTrackingState();
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: value }));
}

export function onConsentChange(handler: (value: Consent) => void): () => void {
  const listener = (event: Event) => handler((event as CustomEvent<Consent>).detail);
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}

export function reopenConsent() {
  window.dispatchEvent(new Event(REOPEN_EVENT));
}

export function onReopenConsent(handler: () => void): () => void {
  window.addEventListener(REOPEN_EVENT, handler);
  return () => window.removeEventListener(REOPEN_EVENT, handler);
}

export function enableAnalyticsEvents() {
  if (readConsent() === "granted") delete (window as Window & { [GA_DISABLE_FLAG]?: boolean })[GA_DISABLE_FLAG];
}

export function canSendAnalyticsEvents() {
  return (
    readConsent() === "granted" &&
    (window as Window & { [GA_DISABLE_FLAG]?: boolean })[GA_DISABLE_FLAG] !== true
  );
}

export function sendConsentedGAEvent(event: string, params: Record<string, string | number> = {}) {
  if (canSendAnalyticsEvents()) sendGAEvent("event", event, params);
}

export function waitForDataLayer(maxWaitMs = 3000): Promise<boolean> {
  return new Promise((resolve) => {
    const start = Date.now();
    (function poll() {
      if (!canSendAnalyticsEvents()) {
        resolve(false);
        return;
      }
      if (typeof (window as Window & { dataLayer?: unknown[] }).dataLayer !== "undefined") {
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

function extractUtm(params: URLSearchParams): UtmValues | null {
  const result: UtmValues = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value && isValidUtmValue(value)) result[key] = value;
  }
  return Object.keys(result).length > 0 ? result : null;
}

// Attribution is read directly from the current URL only after consent. This
// deliberately does not bridge tabs/pages with local or session storage.
export function captureAttributionIfPresent() {
  if (readConsent() !== "granted") return;

  const existingRaw = readCookie(ATTRIBUTION_COOKIE);
  const existing = existingRaw ? parseAttributionCookie(existingRaw) : null;
  if (existingRaw && !existing) deleteCookie(ATTRIBUTION_COOKIE);

  const currentTouch = extractUtm(new URL(window.location.href).searchParams);
  if (!currentTouch) return;

  const attribution: Attribution = {
    first_touch: existing?.first_touch ?? currentTouch,
    last_touch: currentTouch,
    ...currentTouch,
  };
  const serialized = encodeURIComponent(JSON.stringify(attribution));
  if (serialized.length > ATTRIBUTION_COOKIE_MAX_BYTES) return;

  document.cookie = `${ATTRIBUTION_COOKIE}=${serialized}; ${cookieOptions(60 * 60 * 24 * 30)}`;
}
