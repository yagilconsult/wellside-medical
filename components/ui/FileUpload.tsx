"use client";

import { useRef, useState, DragEvent } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileImage, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function FileUpload({
  id,
  label,
  optional,
}: {
  id: string;
  label: string;
  optional?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (files && files[0]) {
      setFileName(files[0].name);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-muted-foreground">
        {label}
        {optional && (
          <span className="text-muted-foreground/60 ml-1 text-xs">(optional)</span>
        )}
      </label>

      <motion.div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        animate={{
          borderColor: isDragging ? "hsl(var(--primary))" : "hsl(var(--border))",
          backgroundColor: isDragging ? "hsl(var(--accent))" : "hsl(var(--muted))",
        }}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed px-4 py-5 flex flex-col items-center justify-center text-center gap-1.5 transition-colors"
        )}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*,.pdf"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {fileName ? (
          <>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-primary">
              <FileImage size={16} />
            </div>
            <p className="text-xs font-medium text-foreground truncate max-w-full px-2">
              {fileName}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFileName(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-background text-muted-foreground hover:text-foreground"
              aria-label={`Remove ${label}`}
            >
              <X size={11} />
            </button>
          </>
        ) : (
          <>
            <motion.div
              animate={{ y: isDragging ? -3 : 0 }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-primary"
            >
              <UploadCloud size={16} />
            </motion.div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary font-medium">Upload a file</span>{" "}
              or drag & drop
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              PNG, JPG, or PDF
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
