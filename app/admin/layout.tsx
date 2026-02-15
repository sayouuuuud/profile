import React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata = {
  title: "Admin: Mission Control Interface",
  description: "Portfolio administration and content management",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden font-inter">
      {/* Grid background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10 bg-grid-pattern" style={{ backgroundSize: "40px 40px", maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)" }} />
      {/* Scanline */}
      <div className="fixed inset-0 z-50 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(16,185,129,0.02) 51%)", backgroundSize: "100% 4px" }} />

      <AdminHeader />
      <div className="flex flex-1 overflow-hidden relative z-10">
        <AdminSidebar />
        <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-background/80">
          {children}
        </main>
      </div>
    </div>
  );
}
