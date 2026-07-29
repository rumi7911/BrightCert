import { describe, expect, test } from "vitest";
import { getCyberEssentialsFee } from "./cyber-essentials-fees";

describe("getCyberEssentialsFee", () => {
  test.each([
    [0, "Micro", 320],
    [9, "Micro", 320],
    [10, "Small", 440],
    [49, "Small", 440],
    [50, "Medium", 500],
    [249, "Medium", 500],
    [250, "Large", 600],
    [10_000, "Large", 600],
  ])("maps %i employees to the current official %s fee", (employees, size, feeExVat) => {
    expect(getCyberEssentialsFee(employees)).toEqual({
      size,
      employees,
      feeExVat,
      vat: feeExVat * 0.2,
      feeIncVat: feeExVat * 1.2,
    });
  });

  test.each([-1, 1.5, Number.NaN])("rejects an invalid employee count: %s", (employees) => {
    expect(() => getCyberEssentialsFee(employees)).toThrow("Employee count must be a non-negative whole number");
  });
});
