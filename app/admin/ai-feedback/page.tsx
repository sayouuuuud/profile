import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, CheckCircle, Clock } from "lucide-react";
import { AIChatModal } from "@/components/admin/ai-feedback/chat-modal";

export const revalidate = 0;

export default async function AIFeedbackPage() {
    const supabase = await createClient();
    
    // Fetch feedbacks
    const { data: feedbacks, error } = await supabase
        .from("ai_feedbacks")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-emerald-500">AI Feedback</h1>
                <p className="text-muted-foreground">
                    Review and discuss AI suggestions generated during project creation.
                </p>
            </div>

            {error && (
                <div className="p-4 bg-red-900/20 text-red-400 border border-red-900/50 rounded-lg">
                    Failed to load feedbacks: {error.message}
                </div>
            )}

            {!feedbacks?.length && !error && (
                <div className="p-12 text-center rounded-xl bg-muted/20 border border-dashed flex flex-col items-center justify-center gap-4">
                    <MessageSquare className="size-10 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No feedback recorded yet.</p>
                </div>
            )}

            <div className="grid gap-4">
                {feedbacks?.map((item) => (
                    <div key={item.id} className={`p-5 flex flex-col md:flex-row md:items-start justify-between gap-6 rounded-xl border transition-all shadow-sm ${item.status === 'resolved' ? 'bg-muted/10 opacity-70' : 'bg-card/50 hover:border-emerald-500/30'}`}>
                        <div className="space-y-4 flex-1">
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    {item.project_title || "Unknown Project"}
                                    {item.status === 'resolved' ? (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                                            <CheckCircle className="size-3" /> Reviewed
                                        </span>
                                    ) : (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                                            <Clock className="size-3" /> Pending Review
                                        </span>
                                    )}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Recorded {item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) : 'recently'}
                                </p>
                            </div>

                            <ul className="space-y-2">
                                {Array.isArray(item.feedback) ? item.feedback.map((f: string, i: number) => (
                                    <li key={i} className="text-sm p-3 rounded-md bg-muted/40 border-r-2 border-emerald-500 text-muted-foreground">
                                        {f}
                                    </li>
                                )) : (
                                    <li className="text-sm p-3 rounded-md bg-muted/40 border-r-2 border-emerald-500 text-muted-foreground">{item.feedback}</li>
                                )}
                            </ul>
                        </div>
                        
                        <div className="shrink-0 w-full md:w-auto">
                            <AIChatModal feedbackData={item} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
