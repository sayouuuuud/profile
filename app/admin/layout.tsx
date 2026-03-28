import React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata = {
  title: "Admin: Mission Control Interface",
  description: "Portfolio administration and content management",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col font-inter bg-background text-foreground overflow-hidden">
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden relative w-full h-full">
        <AdminSidebar />
        <main className="flex-1 flex flex-col h-full overflow-y-auto bg-muted/20 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
