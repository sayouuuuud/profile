"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import {
  Plus, Loader2, Eye, EyeOff, Calendar, Users, Briefcase,
  ArrowRight, Search, LayoutGrid, List as ListIcon, MoreVertical,
  Trash2, ExternalLink
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function AdminCaseStudies() {
  const supabase = createClient()
  const router = useRouter()
  const [studies, setStudies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadStudies()
  }, [])

  async function loadStudies() {
    const { data } = await supabase.from("case_studies").select("*").order("sort_order", { ascending: true })
    setStudies(data || [])
    setLoading(false)
  }

  const filteredStudies = studies.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.client?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="size-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="container mx-auto py-12 px-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">My Missions</h1>
          <p className="text-muted-foreground">Manage your portfolio case studies and project archives.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search missions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-surface-dark/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary w-64 transition-all"
            />
          </div>
          <div className="flex items-center border border-border rounded-lg bg-surface-dark/50 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <ListIcon className="size-4" />
            </button>
          </div>
          <Link
            href="/admin/case-studies/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-background font-bold tracking-wide uppercase text-sm rounded-lg transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-0.5"
          >
            <Plus className="size-4" />
            New Mission
          </Link>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudies.map((study) => (
            <Link
              key={study.id}
              href={`/admin/case-studies/${study.id}`}
              className="group relative bg-surface-dark/30 border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 block h-full flex flex-col"
            >
              {/* Image / Placeholder */}
              <div className="h-48 bg-surface-dark relative overflow-hidden">
                {study.thumbnail_url || study.cover_image_url ? (
                  <img
                    src={study.thumbnail_url || study.cover_image_url}
                    alt={study.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                    <Briefcase className="size-12" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded backdrop-blur-md border ${study.status === 'published'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                    {study.status === 'published' ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-[10px] font-mono text-primary mb-2 uppercase tracking-widest">{study.category || "Uncategorized"}</div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">{study.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{study.subtitle || study.summary || "No description provided."}</p>

                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      {study.is_visible ? <Eye className="size-3.5 text-emerald-400" /> : <EyeOff className="size-3.5" />}
                      <span>{study.is_visible ? "Visible" : "Hidden"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      <span>{study.date || "No date"}</span>
                    </div>
                  </div>
                  <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                </div>
              </div>
            </Link>
          ))}

          {/* Add New Card */}
          <Link
            href="/admin/case-studies/new"
            className="group flex flex-col items-center justify-center h-full min-h-[350px] border border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-primary/[0.02] transition-all"
          >
            <div className="size-16 rounded-full bg-surface-dark flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="size-6 text-muted-foreground group-hover:text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Create New Mission</h3>
          </Link>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-2">
          {filteredStudies.map((study) => (
            <Link
              key={study.id}
              href={`/admin/case-studies/${study.id}`}
              className="group flex items-center gap-4 p-4 bg-surface-dark/30 border border-border rounded-xl hover:border-primary/50 hover:bg-surface-dark/50 transition-all"
            >
              <div className="size-12 rounded bg-surface-dark overflow-hidden shrink-0">
                {study.thumbnail_url || study.cover_image_url ? (
                  <img src={study.thumbnail_url || study.cover_image_url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/20"><Briefcase className="size-5" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{study.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{study.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${study.status === 'published'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                    {study.status === 'published' ? 'Active' : 'Draft'}
                  </span>
                  {study.is_visible ? <Eye className="size-3 text-emerald-400" /> : <EyeOff className="size-3 text-muted-foreground" />}
                </div>
                <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                  <Calendar className="size-3" />
                  <span>{study.date}</span>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary opacity-50 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      )}

      {filteredStudies.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="size-16 rounded-full bg-surface-dark flex items-center justify-center mx-auto mb-4">
            <Search className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No missions found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your search terms or create a new mission.</p>
          <button onClick={() => setSearch("")} className="text-primary hover:underline text-sm">Clear Search</button>
        </div>
      )}
    </div>
  )
}
