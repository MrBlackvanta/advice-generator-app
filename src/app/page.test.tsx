import { ADVICE_CATALOGUE, INITIAL_ADVICE } from "@/data";
import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { runInThisContext } from "node:vm";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import Home from "./page";

const roots: Root[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) act(() => root.unmount());
  document.body.replaceChildren();
  delete window.__prepaintedAdvice;
  vi.restoreAllMocks();
});

function prerender() {
  const container = document.createElement("div");
  container.innerHTML = renderToString(<Home />);
  document.body.append(container);
  return container;
}

function runInlineScripts(container: HTMLElement) {
  for (const script of container.querySelectorAll("script")) {
    runInThisContext(script.textContent);
  }
}

function pickWith(random: number) {
  vi.spyOn(Math, "random").mockReturnValue(random);
  return ADVICE_CATALOGUE[Math.floor(random * ADVICE_CATALOGUE.length)];
}

function expectCardToShow({ id, text }: { id: number; text: string }) {
  expect(
    screen.getByRole("heading", { level: 1, name: `Advice #${id}` }),
  ).toBeInTheDocument();
  expect(screen.getByText(text).closest("blockquote")).toHaveAttribute(
    "cite",
    `https://api.adviceslip.com/advice/${id}`,
  );
}

describe("Home", () => {
  it.each([
    ["first", 0],
    ["a middle", 0.5],
    ["last", 0.999_999],
  ])("paints the %s catalogue slip before hydration", (_, random) => {
    const slip = pickWith(random);
    const container = prerender();

    runInlineScripts(container);

    expectCardToShow(slip);
    expect(window.__prepaintedAdvice).toEqual(slip);
  });

  it("holds the first render until the pick script has run, however the HTML is chunked", () => {
    prerender();

    const renderGate = document.querySelector('link[rel="expect"]');

    expect(renderGate).toHaveAttribute("blocking", "render");
    expect(renderGate).toHaveAttribute(
      "href",
      `#${document.querySelector("script")?.id}`,
    );
  });

  it("hydrates onto the painted slip without a mismatch, then rolls from the live API", async () => {
    const slip = pickWith(0.5);
    const container = prerender();
    runInlineScripts(container);
    const consoleError = vi.spyOn(console, "error");
    const onRecoverableError = vi.fn();

    await act(async () => {
      roots.push(hydrateRoot(container, <Home />, { onRecoverableError }));
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    expectCardToShow(slip);

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ slip: { id: 9999, advice: "Smile." } }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Roll for new advice" }),
    );

    expectCardToShow({ id: 9999, text: "Smile." });
  });

  it("patches nothing, and hands hydration nothing, when the card's markup has drifted", () => {
    pickWith(0.5);
    const container = prerender();
    container.querySelector("blockquote")?.remove();

    runInlineScripts(container);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: `Advice #${INITIAL_ADVICE.id}`,
      }),
    ).toBeInTheDocument();
    expect(window.__prepaintedAdvice).toBeUndefined();
  });
});
