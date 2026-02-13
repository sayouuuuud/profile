"use client"

import { createClient } from "@/lib/supabase/client"
import { Upload, X, Loader2, Play } from "lucide-react"
import { useState, useRef } from "react"
import { VideoModal } from "@/components/ui/video-modal"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label: string
  bucket?: string
}

export function ImageUpload({ value, onChange, label, bucket = "images" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setError("Please select an image or video file")
      return
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      setError("File must be less than 100MB")
      return
    }

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "portfolio_unsigned")
      formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "")

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message || "Upload failed")
      }

      onChange(data.secure_url)
    } catch (err: any) {
      setError(err.message || "Failed to upload file")
    } finally {
      setUploading(false)
    }
  }

  function handleRemove() {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Determine file type from URL or leave ambiguous
  const isVideo = value?.match(/\.(mp4|webm|mov)$/i) || value?.includes("/video/upload/");

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        {label}
      </label>

      <div className="relative">
        {value ? (
          <div className="relative group">
            {isVideo ? (
              <VideoModal
                videoUrl={value}
                trigger={
                  <div className="w-full aspect-video bg-black rounded border border-border flex items-center justify-center cursor-pointer group/video overflow-hidden relative">
                    {/* Grid Background */}
                    <div className="absolute inset-0 opacity-20"
                      style={{ backgroundImage: "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)", backgroundSize: "20px 20px" }}
                    />

                    {/* Video Element (Muted/Loop for preview) */}
                    <video src={value} className="absolute inset-0 w-full h-full object-cover opacity-50" muted loop playsInline onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()} />

                    {/* Play Button Overlay */}
                    <div className="relative z-10 size-12 rounded-full bg-[#10b981]/10 border border-[#10b981] flex items-center justify-center backdrop-blur-sm group-hover/video:scale-110 transition-transform">
                      <Play className="size-5 text-[#10b981] ml-0.5" />
                    </div>

                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 border border-[#10b981]/30 rounded text-[9px] font-mono text-[#10b981]">
                      PREVIEW TRANSMISSION
                    </div>
                  </div>
                }
              />
            ) : (
              <img
                src={value}
                alt="Preview"
                className="w-full h-40 object-cover rounded border border-border"
              />
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded cursor-pointer bg-background hover:bg-surface-dark/30 transition-colors">
            <div className="flex flex-col items-center justify-center gap-2">
              {uploading ? (
                <Loader2 className="size-8 text-primary animate-spin" />
              ) : (
                <Upload className="size-8 text-muted-foreground" />
              )}
              <p className="text-xs font-mono text-muted-foreground">
                {uploading ? "Uploading..." : "Click to upload"}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground/60">
                Images or Video up to 100MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {error && (
        <p className="text-xs font-mono text-red-400">{error}</p>
      )}
    </div>
  )
}
