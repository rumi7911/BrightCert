import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import { DashboardIssues, type DashboardControl } from "./dashboard-issues";

afterEach(cleanup);

const controls: DashboardControl[] = [
  {
    sectionId: 1,
    score: 45,
    status: "fail",
    gaps: [
      {
        issue: "Change the default router password",
        why: "Default credentials are easy to discover.",
        priority: "P1",
      },
    ],
  },
  {
    sectionId: 3,
    score: 75,
    status: "warning",
    gaps: [
      {
        issue: "Remove unused administrator accounts",
        why: "Dormant privileged accounts increase exposure.",
        priority: "P1",
      },
    ],
  },
];

describe("DashboardIssues", () => {
  test("filters critical issues from the phone control selector while retaining the desktop score table", () => {
    render(<DashboardIssues assessmentId="assessment-1" controls={controls} />);

    expect(screen.getByText("Change the default router password")).toBeTruthy();
    expect(screen.getByText("Remove unused administrator accounts")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /filter issues by firewalls/i }));

    expect(screen.getByText("Change the default router password")).toBeTruthy();
    expect(screen.queryByText("Remove unused administrator accounts")).toBeNull();
    expect(
      screen.getByRole("table", { name: "Cyber Essentials control area scores" })
    ).toBeTruthy();
  });

  test("lets a visitor clear the active phone filter", () => {
    render(<DashboardIssues assessmentId="assessment-1" controls={controls} />);

    fireEvent.click(screen.getByRole("button", { name: /filter issues by firewalls/i }));
    fireEvent.click(screen.getByRole("button", { name: "Clear filter" }));

    expect(screen.getByText("Change the default router password")).toBeTruthy();
    expect(screen.getByText("Remove unused administrator accounts")).toBeTruthy();
  });
});
