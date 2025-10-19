import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export default function Section({ children, className="", fullWidth = false }: SectionProps) {
  // Padding uniforme em todas as páginas para alinhar topo/laterais
  const baseClasses = fullWidth ? "overflow-x-hidden" : "p-8 overflow-x-hidden";
  return <section className={`${baseClasses} ${className}`}>{children}</section>;
}


