"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts"
import { Globe, Smartphone, Monitor, Tablet, Laptop, Watch } from "lucide-react"

interface VisitorStatsProps {
    countryData: { country: string; count: number }[]
    deviceData: { device_type: string; count: number; percentage: number }[]
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

export function VisitorStats({ countryData, deviceData }: VisitorStatsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Countries Stats */}
            <div className="bg-surface-dark/50 rounded-xl border border-border p-5">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                        <Globe className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">Top Regions</h3>
                </div>

                <div className="space-y-4">
                    {countryData.slice(0, 5).map((item, index) => (
                        <div key={item.country} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3 min-w-[100px]">
                                <span className="text-xs font-mono text-muted-foreground w-4">
                                    {index + 1}
                                </span>
                                <span className="text-xs font-medium text-foreground">
                                    {(() => {
                                        try {
                                            if (item.country === "Unknown" || !item.country) return "Unknown";
                                            // Intl.DisplayNames is great but sometimes fails in specific envs, safe fallback
                                            return new Intl.DisplayNames(['en'], { type: 'region' }).of(item.country) || item.country
                                        } catch {
                                            return item.country
                                        }
                                    })()}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 flex-1 mx-4">
                                <div className="h-1.5 flex-1 bg-surface-light rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full group-hover:bg-blue-400 transition-colors"
                                        style={{
                                            width: `${(item.count / Math.max(...countryData.map((d) => d.count))) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                            <span className="text-xs font-mono text-foreground min-w-[40px] text-right">
                                {item.count.toLocaleString()}
                            </span>
                        </div>
                    ))}

                    {countryData.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-xs">No data available</div>
                    )}
                </div>
            </div>

            {/* Devices Stats */}
            <div className="bg-surface-dark/50 rounded-xl border border-border p-5">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                        <Smartphone className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">Device Breakdown</h3>
                </div>

                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={deviceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={70}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="count"
                                nameKey="device_type"
                                stroke="rgba(0,0,0,0.5)"
                            >
                                {deviceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip
                                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                                itemStyle={{ color: '#e4e4e7' }}
                            />
                            <Legend
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                                iconSize={8}
                                formatter={(value, entry: any) => (
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider ml-1">
                                        {value} ({entry.payload.percentage.toFixed(1)}%)
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
