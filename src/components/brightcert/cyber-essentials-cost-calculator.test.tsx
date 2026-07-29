import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { CyberEssentialsCostCalculator } from "./cyber-essentials-cost-calculator";

test("calculates the current official certification fee from employee count", () => {
  render(<CyberEssentialsCostCalculator />);

  expect(screen.getByText("£320 + VAT")).toBeTruthy();
  expect(screen.getByText("£384 including VAT")).toBeTruthy();

  fireEvent.change(screen.getByRole("spinbutton", { name: "Number of employees" }), {
    target: { value: "50" },
  });

  expect(screen.getByText("£500 + VAT")).toBeTruthy();
  expect(screen.getByText("£600 including VAT")).toBeTruthy();
});
