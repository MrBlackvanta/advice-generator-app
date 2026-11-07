import type { Advice } from "@/data";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vite-plus/test";
import AdviceCard from "./advice-card";

const initialAdvice: Advice = {
  id: 71,
  text: "It is easy to sit up and take notice, what's difficult is getting up and taking action.",
};
const nextAdvice: Advice = { id: 42, text: "Smile." };
const failureMessage =
  "The advice service didn’t answer. Roll the die to try again.";

function slipResponse(advice: Advice) {
  return Response.json({ slip: { id: advice.id, advice: advice.text } });
}

function failedRequest() {
  return new TypeError("Failed to fetch");
}

function heldResponse() {
  let release: (response: Response) => void = () => {};
  const response = new Promise<Response>((resolve) => {
    release = resolve;
  });
  return { response, release };
}

function renderCard() {
  render(<AdviceCard initialAdvice={initialAdvice} />);
  return {
    user: userEvent.setup(),
    die: screen.getByRole("button", { name: "Roll for new advice" }),
  };
}

describe("AdviceCard", () => {
  it("heads the page with the slip number and quotes its advice", () => {
    renderCard();

    expect(
      screen.getByRole("heading", { level: 1, name: "Advice #71" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("blockquote")).toHaveTextContent(
      initialAdvice.text,
    );
  });

  it("rolls a new slip when the die is clicked", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(slipResponse(nextAdvice));
    const { user, die } = renderCard();

    await user.click(die);

    expect(
      await screen.findByRole("heading", { level: 1, name: "Advice #42" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("blockquote")).toHaveTextContent("Smile.");
  });

  it("announces the new slip politely, and marks the region busy until it lands", async () => {
    const held = heldResponse();
    vi.spyOn(globalThis, "fetch").mockReturnValue(held.response);
    const { user, die } = renderCard();
    const region = screen.getByRole("heading", { level: 1 }).parentElement;

    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toContainElement(screen.getByRole("blockquote"));
    expect(region).toHaveAttribute("aria-busy", "false");

    await user.click(die);
    expect(region).toHaveAttribute("aria-busy", "true");

    held.release(slipResponse(nextAdvice));
    await waitFor(() => expect(region).toHaveAttribute("aria-busy", "false"));
    expect(region).toHaveTextContent("Smile.");
  });

  it("ignores clicks while a roll is in flight, without disabling the die and dropping its focus", async () => {
    const held = heldResponse();
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockReturnValue(held.response);
    const { user, die } = renderCard();

    await user.click(die);
    await user.click(die);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(die).toBeEnabled();
    expect(die).toHaveFocus();

    held.release(slipResponse(nextAdvice));
    expect(
      await screen.findByRole("heading", { name: "Advice #42" }),
    ).toBeInTheDocument();
  });

  it("says so when the service fails, instead of leaving the old slip up", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(failedRequest());
    const { user, die } = renderCard();

    await user.click(die);

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Advice unavailable",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(failureMessage)).toBeInTheDocument();
    expect(screen.queryByRole("blockquote")).not.toBeInTheDocument();
  });

  it("re-renders a repeat failure, because a live region whose text does not change stays silent", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(failedRequest());
    const { user, die } = renderCard();

    await user.click(die);
    const firstFailure = await screen.findByText(failureMessage);
    await user.click(die);

    await waitFor(() =>
      expect(screen.getByText(failureMessage)).not.toBe(firstFailure),
    );
  });

  it("recovers on the next roll that succeeds", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(failedRequest())
      .mockResolvedValueOnce(slipResponse(nextAdvice));
    const { user, die } = renderCard();

    await user.click(die);
    await screen.findByText(failureMessage);
    await user.click(die);

    expect(
      await screen.findByRole("heading", { level: 1, name: "Advice #42" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(failureMessage)).not.toBeInTheDocument();
  });
});
