"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const lastTrackedPath = useRef<string | null>(null);

    useEffect(() => {
        const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

        // Prevent double firing in short succession if strict mode is on 
        // or if search params change but we only care about path mostly
        // But analytics usually wants full URL.

        if (lastTrackedPath.current === url) return;
        lastTrackedPath.current = url;

        // Fire and forget
        const track = async () => {
            try {
                await fetch("/api/analytics/track", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        path: url,
                        referrer: document.referrer,
                    }),
                });
            } catch (err) {
                // Silently fail
                console.error("Analytics error", err);
            }
        };

        // Small timeout to ensure hydration/navigation complete
        const timeoutId = setTimeout(track, 500);

        return () => clearTimeout(timeoutId);
    }, [pathname, searchParams]);

    return null;
}
