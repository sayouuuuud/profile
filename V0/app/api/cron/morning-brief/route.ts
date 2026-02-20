import { NextRequest, NextResponse } from 'next/server';
import { sendMorningBrief, notifyCronJob } from '@/lib/telegram-bot';

/**
 * GET /api/cron/morning-brief
 * 
 * Scheduled cron job that runs daily to:
 * 1. Fetch analytics data
 * 2. Generate AI insights
 * 3. Create actionable recommendations
 * 4. Send morning brief via Telegram
 * 
 * This should be called daily at a specific time using:
 * - Vercel Cron (Production)
 * - External cron service (Self-hosted)
 * - GitHub Actions (Alternative)
 * 
 * Example Vercel config:
 * {
 *   "crons": [{
 *     "path": "/api/cron/morning-brief",
 *     "schedule": "0 6 * * *"  // 6 AM daily
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from authorized source
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET;

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Mock analytics data (in production, fetch from actual analytics provider)
    const analyticsData = {
      visits: 1243,
      visitsChange: 18,
      visitors: 856,
      conversionRate: '3.2%',
    };

    // Generate morning brief
    // In production, this would call /api/morning-brief/generate
    const briefData = {
      analytics: analyticsData,
      insightCount: 6,
      actionCount: 5,
    };

    // Send to Telegram
    await sendMorningBrief(briefData);

    // Log success
    await notifyCronJob(
      'Morning Brief Generation',
      'success',
      `Generated brief for ${new Date().toDateString()}`
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Morning brief generated and sent successfully',
        timestamp: new Date().toISOString(),
        insightCount: briefData.insightCount,
        actionCount: briefData.actionCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating morning brief:', error);

    // Notify of failure
    try {
      await notifyCronJob(
        'Morning Brief Generation',
        'error',
        error instanceof Error ? error.message : 'Unknown error'
      );
    } catch (notifyError) {
      console.error('Failed to notify of cron failure:', notifyError);
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate morning brief',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cron/morning-brief
 * 
 * For manual triggering (testing/debugging)
 */
export async function POST(request: NextRequest) {
  return GET(request);
}
