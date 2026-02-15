"use client";

import React from "react"

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { logLoginEvent } from "@/app/actions/security";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      await logLoginEvent(email, "failure", error.message);
    } else {
      await logLoginEvent(email, "success");
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-pattern grid-bg" />
      {/* Scanline overlay */}
      <div className="fixed inset-0 scanline pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-emerald" />
            <span className="text-xs font-mono text-emerald tracking-[0.3em] uppercase">
              Root Access Terminal
            </span>
          </div>
          <h1 className="font-serif-display text-2xl text-gold tracking-[0.15em] glow-gold">
            COMMAND CENTER
          </h1>
          <p className="text-text-dim text-sm mt-2 font-light">
            Authentication required for admin operations
          </p>
        </div>

        {/* Login Form */}
        <div className="glass-panel rounded-lg p-8 tech-border">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
            <Lock className="h-4 w-4 text-emerald" />
            <span className="text-xs font-mono text-emerald tracking-wider uppercase">
              Secure Authentication
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-mono text-text-dim tracking-wider uppercase mb-2"
              >
                Operator Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0a0a0a] border border-border rounded px-4 py-3 text-sm text-foreground font-mono placeholder:text-text-dim focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald/30 transition-colors"
                placeholder="admin@command.center"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-mono text-text-dim tracking-wider uppercase mb-2"
              >
                Access Key
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0a0a0a] border border-border rounded px-4 py-3 text-sm text-foreground font-mono placeholder:text-text-dim focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald/30 transition-colors pr-12"
                  placeholder="Enter access key"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-emerald transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-950/30 border border-red-900/50 rounded px-4 py-3 text-red-400 text-xs font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald hover:bg-emerald-dim text-[#050505] font-semibold py-3 rounded text-sm tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-[#050505]/30 border-t-[#050505] rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Initialize Session"
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs font-mono text-text-dim">
              <span>Protocol: TLS 1.3</span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
                Secure
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
