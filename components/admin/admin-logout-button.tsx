"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Sign out"
    >
      <LogOut className="size-5" />
    </button>
  );
}
