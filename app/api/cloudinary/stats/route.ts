import { NextResponse } from "next/server";

export async function GET() {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        return NextResponse.json(
            { error: "Missing Cloudinary credentials" },
            { status: 500 }
        );
    }

    try {
        const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

        // Fetch usage data
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/usage`,
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                },
                next: { revalidate: 3600 } // Cache for 1 hour
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Cloudinary API error:", errorData);
            throw new Error(errorData.error?.message || "Failed to fetch usage data");
        }

        const data = await response.json();

        // Determine Limit and Usage
        // For Free plans, bandwidth limit is often 0. Use Credits as fallback.
        // 1 Credit ~= 1 GB (1,073,741,824 bytes) as per Cloudinary free plan.
        const bandwidthUsage = data.bandwidth?.usage || 0;
        let bandwidthLimit = data.bandwidth?.limit || 0;
        let usedPercent = data.bandwidth?.used_percent || 0;

        const creditsLimit = data.credits?.limit;
        const creditsUsage = data.credits?.usage;

        if (bandwidthLimit === 0 && creditsLimit) {
            // Fallback: Use Credits Limit as proxy
            bandwidthLimit = creditsLimit * 1024 * 1024 * 1024;

            // Recalculate percent based on credits if available
            if (data.credits?.used_percent) {
                usedPercent = data.credits.used_percent;
            }
        }

        return NextResponse.json({
            plan: data.plan,
            last_updated: data.last_updated,
            bandwidth: {
                usage: bandwidthUsage,
                limit: bandwidthLimit,
                used_percent: usedPercent,
                credits_limit: creditsLimit
            },
            storage: {
                usage: data.storage?.usage || 0,
                limit: data.storage?.limit || 0,
                used_percent: data.storage?.used_percent || 0
            },
            credits: data.credits
        });

    } catch (error: any) {
        console.error("Cloudinary stats error:", error);
        // Return mock data if API fails (graceful degradation) or error
        return NextResponse.json(
            { error: error.message || "Failed to fetch Cloudinary stats" },
            { status: 500 }
        );
    }
}
