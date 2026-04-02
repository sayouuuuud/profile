"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// ══════════════════════════════════════════════════════════
// مكوّن مراقبة سلوك الزائر — يتتبع التمرير والوقت
// يعمل في الخلفية بشكل صامت تماماً
// ══════════════════════════════════════════════════════════

function getOrCreateVisitorId(): string {
    if (typeof window === "undefined") return "";
    let id = localStorage.getItem("_vid");
    if (!id) {
        id = Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem("_vid", id);
    }
    return id;
}

function getOrCreateSessionId(): string {
    if (typeof window === "undefined") return "";
    let id = sessionStorage.getItem("_sid");
    if (!id) {
        id = Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem("_sid", id);
    }
    return id;
}

function getDeviceType(): string {
    if (typeof window === "undefined") return "desktop";
    const ua = navigator.userAgent;
    if (/Mobi|Android/i.test(ua)) return "mobile";
    if (/Tablet|iPad/i.test(ua)) return "tablet";
    return "desktop";
}

export function VisitorTracker() {
    const pathname = usePathname();
    const startTimeRef = useRef<number>(Date.now());
    const maxScrollRef = useRef<number>(0);
    const trackedRef = useRef<boolean>(false);

    useEffect(() => {
        // بداية الجلسة لصفحة جديدة
        startTimeRef.current = Date.now();
        maxScrollRef.current = 0;
        trackedRef.current = false;

        const visitorId = getOrCreateVisitorId();
        const sessionId = getOrCreateSessionId();
        const deviceType = getDeviceType();

        // تتبع التمرير
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                const scrollPct = Math.round((scrollTop / docHeight) * 100);
                if (scrollPct > maxScrollRef.current) {
                    maxScrollRef.current = scrollPct;
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        // إرسال البيانات عند مغادرة الصفحة
        const sendTracking = () => {
            if (trackedRef.current) return;
            trackedRef.current = true;

            const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000);

            // استخدام sendBeacon لضمان الإرسال حتى عند الإغلاق
            const payload = JSON.stringify({
                path: pathname,
                visitor_id: visitorId,
                session_id: sessionId,
                device_type: deviceType,
                user_agent: navigator.userAgent,
                referrer: document.referrer || null,
                scroll_depth: maxScrollRef.current,
                time_on_page: timeOnPage,
            });

            if (navigator.sendBeacon) {
                navigator.sendBeacon("/api/analytics/track", new Blob([payload], { type: "application/json" }));
            } else {
                fetch("/api/analytics/track", {
                    method: "POST",
                    body: payload,
                    headers: { "Content-Type": "application/json" },
                    keepalive: true,
                }).catch(() => {});
            }
        };

        // إرسال عند مغادرة الصفحة
        window.addEventListener("beforeunload", sendTracking);
        // إرسال عند التنقل بين الصفحات (SPA)
        return () => {
            sendTracking();
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("beforeunload", sendTracking);
        };
    }, [pathname]);

    return null; // مكوّن غير مرئي
}
