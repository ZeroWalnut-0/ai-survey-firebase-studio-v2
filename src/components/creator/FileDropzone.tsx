"use client"

import { useState } from "react"
import { Upload, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileDropzoneProps {
  onFileSelect: (file: File) => void
}

export function FileDropzone({ onFileSelect }: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center gap-4 group",
        isDragOver ? "border-primary bg-primary/10" : "border-muted-foreground/20 hover:border-primary/50",
        selectedFile ? "bg-primary/5 border-primary/40" : ""
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
        isDragOver ? "bg-primary text-white scale-110" : "bg-muted text-muted-foreground"
      )}>
        {selectedFile ? <FileText className="w-6 h-6 text-primary" /> : <Upload className="w-6 h-6" />}
      </div>
      
      <div className="text-center">
        {selectedFile ? (
          <div className="space-y-1">
            <p className="text-sm font-semibold truncate max-w-[200px]">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isDragOver ? "Drop it here!" : "Drag & drop document"}
            </p>
            <p className="text-xs text-muted-foreground">PDF, Word, or HWPX up to 10MB</p>
          </div>
        )}
      </div>

      {selectedFile && (
        <button 
          onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  )
}