import type { ElementType, ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: ReactNode | ElementType<{ className?: string }>;
  iconClassName?: string;
}

export default function PageHeader({ title, subtitle, description, icon, iconClassName }: PageHeaderProps) {
  const resolvedSubtitle = subtitle ?? description;

  let renderedIcon: ReactNode = null;
  if (icon) {
    if (typeof icon === "function") {
      const IconComponent = icon as ElementType<{ className?: string }>;
      renderedIcon = <IconComponent className={iconClassName ?? "w-6 h-6 text-brand-accent"} />;
    } else {
      renderedIcon = icon;
    }
  }

  return (
    <div className="pt-0 px-0">
      {renderedIcon ? (
        <div className="flex items-center gap-2 mb-2">
          {renderedIcon}
          <h1 className="page-title font-display text-light-text dark:text-dark-text">{title}</h1>
        </div>
      ) : (
        <h1 className="page-title font-display mb-2 text-light-text dark:text-dark-text">{title}</h1>
      )}
      {resolvedSubtitle ? <p className="text-light-muted dark:text-dark-muted text-lg mb-6">{resolvedSubtitle}</p> : null}
    </div>
  );
}


