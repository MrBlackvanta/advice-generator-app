import type { Advice } from "@/data";

const ADVICE_SLIP_API = "https://api.adviceslip.com/advice";
const REQUEST_TIMEOUT_MS = 8000;

export function adviceSlipUrl(id: number) {
  return `${ADVICE_SLIP_API}/${id}`;
}

export function parseAdviceSlip(payload: unknown): Advice {
  const slip = isRecord(payload) ? payload.slip : undefined;
  if (!isRecord(slip)) throw unexpectedPayload();

  const { id, advice } = slip;
  const text = typeof advice === "string" ? advice.trim() : "";
  if (!isSlipId(id) || !text) throw unexpectedPayload();

  return { id, text };
}

export async function fetchRandomAdvice(): Promise<Advice> {
  const response = await fetch(ADVICE_SLIP_API, {
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`The Advice Slip API answered ${response.status}`);
  }

  return parseAdviceSlip(await response.json());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSlipId(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) > 0;
}

function unexpectedPayload() {
  return new TypeError(
    "The Advice Slip API sent a slip without an id or advice",
  );
}
