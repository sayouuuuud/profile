"use client"

import { useState, Suspense } from "react"
import { ConfigurationPanel } from "./components/ConfigurationPanel"
import { UsageStats } from "./components/UsageStats"
import { CostAnalysis } from "./components/CostAnalysis"
import { ActivityLogs } from "./components/ActivityLogs"
import { TestingTools } from "./components/TestingTools"
import { Settings, BarChart2, DollarSign, FileText, Beaker } from "lucide-react"

export default function ControlPanelPage() {
    const [activeTab, setActiveTab] = useState("config")

    const tabs = [
        { id: "config", label: "Configuration", icon: Settings },
        { id: "stats", label: "Usage & Stats", icon: BarChart2 },
        { id: "costs", label: "Cost Analysis", icon: DollarSign },
        { id: "logs", label: "Activity Logs", icon: FileText },
        { id: "test", label: "Testing Tools", icon: Beaker },
    ]

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-8 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
                    <p className="text-muted-foreground">Centralized management for AI, Analytics, and Infrastructure.</p>
                </div>
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex border-b border-border mb-6 flex-shrink-0">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === tab.id
                                        ? "border-primary text-primary bg-primary/5"
                                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5"
                                    }`}
                            >
                                <Icon className="size-4" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto pr-2 pb-12">
                    <Suspense fallback={<div className="p-12 text-center text-muted-foreground">Loading module...</div>}>
                        {activeTab === "config" && <ConfigurationPanel />}
                        {activeTab === "stats" && <UsageStats />}
                        {activeTab === "costs" && <CostAnalysis />}
                        {activeTab === "logs" && <ActivityLogs />}
                        {activeTab === "test" && <TestingTools />}
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
