import { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({ title, className = "", children }: SectionHeadingProps) {
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
        {title}
      </h2>
      {children}
    </div>
  );
}

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

export function SectionTitle({ children, className = "" }: SectionTitleProps) {
  return (
    <h3 className={`text-xl font-semibold text-light-text dark:text-dark-text ${className}`}>
      {children}
    </h3>
  );
}

