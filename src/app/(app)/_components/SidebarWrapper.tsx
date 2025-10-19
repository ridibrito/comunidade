"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

export function SidebarWrapper() {
  const pathname = usePathname();
  
  // Only show sidebar for specific sections
  const inCatalog = pathname.startsWith("/catalog");
  const inEvents = pathname.startsWith("/events");
  const inAdmin = pathname.startsWith("/admin");
  const shouldShow = inCatalog || inEvents || inAdmin;
  
  if (!shouldShow) {
    return null;
  }
  
  return <Sidebar />;
}
