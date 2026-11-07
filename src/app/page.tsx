import { INITIAL_ADVICE } from "@/data";
import {
  AdviceCard,
  RANDOM_ADVICE_SCRIPT,
  RANDOM_ADVICE_SCRIPT_ID,
} from "@/views/home";

export default function Home() {
  return (
    <main className="grid grow place-items-center px-4 py-16">
      <link
        rel="expect"
        href={`#${RANDOM_ADVICE_SCRIPT_ID}`}
        blocking="render"
      />
      <AdviceCard initialAdvice={INITIAL_ADVICE} />
      <script
        id={RANDOM_ADVICE_SCRIPT_ID}
        dangerouslySetInnerHTML={{ __html: RANDOM_ADVICE_SCRIPT }}
      />
    </main>
  );
}
