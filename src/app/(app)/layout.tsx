import { Navbar } from "./_components/Navbar";
import { Sidebar } from "./_components/Sidebar";
import { Rail } from "./_components/Rail";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SidebarWrapper } from "./_components/SidebarWrapper";
import { getServerUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth/login");
  }
  return (
    <ThemeProvider>
      <section className="min-h-screen bg-light-bg dark:bg-dark-bg">
        <Navbar />
        <div className="flex gap-0 h-[calc(100vh-64px)] overflow-hidden">
          <Rail />
          <SidebarWrapper />
          <div className="flex-1 overflow-auto h-full bg-light-bg dark:bg-dark-bg">{children}</div>
        </div>
      </section>
    </ThemeProvider>
  );
}


