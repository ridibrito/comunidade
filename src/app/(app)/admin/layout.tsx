import { AdminSidebar } from "./_components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 p-4">{children}</div>
    </section>
  );
}


