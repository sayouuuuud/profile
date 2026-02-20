import { createClient } from "@/lib/supabase/server";
import { ViewsChart } from "@/components/admin/analytics/views-chart";
import { VisitorStats } from "@/components/admin/analytics/visitors-stats";
import { TopContent } from "@/components/admin/analytics/top-content";

export async function AnalyticsSection() {
    const supabase = await createClient();

    const [
        { data: dailyStats },
        { data: countryStats },
        { data: deviceStats },
        { data: topPages }
    ] = await Promise.all([
        supabase.from("analytics_daily_stats").select("*").limit(30),
        supabase.from("analytics_country_stats").select("*").limit(10),
        supabase.from("analytics_device_stats").select("*"),
        supabase.from("analytics_top_pages").select("*").limit(10)
    ]);

    // Transform data if necessary or pass directly if schema matches
    // dailyStats: { date: string, views_count: number, visitors_count: number }
    // ViewsChart expects: { date: string, views_count: number, visitors_count: number } [] -> Matches

    // countryStats: { country: string, count: number }
    // VisitorStats expects: { country: string, count: number } [] -> Matches

    // deviceStats: { device_type: string, count: number, percentage: number }
    // VisitorStats expects: { device_type: string, count: number, percentage: number } [] -> Matches

    // topPages: { page_path: string, views: number }
    // TopContent expects: { page_path: string, views: number } [] -> Modified component to use page_path

    return (
        <div className="space-y-6">
            <ViewsChart data={dailyStats || []} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <VisitorStats
                        countryData={countryStats || []}
                        deviceData={deviceStats || []}
                    />
                </div>
                <div className="lg:col-span-1">
                    <TopContent initialData={topPages || []} />
                </div>
            </div>
        </div>
    );
}
