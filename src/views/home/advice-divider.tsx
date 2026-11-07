export default function AdviceDivider() {
  return (
    <div aria-hidden="true" className="flex w-full items-center gap-4">
      <span className="h-px grow bg-divider" />
      <span className="flex gap-2">
        <span className="h-4 w-1.5 rounded-full bg-ink" />
        <span className="h-4 w-1.5 rounded-full bg-ink" />
      </span>
      <span className="h-px grow bg-divider" />
    </div>
  );
}
