import { Navbar } from "./_components/Navbar";
import { Sidebar } from "./_components/Sidebar";
import { Rail } from "./_components/Rail";
import { SidebarWrapper } from "./_components/SidebarWrapper";
import { getServerUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { NotificationProvider } from "@/components/ui/NotificationSystem";

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
    <ToastProvider>
      <NotificationProvider>
        <section className="min-h-screen bg-light-bg">
          <Navbar />
          <div className="flex gap-0 h-[calc(100vh-64px)] overflow-hidden">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex">
              <Rail />
              <SidebarWrapper />
            </div>
            
            {/* Mobile/Desktop Content */}
            <div className="flex-1 overflow-auto h-full bg-light-bg">
              {children}
            </div>
          </div>
        </section>
      </NotificationProvider>
    </ToastProvider>
  );
}


