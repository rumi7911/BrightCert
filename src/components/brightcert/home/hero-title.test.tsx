import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { HeroTitle } from "./hero-title";

test("uses the defensible two-hour readiness proposition", () => {
  const { container } = render(<HeroTitle />);

  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "Find out how ready you are for Cyber Essentials in around 2 hours.",
    })
  ).toBeTruthy();
  expect(container.querySelector("h1")?.textContent).toBe(
    "Find out how ready you are for Cyber Essentials in around 2 hours."
  );
});
