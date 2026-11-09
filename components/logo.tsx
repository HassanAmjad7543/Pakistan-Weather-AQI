export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      <rect width="32" height="32" rx="8" className="fill-foreground" />
      <circle cx="13" cy="13" r="5" className="fill-background" />
      <path d="M7 21.5h12M10 25h15M17 18h8" strokeWidth="2.2" strokeLinecap="round" className="stroke-background" />
      <circle cx="24" cy="10" r="2.5" fill="#3b82f6" />
    </svg>
  );
}
