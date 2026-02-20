import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/morning-brief/generate
 * 
 * Generates AI-powered daily insights and recommendations.
 * Fetches real analytics data and uses Gemini AI for insights.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date = new Date().toISOString().split('T')[0] } = body;

    const { createClient } = await import('@/lib/supabase/service');
    const supabase = createClient();

    // Fetch real analytics data (last 24h)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString();

    const { count: visits } = await supabase
      .from('analytics_events')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', yesterdayStr);

    const { count: visitors } = await supabase
      .from('analytics_events')
      .select('visitor_id', { count: 'exact', head: true })
      .gte('created_at', yesterdayStr);

    // Get top referrer
    const { data: topReferrers } = await supabase
      .from('analytics_events')
      .select('referrer')
      .gte('created_at', yesterdayStr)
      .not('referrer', 'is', null)
      .limit(100);

    const referrerCounts: Record<string, number> = {};
    topReferrers?.forEach((r: any) => {
      if (r.referrer) {
        referrerCounts[r.referrer] = (referrerCounts[r.referrer] || 0) + 1;
      }
    });
    const topSource = Object.entries(referrerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Direct';

    // Get messages/contact count as conversion proxy
    const { count: messages } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', yesterdayStr);

    const totalVisits = visits || 0;
    const conversionRate = totalVisits > 0 ? ((messages || 0) / totalVisits * 100).toFixed(1) : '0';

    const analyticsData = {
      visits: totalVisits,
      visitors: visitors || 0,
      clicks: 0, // Not tracked separately
      conversion_rate: parseFloat(conversionRate),
      top_source: topSource,
    };

    // Generate AI insights
    const { generateBriefInsights } = await import('@/lib/gemini');
    const aiData = await generateBriefInsights(analyticsData, 'Style: professional');

    // Build response
    const insights = (aiData.insights || []).map((insight: string, i: number) => ({
      id: String(i + 1),
      type: i === 0 ? 'trend' : i === 1 ? 'anomaly' : 'opportunity',
      title: insight.substring(0, 50),
      description: insight,
    }));

    const actions = (aiData.action_items || []).map((action: string, i: number) => ({
      id: String(i + 1),
      priority: i === 0 ? 'high' : 'medium',
      title: action.substring(0, 60),
      description: action,
    }));

    const response = {
      date,
      analytics: analyticsData,
      summary: aiData.summary || 'No summary generated.',
      insights,
      actions,
    };

    // Log usage
    await supabase.from('usage_stats').insert({ category: 'reports', metric: 'generated', value: 1 });
    await supabase.from('activity_logs').insert({
      level: 'success',
      category: 'reports',
      action: 'generate_brief',
      message: `Morning brief generated for ${date}`
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error generating morning brief:', error);
    return NextResponse.json(
      { error: 'Failed to generate morning brief', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
