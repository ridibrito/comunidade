import { useState } from "react";

export function Tabs({ tabs }: { tabs: { key: string; label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.key);
  return (
    <div>
      <div className="flex gap-4 border-b border-gray-200 mb-4">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`pb-3 -mb-px text-sm ${active===t.key ? "border-b-2 border-brand text-brand" : "text-gray-500 hover:text-gray-700"}`}
            aria-selected={active===t.key}
            role="tab"
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {tabs.find(t => t.key===active)?.content}
      </div>
    </div>
  );
}


