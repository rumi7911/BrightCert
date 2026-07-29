import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Reveal } from "./reveal";

test("renders critical above-the-fold content visible on the server", () => {
  render(
    <Reveal immediate>
      <p>Critical content</p>
    </Reveal>
  );

  expect(screen.getByText("Critical content").parentElement?.className).toContain("is-visible");
});
