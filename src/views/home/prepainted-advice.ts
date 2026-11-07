import type { Advice } from "@/data";

declare global {
  interface Window {
    __prepaintedAdvice?: Advice;
  }
}

export const PREPAINTED_ADVICE_GLOBAL =
  "__prepaintedAdvice" satisfies keyof Window;

export function readPrepaintedAdvice() {
  return typeof window === "undefined" ? undefined : window.__prepaintedAdvice;
}
