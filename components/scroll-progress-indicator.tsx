"use client"

import { useEffect, useState } from "react"

export function ScrollProgressIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-40 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-emerald to-emerald/50 transition-all duration-300 ease-out shadow-lg shadow-emerald/50"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}
