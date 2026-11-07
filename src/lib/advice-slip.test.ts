import { describe, expect, it, vi } from "vite-plus/test";
import { fetchRandomAdvice, parseAdviceSlip } from "./advice-slip";

const smile = { slip: { id: 42, advice: "Smile." } };

describe("parseAdviceSlip", () => {
  it("reads the slip's id and advice", () => {
    expect(parseAdviceSlip(smile)).toEqual({ id: 42, text: "Smile." });
  });

  it("trims the whitespace some slips carry", () => {
    expect(parseAdviceSlip({ slip: { id: 7, advice: "  Smile.\n" } })).toEqual({
      id: 7,
      text: "Smile.",
    });
  });

  it.each([
    ["null", null],
    ["a bare string", "Smile."],
    ["a body without a slip", {}],
    [
      "the API's error envelope",
      { message: { type: "error", text: "Advice slip not found." } },
    ],
    ["a string id", { slip: { id: "42", advice: "Smile." } }],
    ["a zero id", { slip: { id: 0, advice: "Smile." } }],
    ["a negative id", { slip: { id: -3, advice: "Smile." } }],
    ["a fractional id", { slip: { id: 4.2, advice: "Smile." } }],
    ["a missing advice", { slip: { id: 42 } }],
    ["a blank advice", { slip: { id: 42, advice: "  \n" } }],
  ])("rejects %s", (_, payload) => {
    expect(() => parseAdviceSlip(payload)).toThrow(TypeError);
  });
});

describe("fetchRandomAdvice", () => {
  it("bypasses the HTTP cache, which would replay the last slip for two seconds", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(Response.json(smile));

    await expect(fetchRandomAdvice()).resolves.toEqual({
      id: 42,
      text: "Smile.",
    });
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://api.adviceslip.com/advice",
      expect.objectContaining({ cache: "no-store" }),
    );
  });

  it("puts a deadline on the request", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(Response.json(smile));

    await fetchRandomAdvice();

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("rejects an error status instead of parsing its body", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json(smile, { status: 503 }),
    );

    await expect(fetchRandomAdvice()).rejects.toThrow("503");
  });
});
