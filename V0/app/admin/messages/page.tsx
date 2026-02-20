"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Mail, Star, Trash2, Loader2, Eye, Clock, Archive } from "lucide-react";

export default function AdminMessagesPage() {
  const supabase = createClient();
  const [messages, setMessages] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }

  async function markAs(id: string, status: string) {
    await supabase.from("messages").update({ status }).eq("id", id);
    setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
  }

  async function toggleStar(id: string) {
    const msg = messages.find(m => m.id === id);
    if (!msg) return;
    await supabase.from("messages").update({ is_starred: !msg.is_starred }).eq("id", id);
    setMessages(messages.map(m => m.id === id ? { ...m, is_starred: !m.is_starred } : m));
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return;
    await supabase.from("messages").delete().eq("id", id);
    setMessages(messages.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  async function selectMessage(msg: any) {
    setSelected(msg);
    if (msg.status === "unread") {
      await markAs(msg.id, "read");
    }
  }

  const filtered = messages.filter(m => {
    if (filter === "unread") return m.status === "unread";
    if (filter === "starred") return m.is_starred;
    return true;
  });

  const unreadCount = messages.filter(m => m.status === "unread").length;

  if (loading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="size-6 text-primary animate-spin" /></div>;

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Message List */}
      <div className="w-96 border-r border-border flex flex-col shrink-0 overflow-hidden bg-surface-dark/30">
        <div className="p-4 border-b border-border space-y-3 sticky top-0 bg-surface-dark/80 z-10" style={{ backdropFilter: "blur(12px)" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground tracking-widest flex items-center gap-2">
              <Mail className="size-4 text-primary" /> TRANSMISSIONS
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded border border-primary/30">{unreadCount} new</span>
            )}
          </div>
          <div className="flex gap-1">
            {(["all", "unread", "starred"] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded transition-colors ${filter === f ? "bg-primary/10 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-foreground/5 border border-transparent"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">No messages found</div>
          ) : (
            filtered.map(msg => (
              <button
                key={msg.id}
                type="button"
                onClick={() => selectMessage(msg)}
                className={`w-full text-left px-4 py-3 border-b border-border hover:bg-foreground/5 transition-colors ${selected?.id === msg.id ? "bg-primary/10 border-l-2 border-l-primary" : ""} ${msg.status === "unread" ? "bg-foreground/[0.02]" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {msg.status === "unread" && <span className="size-1.5 bg-primary rounded-full shrink-0" />}
                      <h3 className={`text-xs truncate ${msg.status === "unread" ? "font-bold text-foreground" : "text-muted-foreground"}`}>{msg.name}</h3>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{msg.subject || "No subject"}</p>
                    <p className="text-[10px] text-muted-foreground/60 truncate mt-0.5">{msg.message?.substring(0, 60)}...</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[9px] text-muted-foreground">{new Date(msg.created_at).toLocaleDateString()}</span>
                    {msg.is_starred && <Star className="size-3 text-amber-500 fill-amber-500" />}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="flex-1 overflow-y-auto">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Mail className="size-12 mb-4 opacity-20" />
            <p className="text-sm">Select a transmission to view</p>
          </div>
        ) : (
          <div className="p-6 max-w-3xl space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">{selected.subject || "No Subject"}</h2>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{selected.name}</span>
                  <span className="text-primary">{selected.email}</span>
                  <span className="flex items-center gap-1"><Clock className="size-3" /> {new Date(selected.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => toggleStar(selected.id)} className={`p-2 rounded transition-colors ${selected.is_starred ? "bg-amber-500/10 text-amber-500" : "text-muted-foreground hover:bg-foreground/5"}`}>
                  <Star className={`size-4 ${selected.is_starred ? "fill-amber-500" : ""}`} />
                </button>
                <button type="button" onClick={() => markAs(selected.id, "archived")} className="p-2 rounded text-muted-foreground hover:bg-foreground/5 transition-colors">
                  <Archive className="size-4" />
                </button>
                <button type="button" onClick={() => deleteMessage(selected.id)} className="p-2 rounded text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            <div className="p-6 rounded border border-border bg-surface-dark/50">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
