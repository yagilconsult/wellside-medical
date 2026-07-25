"use client";

import { useRef, useState, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileImage, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "uploading" | "success" | "error";

export function FileUpload({
  id,
  label,
  optional,
  existingUrl,
  onUploadComplete,
}: {
  id: string;
  label: string;
  optional?: boolean;
  existingUrl?: string;
  onUploadComplete?: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(existingUrl ?? null);
  const [status, setStatus] = useState<Status>(existingUrl ? "success" : "idle");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  async function upload(file: File) {
    setFileName(file.name);
    setStatus("uploading");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("label", id);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data.error ?? "Upload failed. Please try again.");
        return;
      }

      setUrl(data.url);
      setStatus("success");
      onUploadComplete?.(data.url);
    } catch {
      setStatus("error");
      setError("Upload failed. Check your connection and try again.");
    }
  }

  function handleFiles(files: FileList | null) {
    if (files && files[0]) {
      upload(files[0]);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    setFileName(null);
    setUrl(null);
    setStatus("idle");
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
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
        onClick={() => status !== "uploading" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (status !== "uploading") setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={status !== "uploading" ? onDrop : undefined}
        whileHover={status !== "uploading" ? { y: -2 } : {}}
        whileTap={status !== "uploading" ? { scale: 0.98 } : {}}
        animate={{
          borderColor:
            status === "error"
              ? "hsl(0 72% 51%)"
              : isDragging
              ? "hsl(var(--primary))"
              : "hsl(var(--border))",
          backgroundColor: isDragging ? "hsl(var(--accent))" : "hsl(var(--muted))",
        }}
        className={cn(
          "relative rounded-lg border-2 border-dashed px-4 py-5 flex flex-col items-center justify-center text-center gap-1.5 transition-colors",
          status === "uploading" ? "cursor-wait" : "cursor-pointer"
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

        <AnimatePresence mode="wait">
          {status === "uploading" && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-primary">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <p className="text-xs text-muted-foreground">Uploading…</p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-primary">
                {url && /\.(jpe?g|png|webp|heic)$/i.test(url) ? (
                  <FileImage size={16} />
                ) : (
                  <CheckCircle2 size={16} />
                )}
              </div>
              <p className="text-xs font-medium text-foreground truncate max-w-full px-2">
                {fileName ?? "Uploaded"}
              </p>
              <p className="flex items-center gap-1 text-[11px] text-primary">
                <CheckCircle2 size={11} /> Saved
              </p>
              <button
                type="button"
                onClick={clear}
                className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-background text-muted-foreground hover:text-foreground"
                aria-label={`Remove ${label}`}
              >
                <X size={11} />
              </button>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                <AlertCircle size={16} />
              </div>
              <p className="text-xs text-red-600 px-2">{error}</p>
              <p className="text-[11px] text-primary font-medium">Tap to try again</p>
            </motion.div>
          )}

          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1.5"
            >
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
              <p className="text-[11px] text-muted-foreground/70">PNG, JPG, or PDF</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
