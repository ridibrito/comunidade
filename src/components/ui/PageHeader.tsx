export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="pt-0 px-0">
      <h1 className="page-title font-display mb-2" style={{ color: "var(--foreground)" }}>{title}</h1>
      {subtitle ? <p className="text-neutral-400 text-lg mb-6">{subtitle}</p> : null}
    </div>
  );
}


