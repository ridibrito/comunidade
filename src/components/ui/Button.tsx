type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};
export default function Button({ variant="primary", className="", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition";
  const styles = {
    primary: "bg-brand text-white hover:bg-brand/90 shadow-soft",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "bg-transparent text-brand hover:bg-gray-100",
  }[variant];
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}


