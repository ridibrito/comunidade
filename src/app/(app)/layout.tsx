import { Navbar } from "./_components/Navbar";
import { Sidebar } from "./_components/Sidebar";
import { Rail } from "./_components/Rail";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen">
      <Navbar />
      <div className="flex gap-0 h-[calc(100vh-64px)] overflow-hidden">
        <Rail />
        <Sidebar />
        <div className="flex-1 overflow-auto h-full">{children}</div>
      </div>
    </section>
  );
}


