"use client";

import { DiceIcon } from "@/components/icons";
import { CardDivider } from "@/components/layout";
import type { Advice } from "@/data";
import { adviceSlipUrl } from "@/lib";
import { Fragment, type CSSProperties } from "react";
import { useAdvice } from "./use-advice";

export default function AdviceCard({
  initialAdvice,
}: {
  initialAdvice: Advice;
}) {
  const { state, isRolling, roll } = useAdvice(initialAdvice);
  const spins = isRolling ? state.roll + 1 : state.roll;

  return (
    <article className="v-card">
      <div aria-live="polite" aria-busy={isRolling} className="v-card-text">
        {state.status === "ready" ? (
          <Fragment key={state.roll}>
            <h1 className="v-card-heading">{`Advice #${state.advice.id}`}</h1>
            <blockquote
              cite={adviceSlipUrl(state.advice.id)}
              className="v-card-body"
            >
              <q>{state.advice.text}</q>
            </blockquote>
          </Fragment>
        ) : (
          <Fragment key={state.roll}>
            <h1 className="v-card-heading">Advice unavailable</h1>
            <p className="v-card-body">
              The advice service didn’t answer. Roll the die to try again.
            </p>
          </Fragment>
        )}
      </div>
      <CardDivider />
      <button type="button" onClick={roll} className="v-card-action w-16">
        <span className="sr-only">Roll for new advice</span>
        <DiceIcon
          style={{ "--spins": `${spins}turn` } as CSSProperties}
          className="rotate-(--spins) transition-[rotate] duration-500 ease-out motion-reduce:transition-none"
        />
      </button>
    </article>
  );
}
