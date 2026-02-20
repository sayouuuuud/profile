"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Shield, Key, Lock, Eye, EyeOff, Save, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { LoginHistory } from "@/components/admin/security/login-history";

export default function AdminSecurityPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    load();
  }, []);

  async function handlePasswordChange() {
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }
    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters.");
      setMessageType("error");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage(error.message);
      setMessageType("error");
    } else {
      setMessage("Password updated successfully.");
      setMessageType("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setSaving(false);
  }

  const rlsPolicies = [
    { table: "site_settings", status: "enforced", read: "Public", write: "Authenticated" },
    { table: "metrics", status: "enforced", read: "Public", write: "Authenticated" },
    { table: "case_studies", status: "enforced", read: "Public", write: "Authenticated" },
    { table: "messages", status: "enforced", read: "Authenticated", write: "Public (Insert)" },
    { table: "skill_categories", status: "enforced", read: "Public", write: "Authenticated" },
    { table: "skills", status: "enforced", read: "Public", write: "Authenticated" },
    { table: "operations", status: "enforced", read: "Public", write: "Authenticated" },
    { table: "certificates", status: "enforced", read: "Public", write: "Authenticated" },
    { table: "education", status: "enforced", read: "Public", write: "Authenticated" },
    { table: "arsenal", status: "enforced", read: "Public", write: "Authenticated" },
    { table: "social_links", status: "enforced", read: "Public", write: "Authenticated" },
    { table: "theme_settings", status: "enforced", read: "Public", write: "Authenticated" },
    { table: "datalinks", status: "enforced", read: "Public", write: "Authenticated" },
    { table: "activity_log", status: "enforced", read: "Authenticated", write: "Authenticated" },
    { table: "landing_sections", status: "enforced", read: "Public", write: "Authenticated" },
    { table: "executive_brief", status: "enforced", read: "Public", write: "Authenticated" },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground tracking-widest flex items-center gap-3">
            <Shield className="size-6 text-primary" /> SECURITY PROTOCOLS
          </h1>
        </div>

        {message && (
          <div className={`px-4 py-2 rounded text-xs border flex items-center gap-2 ${messageType === "error" ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-primary/10 border-primary/30 text-primary"}`}>
            {messageType === "error" ? <AlertTriangle className="size-3.5" /> : <CheckCircle className="size-3.5" />}
            {message}
          </div>
        )}

        {/* Account Info */}
        <section className="p-6 rounded border border-border bg-surface-dark/50 space-y-4">
          <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
            <Key className="size-4 text-primary" /> ROOT ACCESS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted-foreground uppercase tracking-widest">Email</label>
              <div className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground">
                {user?.email || "Loading..."}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted-foreground uppercase tracking-widest">User ID</label>
              <div className="bg-background border border-border rounded px-3 py-2 text-sm text-muted-foreground truncate">
                {user?.id || "Loading..."}
              </div>
            </div>
          </div>
        </section>

        {/* Password Change */}
        <section className="p-6 rounded border border-border bg-surface-dark/50 space-y-4">
          <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
            <Lock className="size-4 text-amber-500" /> PASSWORD ROTATION
          </h2>
          <div className="grid grid-cols-1 gap-4 max-w-md">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted-foreground uppercase tracking-widest">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-muted-foreground uppercase tracking-widest">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <button type="button" onClick={handlePasswordChange} disabled={saving} className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-500/90 text-background text-xs font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50 w-fit">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </section>

        {/* Login History */}
        <LoginHistory />

        {/* RLS Policies */}
        <section className="p-6 rounded border border-border bg-surface-dark/50 space-y-4">
          <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
            <Shield className="size-4 text-primary" /> ROW LEVEL SECURITY POLICIES
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground uppercase tracking-widest">Table</th>
                  <th className="text-left py-2 px-3 text-muted-foreground uppercase tracking-widest">Status</th>
                  <th className="text-left py-2 px-3 text-muted-foreground uppercase tracking-widest">Read</th>
                  <th className="text-left py-2 px-3 text-muted-foreground uppercase tracking-widest">Write</th>
                </tr>
              </thead>
              <tbody>
                {rlsPolicies.map((p) => (
                  <tr key={p.table} className="border-b border-border/50 hover:bg-foreground/[0.02]">
                    <td className="py-2 px-3 text-foreground">{p.table}</td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[10px]">
                        <span className="size-1 bg-primary rounded-full" /> {p.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">{p.read}</td>
                    <td className="py-2 px-3 text-muted-foreground">{p.write}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
