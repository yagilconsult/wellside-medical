"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CalendarX } from "lucide-react";
import { Input, Field } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function AvailabilityPicker({
  date,
  time,
  appointmentType,
  onDateChange,
  onTimeChange,
}: {
  date: string;
  time: string;
  appointmentType: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}) {
  const [slots, setSlots] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) {
      setSlots(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/availability?date=${date}&type=${encodeURIComponent(appointmentType)}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setSlots(data.slots ?? []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSlots([]);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [date, appointmentType]);

  function formatTime(t: string) {
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
  }

  return (
    <div className="space-y-4">
      <Field label="Date" htmlFor="date" required>
        <Input
          id="date"
          type="date"
          min={todayISO()}
          value={date}
          onChange={(e) => {
            onDateChange(e.target.value);
            onTimeChange("");
          }}
        />
      </Field>

      {date && (
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">
            Available times <span className="text-red-600">*</span>
          </label>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sm text-muted-foreground py-4"
              >
                <Loader2 size={14} className="animate-spin" />
                Checking availability…
              </motion.div>
            ) : slots && slots.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sm text-muted-foreground py-4"
              >
                <CalendarX size={14} />
                No availability that day — try another date.
              </motion.div>
            ) : slots ? (
              <motion.div
                key="slots"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-3 sm:grid-cols-4 gap-2"
              >
                {slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onTimeChange(s)}
                    className={cn(
                      "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                      time === s
                        ? "border-primary bg-accent text-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {formatTime(s)}
                  </button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
