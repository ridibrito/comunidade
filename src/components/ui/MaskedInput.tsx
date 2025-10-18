import React from "react";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
  mask: (value: string) => string;
};

export default function MaskedInput({ value, onChange, mask, className = "", ...rest }: Props) {
  return (
    <input
      {...rest}
      className={`w-full h-11 rounded-xl bg-transparent border px-3 ${className}`}
      value={value}
      onChange={(e) => onChange(mask(e.target.value))}
    />
  );
}


