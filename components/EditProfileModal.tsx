"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";

export interface ProfileField {
  key: string;
  label: string;
  type?: string;
}

export function EditProfileModal({
  open,
  onClose,
  title = "Edit profile",
  fields,
  values,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  fields: ProfileField[];
  values: Record<string, string>;
  onSave: (values: Record<string, string>) => void;
}) {
  const [draft, setDraft] = useState(values);

  useEffect(() => {
    if (open) setDraft(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-card border border-border shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <p className="font-medium">{title}</p>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {fields.map((f) => (
                <Field key={f.key} label={f.label} htmlFor={f.key}>
                  <Input
                    id={f.key}
                    type={f.type ?? "text"}
                    value={draft[f.key] ?? ""}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, [f.key]: e.target.value }))
                    }
                  />
                </Field>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onSave(draft);
                  onClose();
                }}
              >
                Save changes
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
