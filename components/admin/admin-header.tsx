import { createClient } from "@/lib/supabase/server";
import { Shield, AlertTriangle } from "lucide-react";
import { AdminLogoutButton } from "./admin-logout-button";
import { NotificationBadge } from "@/components/admin/notification-badge";
import Image from "next/image";

export async function AdminHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: theme } = await supabase.from("theme_settings").select("admin_avatar").limit(1).single();

  return (
    <header className="relative z-40 flex items-center justify-between whitespace-nowrap border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4 sticky top-0 h-16">
      <div className="flex items-center gap-4">
        <div className="size-8 flex items-center justify-center border bg-muted/30 rounded-md">
          <Shield className="text-foreground size-4" />
        </div>
        <div>
          <h2 className="text-foreground text-sm font-semibold leading-tight">Admin Workspace</h2>
          <div className="text-xs text-muted-foreground font-medium">Sayed Elshazly</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBadge />
        <div className="h-4 w-px bg-border hidden sm:block" />
        <AdminLogoutButton />
        <div className="size-8 rounded-full border border-border flex items-center justify-center text-xs font-bold text-foreground overflow-hidden bg-muted">
          {theme?.admin_avatar ? (
            <Image src={theme.admin_avatar} alt="Admin" width={32} height={32} className="w-full h-full object-cover" />
          ) : (
            user?.email?.[0]?.toUpperCase() || "A"
          )}
        </div>
      </div>
    </header>
  );
}
