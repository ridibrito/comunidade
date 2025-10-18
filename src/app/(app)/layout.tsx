import { Navbar } from "./_components/Navbar";
import { Sidebar } from "./_components/Sidebar";
import { Rail } from "./_components/Rail";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <section className="min-h-screen bg-light-bg dark:bg-dark-bg">
        <Navbar />
        <div className="flex gap-0 h-[calc(100vh-64px)] overflow-hidden">
          <Rail />
          <Sidebar />
          <div className="flex-1 overflow-auto h-full bg-light-bg dark:bg-dark-bg">{children}</div>
        </div>
      </section>
    </ThemeProvider>
  );
}


