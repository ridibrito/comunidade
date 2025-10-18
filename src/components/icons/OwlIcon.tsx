export function OwlIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M4 8a6 6 0 0 1 16 0v6a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6V8z" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="9" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="15" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 12.5l2 1.5-2 1.5-2-1.5 2-1.5z" fill="currentColor"/>
      <path d="M6 16c1.5 1.2 3.5 2 6 2s4.5-.8 6-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}


