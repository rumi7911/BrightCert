import { afterEach, describe, expect, test, vi } from "vitest";
import {
  captureAttributionIfPresent,
  clearTrackingState,
  parseAttributionCookie,
  readConsent,
  writeConsent,
} from "./consent";

function clearCookies() {
  document.cookie.split(";").forEach((entry) => {
    const name = entry.split("=")[0]?.trim();
    if (name) document.cookie = `${name}=; path=/; max-age=0`;
  });
}

afterEach(() => {
  clearCookies();
  window.history.replaceState({}, "", "http://localhost/");
  sessionStorage.clear();
  localStorage.clear();
  document.querySelectorAll("#_next-ga, #_next-ga-init").forEach((node) => node.remove());
  delete (window as Window & { dataLayer?: unknown[] }).dataLayer;
});

describe("consented attribution", () => {
  test("reads legacy flat attribution as matching first and last touch", () => {
    expect(parseAttributionCookie(JSON.stringify({ utm_source: "newsletter", utm_campaign: "launch" }))).toEqual({
      first_touch: { utm_source: "newsletter", utm_campaign: "launch" },
      last_touch: { utm_source: "newsletter", utm_campaign: "launch" },
      utm_source: "newsletter",
      utm_campaign: "launch",
    });
  });

  test("rejects malformed, oversized, and disallowed attribution values", () => {
    expect(parseAttributionCookie("not-json")).toBeNull();
    expect(parseAttributionCookie(JSON.stringify({ utm_term: "not-permitted" }))).toBeNull();
    expect(parseAttributionCookie(JSON.stringify({ utm_source: "email", utm_term: "not-permitted" }))).toBeNull();
    expect(parseAttributionCookie(JSON.stringify({ utm_source: "a".repeat(201) }))).toBeNull();
    expect(parseAttributionCookie("x".repeat(3801))).toBeNull();
  });

  test("removes a malformed attribution cookie even when the current URL has no UTM", () => {
    writeConsent("granted");
    document.cookie = "bc_attribution=not-json; path=/";

    captureAttributionIfPresent();

    expect(document.cookie).not.toContain("bc_attribution=");
  });

  test("does not read or write web storage before consent", () => {
    window.history.replaceState({}, "", "http://localhost/?utm_source=campaign");
    const getItem = vi.spyOn(Storage.prototype, "getItem");
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    captureAttributionIfPresent();

    expect(readConsent()).toBeNull();
    expect(getItem).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
    expect(document.cookie).not.toContain("bc_attribution=");
  });

  test("stores first touch, last touch, and latest flat UTM values after consent", () => {
    writeConsent("granted");
    window.history.replaceState({}, "", "http://localhost/?utm_source=email&utm_campaign=founders");

    captureAttributionIfPresent();

    const stored = parseAttributionCookie(document.cookie.match(/bc_attribution=([^;]+)/)?.[1]);
    expect(stored).toEqual({
      first_touch: { utm_source: "email", utm_campaign: "founders" },
      last_touch: { utm_source: "email", utm_campaign: "founders" },
      utm_source: "email",
      utm_campaign: "founders",
    });
  });

  test("preserves first touch and refreshes last touch for consented returning visitors", () => {
    writeConsent("granted");
    window.history.replaceState({}, "", "http://localhost/?utm_source=email&utm_campaign=first");
    captureAttributionIfPresent();
    window.history.replaceState({}, "", "http://localhost/?utm_source=linkedin&utm_content=post");

    captureAttributionIfPresent();

    const stored = parseAttributionCookie(document.cookie.match(/bc_attribution=([^;]+)/)?.[1]);
    expect(stored).toEqual({
      first_touch: { utm_source: "email", utm_campaign: "first" },
      last_touch: { utm_source: "linkedin", utm_content: "post" },
      utm_source: "linkedin",
      utm_content: "post",
    });
  });

  test("withdrawal clears attribution, legacy storage, GA scripts, cookies, and memory", () => {
    document.cookie = "bc_attribution=%7B%7D; path=/";
    document.cookie = "_ga=abc; path=/";
    sessionStorage.setItem("bc_pending_attribution", "legacy");
    localStorage.setItem("bc_pending_attribution", "legacy");
    document.head.insertAdjacentHTML("beforeend", '<script id="_next-ga"></script><script id="_next-ga-init"></script>');
    (window as Window & { dataLayer?: unknown[] }).dataLayer = [["config", "G-test"]];

    clearTrackingState();

    expect(document.cookie).not.toContain("bc_attribution=");
    expect(document.cookie).not.toContain("_ga=");
    expect(sessionStorage.getItem("bc_pending_attribution")).toBeNull();
    expect(localStorage.getItem("bc_pending_attribution")).toBeNull();
    expect(document.querySelector("#_next-ga")).toBeNull();
    expect(document.querySelector("#_next-ga-init")).toBeNull();
    expect((window as Window & { dataLayer?: unknown[] }).dataLayer).toBeUndefined();
  });
});
