// @vitest-environment node

import { afterEach, describe, expect, test, vi } from "vitest";
import { createAdminClient } from "@/lib/supabase/server";
import HomePage from "./(marketing)/page";

vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: vi.fn(),
}));

describe("homepage prerendering", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("uses the public fallback when Supabase build variables are unavailable", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    vi.mocked(createAdminClient).mockImplementation(() => {
      throw new Error("supabaseUrl is required");
    });

    await expect(HomePage()).resolves.toBeDefined();
    expect(createAdminClient).not.toHaveBeenCalled();
  });
});
