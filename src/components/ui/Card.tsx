import { ReactNode } from "react";

export default function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={
        `rounded-lg bg-light-surface dark:bg-dark-surface ` +
        `shadow-sm p-6 ${className}`
      }
    >
      {children}
    </div>
  );
}


