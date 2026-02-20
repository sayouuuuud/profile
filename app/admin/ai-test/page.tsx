"use client"

import { useState } from "react"
import { Bot, Sparkles, Code, Activity, Send, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AITestPage() {
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const handleAnalyze = async () => {
        if (!input.trim()) return
        setLoading(true)
        setResult(null)
        setError(null)

        try {
            const res = await fetch("/api/ai/parse-project", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input, source: "text" })
            })

            if (!res.ok) {
                const errText = await res.text()
                throw new Error(errText || "Failed to analyze")
            }

            const data = await res.json()
            setResult(data.data)
        } catch (e: any) {
            console.error(e)
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-8">
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                    <Bot className="size-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI Playground</h1>
                    <p className="text-muted-foreground">Test the project analysis engine directly.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Project Description</CardTitle>
                        <CardDescription>
                            Paste any project idea, readme content, or rough notes here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="e.g. I built a real-time chat app using Socket.io and Redis queue to handle..."
                            className="min-h-[300px] font-mono text-sm leading-relaxed"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button
                            className="w-full bg-purple-600 hover:bg-purple-500"
                            size="lg"
                            onClick={handleAnalyze}
                            disabled={loading || !input.trim()}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Analyzing with Gemini...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 size-4" />
                                    Analyze Project
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Output Section */}
                <div className="space-y-6">
                    {error && (
                        <Card className="border-red-500/50 bg-red-500/10">
                            <CardContent className="pt-6 text-red-500 font-mono text-sm">
                                Error: {error}
                            </CardContent>
                        </Card>
                    )}

                    {!result && !error && !loading && (
                        <div className="h-full border-2 border-dashed border-muted-foreground/25 rounded-xl flex flex-col items-center justify-center text-muted-foreground p-12 text-center">
                            <Bot className="size-12 mb-4 opacity-50" />
                            <p>Results will appear here</p>
                        </div>
                    )}

                    {result && (
                        <Tabs defaultValue="visual" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="visual">Visual Report</TabsTrigger>
                                <TabsTrigger value="json">Raw JSON</TabsTrigger>
                            </TabsList>

                            <TabsContent value="visual" className="space-y-4 mt-4">
                                {/* Title & Confidence */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardDescription>Detected Title</CardDescription>
                                                <CardTitle className="text-xl text-purple-400">{result.title}</CardTitle>
                                            </div>
                                            <Badge variant={result.confidence > 80 ? "default" : "secondary"}>
                                                {result.confidence}% Confidence
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {result.summary}
                                        </p>
                                        {result.subtitle && <p className="text-sm text-purple-400 mt-2 italic">{result.subtitle}</p>}
                                    </CardContent>
                                </Card>

                                {/* Deep Dive Responses */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Deep Dive</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {result.responses && Object.entries(result.responses).map(([key, value]) => (
                                            <div key={key}>
                                                <h4 className="text-xs font-bold uppercase text-purple-400 mb-1">{key}</h4>
                                                <p className="text-sm text-muted-foreground">{String(value)}</p>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* Tech Stack */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <Code className="size-4" />
                                            Tech Stack
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-wrap gap-2">
                                        {result.technologies.map((tech: string) => (
                                            <Badge key={tech} variant="outline" className="bg-purple-500/5 hover:bg-purple-500/10">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* metrics */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <Activity className="size-4" />
                                            Key Metrics
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4">
                                        {result.metrics && result.metrics.map((m: any, i: number) => (
                                            <div key={i} className="bg-muted/50 p-3 rounded-lg">
                                                <div className="text-xs text-muted-foreground capitalize mb-1">{m.label}</div>
                                                <div className="font-mono font-bold">{m.value}</div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="json">
                                <Card>
                                    <CardContent className="pt-6">
                                        <pre className="text-xs font-mono overflow-auto max-h-[500px] p-4 bg-black/50 rounded-lg">
                                            {JSON.stringify(result, null, 2)}
                                        </pre>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </div>
        </div>
    )
}
