"use client"

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Play, Pause, Maximize2, X, Activity, Volume2, VolumeX, Minimize2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface VideoModalProps {
    videoUrl: string
    trigger?: React.ReactNode
}

export function VideoModal({ videoUrl, trigger }: VideoModalProps) {
    const [open, setOpen] = useState(false)

    // Determine if it's a YouTube URL to use iframe or direct video
    const isYoutube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")

    // Video State
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const controlsTimeoutRef = useRef<NodeJS.Timeout>(null)

    // Handle Video Events
    const togglePlay = () => {
        if (!videoRef.current) return
        if (isPlaying) {
            videoRef.current.pause()
        } else {
            videoRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleTimeUpdate = () => {
        if (!videoRef.current) return
        const current = videoRef.current.currentTime
        const total = videoRef.current.duration
        setProgress((current / total) * 100)
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current) return
        const seekTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration
        videoRef.current.currentTime = seekTime
        setProgress(parseFloat(e.target.value))
    }

    const toggleMute = () => {
        if (!videoRef.current) return
        videoRef.current.muted = !isMuted
        setIsMuted(!isMuted)
    }

    const toggleFullscreen = () => {
        if (!containerRef.current) return
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    // Update isFullscreen state when browser triggers change (e.g. Esc key)
    useEffect(() => {
        const handleFsChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleFsChange)
        return () => document.removeEventListener('fullscreenchange', handleFsChange)
    }, [])

    // Auto-hide controls
    const handleMouseMove = () => {
        setShowControls(true)
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000)
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val) setIsPlaying(false) // Stop playing when closed
        }}>
            <DialogTrigger asChild>
                {trigger || (
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-full font-bold transition-colors">
                        <Play className="size-4 fill-black" />
                        WATCH DEMO
                    </button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-5xl p-0 bg-black border border-[#1f2937] overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col gap-0">
                {/* Custom Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f2937] bg-black z-20 relative shrink-0">
                    <div className="flex items-center gap-3">
                        <Activity className="size-4 text-[#10b981] animate-pulse" />
                        <DialogTitle className="text-xs font-mono font-bold text-[#10b981] tracking-[0.2em] uppercase m-0">
                            Incoming Transmission
                        </DialogTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-ping" />
                        <span className="text-[10px] font-mono text-[#6b7280]">LIVE FEED</span>
                    </div>
                </div>

                {/* Video Container */}
                <div
                    ref={containerRef}
                    className="relative aspect-video w-full bg-black group overflow-hidden flex flex-col justify-center"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setShowControls(false)}
                >
                    {/* CRT/Scanline Overlay */}
                    <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.05]"
                        style={{ backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))", backgroundSize: "100% 2px, 3px 100%" }}
                    />

                    {open && (
                        isYoutube ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={videoUrl.replace("watch?v=", "embed/") + "?autoplay=1&modestbranding=1&rel=0"}
                                title="Video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full relative z-0 block"
                            />
                        ) : (
                            <>
                                <video
                                    ref={videoRef}
                                    src={videoUrl}
                                    className="w-full h-full relative z-0 object-contain block"
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                                    onEnded={() => setIsPlaying(false)}
                                    onClick={togglePlay}
                                    autoPlay
                                    onPlay={() => setIsPlaying(true)}
                                />

                                {/* Custom Controls Overlay */}
                                <div className={cn(
                                    "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 pb-4 pt-10 z-20 transition-opacity duration-300 flex flex-col gap-2",
                                    showControls ? "opacity-100" : "opacity-0"
                                )}>
                                    {/* Progress Bar */}
                                    <div className="group/progress relative h-1 hover:h-2 bg-gray-800 rounded-full cursor-pointer transition-all">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-[#10b981] rounded-full relative"
                                            style={{ width: `${progress}%` }}
                                        >
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-1.5 size-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={progress}
                                            onChange={handleSeek}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>

                                    {/* Buttons Row */}
                                    <div className="flex items-center justify-between font-mono text-xs">
                                        <div className="flex items-center gap-4">
                                            <button onClick={togglePlay} className="text-white hover:text-[#10b981] transition-colors">
                                                {isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
                                            </button>

                                            <button onClick={toggleMute} className="text-white hover:text-[#10b981] transition-colors group/vol">
                                                {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                                            </button>

                                            <span className="text-[#6b7280] tracking-wider">
                                                {formatTime(videoRef.current?.currentTime || 0)} <span className="text-gray-600">/</span> {formatTime(duration || 0)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#10b981]/10 rounded border border-[#10b981]/20">
                                                <div className="size-1.5 rounded-full bg-[#10b981] animate-pulse" />
                                                <span className="text-[#10b981] text-[10px] font-bold">HD</span>
                                            </div>
                                            <button onClick={toggleFullscreen} className="text-white hover:text-[#10b981] transition-colors">
                                                {isFullscreen ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    )}
                </div>

                {/* Footer Status Bar */}
                <div className="px-4 py-2 bg-black flex items-center justify-between z-20 relative shrink-0">
                    <div className="text-[10px] font-mono text-[#6b7280]">
                        <span className="text-[#10b981]">SECURE CONNECTION</span> // ENCRYPTED
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`w-1 h-2 bg-[#10b981] opacity-${i * 20}`} />
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
