"use client";

import { CardDivider } from "@/components/layout";

type HomeErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function HomeError({ reset }: HomeErrorProps) {
  return (
    <main className="grid grow place-items-center px-4 py-16">
      <div className="v-card">
        <div className="v-card-text">
          <h1 className="v-card-heading">Something went wrong</h1>
          <p className="v-card-body">
            The advice couldn’t be shown. Try again to bring it back.
          </p>
        </div>
        <CardDivider />
        <button
          type="button"
          onClick={reset}
          className="v-card-action v-card-action-label"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
