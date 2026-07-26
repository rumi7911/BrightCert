// @vitest-environment node

import { createRequire } from "node:module";
import { dirname } from "node:path";
import { describe, expect, test } from "vitest";

const require = createRequire(import.meta.url);

function dependencyFrom(parentPackage: string, dependency: string) {
  const parentDirectory = dirname(require.resolve(parentPackage));
  return require(require.resolve(dependency, { paths: [parentDirectory] })) as
    | ((value: string, pattern: string) => boolean)
    | {
        minimatch: (value: string, pattern: string) => boolean;
      };
}

describe("bounded brace-expansion compatibility bridge", () => {
  test("supports the callable API consumed by minimatch 3", () => {
    const legacyMinimatch = dependencyFrom("eslint", "minimatch");

    expect(typeof legacyMinimatch).toBe("function");
    expect(
      (legacyMinimatch as (value: string, pattern: string) => boolean)(
        "src/app/page.tsx",
        "src/**/*.{ts,tsx}"
      )
    ).toBe(true);
  });

  test("supports the named API consumed by minimatch 10", () => {
    const modernMinimatch = dependencyFrom(
      "@typescript-eslint/typescript-estree",
      "minimatch"
    );

    expect(typeof modernMinimatch).toBe("object");
    expect(
      (
        modernMinimatch as {
          minimatch: (value: string, pattern: string) => boolean;
        }
      ).minimatch("src/app/page.tsx", "src/**/*.{ts,tsx}")
    ).toBe(true);
  });

  test("retains upstream count and length bounds", () => {
    const expand = require("brace-expansion") as {
      (pattern: string, options?: { max?: number; maxLength?: number }): string[];
    };

    const countBounded = expand("{a,b}".repeat(18));
    expect(countBounded.length).toBeGreaterThan(0);
    expect(countBounded.length).toBeLessThan(2 ** 18);
    expect(
      expand("{abcdefghij,klmnopqrst}".repeat(10), {
        max: 10_000,
        maxLength: 50,
      })
    ).toEqual([]);
  });
});
