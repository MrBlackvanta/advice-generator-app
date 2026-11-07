import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vite-plus/test";
import HomeError from "./error";

function renderError() {
  const reset = vi.fn();
  render(<HomeError error={new Error("boom")} reset={reset} />);
  return reset;
}

describe("HomeError", () => {
  it("names the failure as the only heading of the main landmark", () => {
    renderError();

    expect(screen.getByRole("main")).toContainElement(
      screen.getByRole("heading", { level: 1, name: "Something went wrong" }),
    );
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });

  it("retries in place, because a link home lands on the same path and keeps the boundary up", async () => {
    const reset = renderError();

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(reset).toHaveBeenCalledOnce();
  });
});
