"use client"

import { useState } from "react"
import { Eye, Calendar, Filter } from "lucide-react"

interface TopContentProps {
    initialData: any[]
}

export function TopContent({ initialData }: TopContentProps) {
    const [period, setPeriod] = useState("week") // week, month, year

    return (
        <div className="bg-surface-dark/50 rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Filter className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">Top Content</h3>
                </div>

                <div className="flex bg-surface rounded-lg p-0.5 border border-border/50">
                    <button
                        onClick={() => setPeriod("week")}
                        className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all uppercase tracking-wider ${period === "week"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Week
                    </button>
                    <button
                        onClick={() => setPeriod("month")}
                        className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all uppercase tracking-wider ${period === "month"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Month
                    </button>
                    <button
                        onClick={() => setPeriod("year")}
                        className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all uppercase tracking-wider ${period === "year"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Year
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead className="bg-white/5 text-muted-foreground uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium">Page Title</th>
                            <th className="px-4 py-3 text-right font-medium">Views</th>
                            <th className="px-4 py-3 text-right font-medium">Trend</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {initialData && initialData.length > 0 ? (
                            initialData.map((item, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-4 py-3 font-medium text-foreground max-w-[200px] truncate" title={item.page_path}>
                                        <span className="text-primary mr-2 font-mono">/{i + 1}</span>
                                        {item.page_path}
                                    </td>
                                    <td className="px-4 py-3 text-foreground font-bold text-right font-mono">
                                        {item.views.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1 text-emerald-500">
                                            <TrendingUp className="size-3" />
                                            <span className="text-[10px]">+12%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                                    No analytics data available yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function TrendingUp(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    )
}
