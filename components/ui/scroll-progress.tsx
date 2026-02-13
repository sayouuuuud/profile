"use client"

import { useEffect, useState } from "react"

export function ScrollProgress() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        function handleScroll() {
            const total = document.documentElement.scrollHeight - window.innerHeight
            const current = window.scrollY
            setProgress(total > 0 ? (current / total) * 100 : 0)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="fixed top-0 right-0 w-[2px] h-full z-50 pointer-events-none">
            <div
                className="w-full bg-emerald-500 transition-all duration-150 ease-out origin-top"
                style={{
                    height: `${progress}%`,
                    boxShadow: "0 0 8px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.2)",
                }}
            />
        </div>
    )
}
