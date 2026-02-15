"use client"

import { useState } from "react"
import { ChevronDown, Download, TrendingUp, Eye, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface AnalyticsData {
    date: string
    views_count: number
    visitors_count: number
}

interface ViewsChartProps {
    data: AnalyticsData[]
}

export function ViewsChart({ data }: ViewsChartProps) {
    const [selectedDay, setSelectedDay] = useState<number | null>(null)
    const [hoveredDay, setHoveredDay] = useState<number | null>(null)
    const [metric, setMetric] = useState<"views" | "visitors">("views")
    const [period, setPeriod] = useState("Last 30 Days")

    // Generate chart data ensuring all days in the period are represented
    const totalDays = period === "Last 7 Days" ? 7 : period === "Last 30 Days" ? 30 : 90

    const chartData = Array.from({ length: totalDays }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (totalDays - 1 - i))
        const dateStr = d.toISOString().split('T')[0] // YYYY-MM-DD

        // Find matching data for this date
        const matchingItem = data.find(item => item.date === dateStr)

        return {
            day: i + 1,
            value: matchingItem
                ? (metric === "views" ? matchingItem.views_count : matchingItem.visitors_count)
                : 0,
            date: d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            fullDate: dateStr,
        }
    })

    const maxValue = Math.max(...chartData.map((d) => d.value), 10) // Min max value of 10 to avoid 0 division
    const totalValue = chartData.reduce((sum, d) => sum + d.value, 0)
    const avgValue = Math.round(totalValue / chartData.length)
    const dotSize = 6
    const dotsPerColumn = 12

    const renderDots = (value: number, day: number) => {
        const normalizedValue = Math.min(value, maxValue)
        const filledDots = maxValue > 0 ? Math.round((normalizedValue / maxValue) * dotsPerColumn) : 0
        const isSelected = selectedDay === day
        const isHovered = hoveredDay === day

        return (
            <div
                className="flex flex-col-reverse gap-[2px] cursor-pointer relative group items-center"
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                onClick={() => setSelectedDay(selectedDay === day ? null : day)}
            >
                {/* Tooltip */}
                {isHovered && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap z-50 border border-border shadow-md">
                        {chartData[day - 1]?.date}: {value.toLocaleString()} {metric}
                    </div>
                )}
                {Array.from({ length: dotsPerColumn }).map((_, index) => (
                    <div
                        key={index}
                        className={`rounded-full transition-all duration-300 ${index >= filledDots ? 'bg-muted/20' : ''}`}
                        style={{
                            width: dotSize,
                            height: dotSize,
                            backgroundColor:
                                index < filledDots
                                    ? isSelected || isHovered
                                        ? "var(--primary)"
                                        : "rgba(16, 185, 129, 0.5)" // Emerald-500 equivalent with opacity
                                    : undefined,
                            opacity: index < filledDots ? 1 : 0.2
                        }}
                    />
                ))}
            </div>
        )
    }

    const targetValue = Math.round(maxValue * 0.7)

    return (
        <div className="w-full p-6 bg-surface-dark/50 rounded-xl border border-border">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="font-bold text-lg text-foreground uppercase tracking-wider">
                        Traffic Overview
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Total: <span className="text-foreground font-mono">{totalValue.toLocaleString()}</span> | Avg: <span className="text-foreground font-mono">{avgValue.toLocaleString()}</span> /day
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Metric Toggle */}
                    <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
                        <button
                            onClick={() => setMetric("views")}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs uppercase tracking-wider transition-colors ${metric === "views"
                                ? "bg-primary text-primary-foreground font-bold"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Eye className="h-3 w-3" />
                            Views
                        </button>
                        <button
                            onClick={() => setMetric("visitors")}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs uppercase tracking-wider transition-colors ${metric === "visitors"
                                ? "bg-primary text-primary-foreground font-bold"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Users className="h-3 w-3" />
                            Visitors
                        </button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="text-muted-foreground gap-1 h-8 text-xs uppercase tracking-wider border-border bg-surface">
                                {period}
                                <ChevronDown className="h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setPeriod("Last 7 Days")}>
                                Last 7 Days
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setPeriod("Last 30 Days")}>
                                Last 30 Days
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setPeriod("Last 90 Days")}>
                                Last 90 Days
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-[240px] w-full">
                {/* Y-axis labels */}
                <div className="absolute right-0 top-0 bottom-8 flex flex-col justify-between text-[10px] text-muted-foreground font-mono opacity-50">
                    <span>{maxValue}</span>
                    <span>{Math.round(maxValue * 0.66)}</span>
                    <span>{Math.round(maxValue * 0.33)}</span>
                    <span>0</span>
                </div>

                {/* Target line with tooltip */}
                <div
                    className="absolute right-8 left-0 flex items-center pointer-events-none opacity-30"
                    style={{ top: `${((maxValue - targetValue) / maxValue) * 100}%` }}
                >
                    <div className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                        <TrendingUp className="h-2 w-2" />
                        {targetValue}
                    </div>
                    <div
                        className="flex-1 border-t border-dashed border-primary"
                        style={{ marginRight: 8 }}
                    />
                </div>

                {/* Dots Chart */}
                <div
                    className="mr-12 flex items-end justify-between gap-1 overflow-hidden h-full pb-8 pr-2"
                >
                    {chartData.map((item) => (
                        <div key={item.day} className="flex flex-col items-center flex-1 min-w-[10px]">
                            {renderDots(item.value, item.day)}
                        </div>
                    ))}
                </div>

                {/* X-axis labels */}
                <div className="mr-12 flex justify-between absolute bottom-0 left-0 right-0 text-[10px] text-muted-foreground font-mono opacity-50 pt-2 border-t border-white/5">
                    {chartData
                        .filter((_, i) => (chartData.length - 1 - i) % Math.ceil(totalDays / 6) === 0)
                        .map((item) => (
                            <span key={item.day}>
                                {item.date}
                            </span>
                        ))}
                </div>
            </div>
        </div>
    )
}
