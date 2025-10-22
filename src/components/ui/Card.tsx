import { ReactNode } from "react";

export default function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={
        `rounded-lg bg-light-surface dark:bg-dark-surface ` +
        `border border-light-border dark:border-dark-border ` +
        `shadow-sm p-6 ${className}`
      }
    >
      {children}
    </div>
  );
}


