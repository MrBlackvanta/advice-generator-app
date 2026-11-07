"use client";

import { DiceIcon } from "@/components/icons";
import type { Advice } from "@/data";
import { adviceSlipUrl } from "@/lib";
import { Fragment, type CSSProperties } from "react";
import AdviceDivider from "./advice-divider";
import { useAdvice } from "./use-advice";

const headingClass =
  "ps-(--tracking-label) text-label text-accent uppercase sm:text-label-lg";
const bodyClass = "text-quote sm:text-quote-lg";

export default function AdviceCard({
  initialAdvice,
}: {
  initialAdvice: Advice;
}) {
  const { state, isRolling, roll } = useAdvice(initialAdvice);
  const spins = isRolling ? state.roll + 1 : state.roll;

  return (
    <article className="mb-8 flex w-full max-w-135 flex-col items-center rounded-card bg-card px-6 pt-10 text-center shadow-card sm:rounded-card-lg sm:px-12 sm:pt-12">
      <div
        aria-live="polite"
        aria-busy={isRolling}
        className="mb-6 grid gap-6 sm:mb-10"
      >
        {state.status === "ready" ? (
          <Fragment key={state.roll}>
            <h1 className={headingClass}>Advice #{state.advice.id}</h1>
            <blockquote
              cite={adviceSlipUrl(state.advice.id)}
              className={bodyClass}
            >
              <q>{state.advice.text}</q>
            </blockquote>
          </Fragment>
        ) : (
          <Fragment key={state.roll}>
            <h1 className={headingClass}>Advice unavailable</h1>
            <p className={bodyClass}>
              The advice service didn’t answer. Roll the die to try again.
            </p>
          </Fragment>
        )}
      </div>
      <AdviceDivider />
      <button
        type="button"
        onClick={roll}
        className="relative mt-8 -mb-8 grid size-16 place-items-center rounded-full bg-accent text-page before:absolute before:inset-0 before:rounded-full before:opacity-0 before:shadow-glow before:transition-opacity before:duration-200 before:ease-out hover:before:opacity-100 focus-visible:before:opacity-100 sm:mt-10"
      >
        <span className="sr-only">Roll for new advice</span>
        <DiceIcon
          style={{ "--spins": `${spins}turn` } as CSSProperties}
          className="rotate-(--spins) transition-[rotate] duration-500 ease-out motion-reduce:transition-none"
        />
      </button>
    </article>
  );
}
