import { createClient } from "@/lib/supabase/server";
import { Shield, AlertTriangle } from "lucide-react";
import { AdminLogoutButton } from "./admin-logout-button";
import { NotificationBadge } from "@/components/admin/notification-badge";

export async function AdminHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="relative z-40 flex items-center justify-between whitespace-nowrap border-b border-border px-6 py-4 sticky top-0 h-16" style={{ background: "rgba(10,10,10,0.7)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center gap-4">
        <div className="size-8 flex items-center justify-center border border-primary/30 bg-primary/10 rounded-sm">
          <Shield className="text-primary size-4" />
        </div>
        <div>
          <h2 className="text-foreground text-sm font-bold leading-tight tracking-[0.1em]">MISSION CONTROL</h2>
          <div className="text-[10px] text-muted-foreground tracking-widest">{"ADMIN :: SAYED ELSHAZLY"}</div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-surface-light border border-foreground/5">
          <AlertTriangle className="size-3 text-amber-500 animate-pulse" />
          <span className="text-[10px] text-amber-500 tracking-wider">{"SYS_LOAD: 42%"}</span>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="flex items-center gap-3">
          <NotificationBadge />
          <AdminLogoutButton />
          <div className="size-8 rounded-full bg-gradient-to-br from-primary to-amber-500 p-px">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-foreground">
              {user?.email?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
