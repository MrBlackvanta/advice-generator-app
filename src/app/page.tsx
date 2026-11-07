import { INITIAL_ADVICE } from "@/data";
import { AdviceCard, RANDOM_ADVICE_SCRIPT } from "@/views/home";

export default function Home() {
  return (
    <main className="grid grow place-items-center px-4 py-16">
      <AdviceCard initialAdvice={INITIAL_ADVICE} />
      <script dangerouslySetInnerHTML={{ __html: RANDOM_ADVICE_SCRIPT }} />
    </main>
  );
}
