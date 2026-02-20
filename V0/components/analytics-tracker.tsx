"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const lastTrackedPath = useRef<string | null>(null);

    useEffect(() => {
        const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

        if (pathname?.startsWith('/admin') || pathname?.startsWith('/api')) {
            return;
        }

        if (lastTrackedPath.current === url) return;
        lastTrackedPath.current = url;

        const track = async () => {
            try {
                // Get visitor ID from localStorage or create new one
                let visitorId = localStorage.getItem('visitor_id');
                if (!visitorId) {
                    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    localStorage.setItem('visitor_id', visitorId);
                }

                // Detect device type
                const deviceType = /mobile/i.test(navigator.userAgent) ? 'mobile' :
                    /tablet/i.test(navigator.userAgent) ? 'tablet' : 'desktop';

                const userAgent = navigator.userAgent;

                await fetch("/api/analytics/track", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        path: url,
                        referrer: document.referrer || null,
                        visitor_id: visitorId,
                        device_type: deviceType,
                        user_agent: userAgent
                    }),
                });
            } catch (err) {
                // Silently fail
                console.error("Analytics error", err);
            }
        };

        const timeoutId = setTimeout(track, 500);
        return () => clearTimeout(timeoutId);
    }, [pathname, searchParams]);

    return null;
}
