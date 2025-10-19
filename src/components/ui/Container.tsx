import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export default function Container({ children, className="", fullWidth = false }: ContainerProps) {
  const containerClass = fullWidth ? "w-full" : "container";
  return <div className={`${containerClass} ${className}`}>{children}</div>;
}


