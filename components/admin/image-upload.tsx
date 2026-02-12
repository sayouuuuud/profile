"use client"

import { createClient } from "@/lib/supabase/client"
import { Upload, X, Loader2 } from "lucide-react"
import { useState, useRef } from "react"

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

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    setUploading(true)
    setError("")

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath)
      onChange(urlData.publicUrl)
    } catch (err: any) {
      setError(err.message || "Failed to upload image")
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

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        {label}
      </label>
      
      <div className="relative">
        {value ? (
          <div className="relative group">
            <img
              src={value}
              alt="Preview"
              className="w-full h-40 object-cover rounded border border-border"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
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
                {uploading ? "Uploading..." : "Click to upload image"}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground/60">
                PNG, JPG up to 5MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
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
