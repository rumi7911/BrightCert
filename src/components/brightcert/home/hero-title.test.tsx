import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { HeroTitle } from "./hero-title";

test("uses the defensible two-hour readiness proposition", () => {
  render(<HeroTitle />);

  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "Find out how ready you are in around 2 hours.",
    })
  ).toBeTruthy();
});
