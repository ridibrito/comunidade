export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="pt-0 px-0">
      <h1 className="page-title font-display mb-2 text-light-text dark:text-dark-text">{title}</h1>
      {subtitle ? <p className="text-light-muted dark:text-dark-muted text-lg mb-6">{subtitle}</p> : null}
    </div>
  );
}


