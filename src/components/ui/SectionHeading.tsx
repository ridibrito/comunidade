"use client";

import { createElement, isValidElement, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  icon?: ReactNode | ElementType<{ className?: string }>;
  iconClassName?: string;
  showShape?: boolean;
  className?: string;
}

export function SectionHeading({
  title,
  icon,
  iconClassName,
  showShape = true,
  className,
}: SectionHeadingProps) {
  let renderedIcon: ReactNode = null;

  if (icon) {
    if (isValidElement(icon)) {
      renderedIcon = icon;
    } else {
      try {
        const IconComponent = icon as ElementType<{ className?: string }>;
        renderedIcon = createElement(IconComponent, {
          className: iconClassName ?? "w-5 h-5 text-brand-accent",
        });
      } catch {
        renderedIcon = null;
      }
    }
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showShape ? <div className="h-8 w-1 rounded-full bg-brand-accent" /> : null}
      <div className="flex items-center gap-2 text-light-text dark:text-dark-text">
        {renderedIcon}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
    </div>
  );
}

export function SectionTitle({
  title,
  icon,
  iconClassName,
  className,
}: {
  title: string;
  icon?: ReactNode | ElementType<{ className?: string }>;
  iconClassName?: string;
  className?: string;
}) {
  return (
    <SectionHeading
      title={title}
      icon={icon}
      iconClassName={iconClassName}
      className={className}
      showShape={false}
    />
  );
}
