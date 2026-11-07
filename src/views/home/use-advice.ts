import type { Advice } from "@/data";
import { fetchRandomAdvice } from "@/lib";
import { useState, useTransition } from "react";

type Outcome = { status: "ready"; advice: Advice } | { status: "failed" };

export type AdviceState = Outcome & { roll: number };

export function useAdvice(initialAdvice: Advice) {
  const [state, setState] = useState<AdviceState>({
    status: "ready",
    advice: initialAdvice,
    roll: 0,
  });
  const [isRolling, startRolling] = useTransition();

  function roll() {
    if (isRolling) return;

    startRolling(async () => {
      const outcome = await rollOutcome();
      startRolling(() =>
        setState((current) => ({ ...outcome, roll: current.roll + 1 })),
      );
    });
  }

  return { state, isRolling, roll };
}

async function rollOutcome(): Promise<Outcome> {
  try {
    return { status: "ready", advice: await fetchRandomAdvice() };
  } catch {
    return { status: "failed" };
  }
}
