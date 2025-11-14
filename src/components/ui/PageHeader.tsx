import { createElement, isValidElement, type ElementType, type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  // Aceita:
  // - um elemento React pronto (ex: <Icon />)
  // - um componente de ícone (ex: Icon) incluindo ForwardRef de lucide-react
  icon?: ReactNode | ElementType<{ className?: string }>;
  iconClassName?: string;
}

export default function PageHeader({ title, subtitle, description, icon, iconClassName }: PageHeaderProps) {
  const resolvedSubtitle = subtitle ?? description;

  let renderedIcon: ReactNode = null;
  if (icon) {
    try {
      if (isValidElement(icon)) {
        // Elemento JSX já criado
        renderedIcon = icon;
      } else {
        // Componente (inclui forwardRef do lucide-react)
        const IconComponent = icon as ElementType<{ className?: string }>;
        renderedIcon = createElement(IconComponent, { className: iconClassName ?? "w-6 h-6 text-brand-accent" });
      }
    } catch {
      renderedIcon = null;
    }
  }

  return (
    <div className="pt-0 px-0">
      {renderedIcon ? (
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-shrink-0 flex items-center justify-center">
            {renderedIcon}
          </div>
          <h1 className="page-title font-display text-light-text m-0 leading-tight">{title}</h1>
        </div>
      ) : (
        <h1 className="page-title font-display mb-2 text-light-text">{title}</h1>
      )}
      {resolvedSubtitle ? <p className="text-light-muted text-lg mb-6">{resolvedSubtitle}</p> : null}
    </div>
  );
}


