import { MountainBuilder } from "../_components/MountainBuilder";

export default function AdminMountainsPage() {
  return (
    <main className="p-0">
      <h1 className="text-2xl font-semibold">Montanhas</h1>
      <p className="text-[var(--foreground)]/70 mt-1">Crie trilhas, módulos e aulas dentro da montanha.</p>
      <div className="mt-4">
        <MountainBuilder />
      </div>
    </main>
  );
}


