"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AIChatModal({ feedbackData }: { feedbackData: any }) {
    const [messages, setMessages] = useState<{role: 'user'|'model', content: string}[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMarking, setIsMarking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const isResolved = feedbackData.status === 'resolved';

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    async function handleSend(e?: React.FormEvent) {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const newMsg = { role: 'user' as const, content: input.trim() };
        const newHistory = [...messages, newMsg];
        setMessages(newHistory);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/admin/ai-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: newHistory,
                    context: {
                        project_title: feedbackData.project_title,
                        feedback: Array.isArray(feedbackData.feedback) ? feedbackData.feedback : [feedbackData.feedback]
                    }
                })
            });

            const data = await res.json();
            if (res.ok) {
                setMessages([...newHistory, { role: 'model', content: data.response }]);
            } else {
                toast.error(data.error || "Failed to get AI response");
                setMessages(newHistory); // AI failed, keep user message
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setIsLoading(false);
        }
    }

    async function toggleResolve() {
        setIsMarking(true);
        try {
            const supabase = createClient();
            const newStatus = isResolved ? 'pending' : 'resolved';
            const { error } = await supabase.from('ai_feedbacks').update({ status: newStatus }).eq('id', feedbackData.id);
            if (error) throw error;
            toast.success(newStatus === 'resolved' ? 'Marked as resolved' : 'Marked as pending');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsMarking(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="w-full md:w-auto px-4 py-2 flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-md transition-colors text-sm font-medium border border-emerald-500/20">
                    <Bot className="size-4" />
                    Discuss with AI
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-background border-border">
                <DialogHeader className="p-4 md:p-6 border-b shrink-0 flex flex-col items-start justify-center text-left">
                    <DialogTitle className="flex items-center gap-2">
                        <Bot className="size-5 text-emerald-500" /> 
                        AI Consultant
                    </DialogTitle>
                    <DialogDescription className="line-clamp-1">
                        Discussing suggestions for: {feedbackData.project_title}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 p-4 md:p-6 bg-muted/10">
                    <div className="space-y-4 pb-4">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 pt-10 px-4 opacity-70">
                                <div className="p-3 bg-emerald-500/10 rounded-full">
                                    <Bot className="size-8 text-emerald-500" />
                                </div>
                                <p className="text-sm text-muted-foreground w-full max-w-[80%] leading-relaxed">
                                    I am ready to discuss my feedback on this project.
                                    <br/> You can ask me about the reasoning or request clarification on the suggestions I provided.
                                </p>
                            </div>
                        ) : (
                            messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row' : 'flex-row'}`}>
                                        <div className={`shrink-0 size-8 flex items-center justify-center rounded-full mt-1 ${m.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                            {m.role === 'user' ? <User className="size-4" /> : <Bot className="size-4" />}
                                        </div>
                                        <div className={`p-4 rounded-xl text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}>
                                            {m.content}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="flex justify-end">
                                <div className="flex gap-3 max-w-[85%]">
                                    <div className="shrink-0 size-8 flex items-center justify-center rounded-full mt-1 bg-emerald-500/20 text-emerald-500">
                                        <Bot className="size-4 animate-pulse" />
                                    </div>
                                    <div className="p-3 rounded-xl bg-card border flex gap-1 items-center h-10">
                                        <span className="size-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="size-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="size-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                <div className="p-4 border-t bg-background shrink-0 space-y-4">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Talk to the AI to understand its feedback..."
                            className="flex-1 bg-muted px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim()}
                            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2 flex items-center justify-center transition-colors px-6 rounded-md"
                        >
                            <Send className="size-5" />
                        </button>
                    </form>
                    
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground hidden sm:inline-block">This conversation is temporary and will not be saved after closing.</span>
                        <button 
                            type="button" 
                            onClick={toggleResolve}
                            disabled={isMarking}
                            className={`flex items-center gap-1 font-medium transition-colors ml-auto ${isResolved ? 'text-amber-500 hover:text-amber-400' : 'text-emerald-500 hover:text-emerald-400'}`}
                        >
                            {isResolved ? 'Mark as Pending' : (
                                <>
                                    <Check className="size-3" /> Mark as Resolved
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
