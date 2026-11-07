import { INITIAL_ADVICE } from "@/data";
import { AdviceCard } from "@/views/home";

export default function Home() {
  return (
    <main className="grid grow place-items-center px-4 py-16">
      <AdviceCard initialAdvice={INITIAL_ADVICE} />
    </main>
  );
}
