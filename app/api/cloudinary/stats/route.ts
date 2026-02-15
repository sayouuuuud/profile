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

        return NextResponse.json({
            plan: data.plan,
            last_updated: data.last_updated,
            bandwidth: {
                usage: data.bandwidth?.usage || 0,
                limit: data.bandwidth?.limit || 0,
                used_percent: data.bandwidth?.used_percent || 0,
                credits_limit: data.credits?.limit // Sometimes relevant for free plans
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
