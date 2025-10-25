import React from "react";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
  mask: (value: string) => string;
};

export default function MaskedInput({ value, onChange, mask, className = "", ...rest }: Props) {
  const defaultClasses = "flex h-10 w-full rounded-lg bg-light-surface dark:bg-dark-surface px-3 py-2 text-sm text-light-text dark:text-dark-text ring-offset-background placeholder:text-light-muted dark:placeholder:text-dark-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm";
  
  return (
    <input
      {...rest}
      className={`${defaultClasses} ${className}`}
      value={value}
      onChange={(e) => onChange(mask(e.target.value))}
    />
  );
}


