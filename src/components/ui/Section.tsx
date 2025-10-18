import { ReactNode } from "react";

export default function Section({ children, className="" }: { children: ReactNode; className?: string }) {
  // Padding uniforme em todas as páginas para alinhar topo/laterais
  return <section className={`p-8 overflow-x-hidden ${className}`}>{children}</section>;
}


