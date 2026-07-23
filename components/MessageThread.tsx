"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThreadMessage {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
}

export function MessageThread({
  otherPartyName,
  otherPartyInitials,
  messages,
  onSend,
  placeholder = "Type a message…",
}: {
  otherPartyName: string;
  otherPartyInitials: string;
  messages: ThreadMessage[];
  onSend: (text: string) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  }

  return (
    <div className="flex flex-col rounded-lg border border-border overflow-hidden h-[420px]">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-muted">
        <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-medium">
          {otherPartyInitials}
        </div>
        <p className="text-sm font-medium">{otherPartyName}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                  m.from === "me"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                )}
              >
                <p>{m.text}</p>
                <p
                  className={cn(
                    "text-[10px] mt-1",
                    m.from === "me"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {m.time}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-border p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder={placeholder}
          className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={send}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40"
          disabled={!draft.trim()}
          aria-label="Send message"
        >
          <Send size={15} />
        </motion.button>
      </div>
    </div>
  );
}
