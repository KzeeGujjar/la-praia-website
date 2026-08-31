"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { business } from "@/data/business";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function ChatWidget() {
  const { t, locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([{ role: "assistant", content: t.chat.greeting }]);
    }
  }, [open, messages.length, t.chat.greeting]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      if (!res.ok || !res.body) throw new Error("Request failed");

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const whatsappHref = `https://wa.me/${business.whatsappE164}`;

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label={t.chat.title}
          className="fixed inset-x-4 bottom-24 z-50 flex h-[min(32rem,70vh)] flex-col overflow-hidden border border-navy/15 bg-sand shadow-2xl sm:inset-x-auto sm:right-4 sm:bottom-24 sm:w-96 md:bottom-6"
        >
          <div className="flex items-center justify-between border-b border-navy/10 bg-navy px-4 py-3">
            <p className="font-display text-sm font-semibold text-sand">{t.chat.title}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.chat.closeLabel}
              className="text-sand/70 transition-colors hover:text-sand"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-terracotta text-sand"
                    : "mr-auto border border-navy/10 bg-white text-ink"
                }`}
              >
                {m.content || (loading && i === messages.length - 1 ? "…" : "")}
              </div>
            ))}
            {error && (
              <p className="mr-auto max-w-[85%] rounded-lg border border-terracotta/30 bg-terracotta/10 px-3 py-2 text-sm text-terracotta-dark">
                {t.chat.errorMessage}
              </p>
            )}
          </div>

          <div className="border-t border-navy/10 bg-sand-dark/40 px-4 py-2">
            <p className="text-[11px] leading-snug text-ink/55">
              {t.chat.disclaimer}{" "}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-terracotta"
              >
                WhatsApp
              </a>
            </p>
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-navy/10 p-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chat.placeholder}
              maxLength={2000}
              lang={locale}
              className="flex-1 border border-navy/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-terracotta"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-terracotta px-3 py-2 text-xs font-semibold uppercase tracking-wide text-sand transition-colors hover:bg-terracotta-dark disabled:opacity-50"
            >
              {t.chat.sendLabel}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.chat.bubbleLabel}
        aria-expanded={open}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-sand shadow-lg transition-transform hover:scale-105 md:bottom-6"
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <ChatIcon className="h-6 w-6" />}
      </button>
    </>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
