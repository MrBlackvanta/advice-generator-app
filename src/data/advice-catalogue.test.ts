import { parseAdviceSlip } from "@/lib";
import { describe, expect, it } from "vite-plus/test";
import { INITIAL_ADVICE } from "./advice";
import { ADVICE_CATALOGUE } from "./advice-catalogue";

describe("ADVICE_CATALOGUE", () => {
  it("holds only slips the live API's own parser would accept", () => {
    for (const { id, text } of ADVICE_CATALOGUE) {
      expect(parseAdviceSlip({ slip: { id, advice: text } })).toEqual({
        id,
        text,
      });
    }
  });

  it("carries no markup, so it can be inlined in a script tag unescaped", () => {
    for (const { text } of ADVICE_CATALOGUE) expect(text).not.toContain("<");
  });

  it("lists every slip once", () => {
    const ids = ADVICE_CATALOGUE.map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes the slip the page prerenders", () => {
    expect(ADVICE_CATALOGUE).toContainEqual(INITIAL_ADVICE);
  });
});
