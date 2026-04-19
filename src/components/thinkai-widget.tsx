import { useEffect, useRef, useState, useCallback } from "react";
import { MessageCircle, X, Send, Sparkles, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getProductImage, formatPrice, type Product } from "@/lib/products";
import { toast } from "sonner";

type ChatMsg = {
  role: "user" | "assistant";
  content: string;
  products?: Product[];
};

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const SUGGESTED = [
  "Recommend a fit for a summer party",
  "What's your return policy?",
  "Show me trending items",
  "Tell me about sizing",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/thinkai`;

export function ThinkAiWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Yo 👋 I'm **ThinkAi** — your style concierge. Ask me about fits, sizing, returns, or tap the 🎤 mic to speak your vibe!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState<Product[]>([]);

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec && "speechSynthesis" in window) {
      setVoiceSupported(true);
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .then(({ data }) => setCatalog((data as unknown as Product[]) ?? []));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) {
      stopListening();
      stopSpeaking();
    }
  }, [open]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!voiceEnabled || !synthRef.current) return;
      stopSpeaking();
      const clean = text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/#{1,6}\s/g, "")
        .replace(/`(.*?)`/g, "$1")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .replace(/\n+/g, " ")
        .trim();
      if (!clean) return;
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      const voices = synthRef.current.getVoices();
      const preferred = voices.find(
        (v) =>
          v.name.includes("Samantha") ||
          v.name.includes("Google US English") ||
          v.name.includes("Microsoft Aria") ||
          (v.lang === "en-US" && !v.name.includes("Zira")),
      );
      if (preferred) utterance.voice = preferred;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    },
    [voiceEnabled, stopSpeaking],
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setTranscript("");
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      if (trimmed.length > 2000) {
        toast.error("Message too long (max 2000 chars).");
        return;
      }
      setInput("");
      const userMsg: ChatMsg = { role: "user", content: trimmed };
      setMessages((p) => [...p, userMsg]);
      setLoading(true);

      let assistant = "";
      let toolCallSlugs: string[] | null = null;
      let toolReason = "";
      const toolBuf: Record<number, { name: string; args: string }> = {};

      const upsertAssistant = (chunk: string, products?: Product[]) => {
        assistant += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (
            last?.role === "assistant" &&
            last !== userMsg &&
            prev.length > 1 &&
            prev.indexOf(last) > prev.indexOf(userMsg)
          ) {
            return prev.map((m, i) =>
              i === prev.length - 1
                ? { ...m, content: assistant, products: products ?? m.products }
                : m,
            );
          }
          return [...prev, { role: "assistant", content: assistant, products }];
        });
      };

      try {
        const apiMessages = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: apiMessages, productCatalog: catalog }),
        });

        if (!resp.ok || !resp.body) {
          if (resp.status === 429) toast.error("Rate limit hit. Hold up a sec and retry.");
          else if (resp.status === 402) toast.error("Out of AI credits.");
          else toast.error("ThinkAi couldn't reply. Try again.");
          setLoading(false);
          return;
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        let done = false;

        while (!done) {
          const { done: d, value } = await reader.read();
          if (d) break;
          buf += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buf.indexOf("\n")) !== -1) {
            let line = buf.slice(0, nl);
            buf = buf.slice(nl + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") { done = true; break; }
            try {
              const parsed = JSON.parse(json);
              const delta = parsed.choices?.[0]?.delta;
              if (delta?.content) upsertAssistant(delta.content);
              if (delta?.tool_calls) {
                for (const tc of delta.tool_calls) {
                  const idx = tc.index ?? 0;
                  if (!toolBuf[idx]) toolBuf[idx] = { name: "", args: "" };
                  if (tc.function?.name) toolBuf[idx].name = tc.function.name;
                  if (tc.function?.arguments) toolBuf[idx].args += tc.function.arguments;
                }
              }
            } catch {
              buf = line + "\n" + buf;
              break;
            }
          }
        }

        for (const k of Object.keys(toolBuf)) {
          const tc = toolBuf[Number(k)];
          if (tc.name === "recommend_products") {
            try {
              const args = JSON.parse(tc.args);
              toolCallSlugs = args.slugs;
              toolReason = args.reason;
            } catch { /* ignore */ }
          }
          if (tc.name === "lookup_order") {
            try {
              const args = JSON.parse(tc.args);
              const id: string = args.order_id;
              const { data: orders } = await supabase
                .from("orders")
                .select("id, status, total_cents, created_at")
                .ilike("id", `${id.toLowerCase()}%`)
                .limit(1);
              const o = orders?.[0];
              if (o) {
                upsertAssistant(
                  `\n\n📦 Order **${o.id.slice(0, 8)}** — status: **${o.status}**, total ${formatPrice(o.total_cents)}, placed ${new Date(o.created_at).toLocaleDateString()}.`,
                );
              } else {
                upsertAssistant(`\n\nI couldn't find an order matching **${id}** in your account.`);
              }
            } catch { /* ignore */ }
          }
        }

        if (toolCallSlugs && toolCallSlugs.length > 0) {
          const recs = catalog.filter((p) => toolCallSlugs!.includes(p.slug));
          if (recs.length > 0) {
            if (!assistant.trim()) upsertAssistant(toolReason || "Here's what I'd pick for you:");
            setMessages((prev) =>
              prev.map((m, i) =>
                i === prev.length - 1 && m.role === "assistant" ? { ...m, products: recs } : m,
              ),
            );
          }
        }

        if (assistant.trim()) speak(assistant);
      } catch (e) {
        console.error(e);
        toast.error("Network hiccup. Retry?");
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, catalog, speak],
  );

  const startListening = useCallback(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec || loading) return;
    stopSpeaking();
    const recognition = new SpeechRec();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => { setIsListening(true); setTranscript(""); };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      const display = final || interim;
      setTranscript(display);
      if (final) setInput(final);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      setTranscript("");
      setInput((current) => {
        if (current.trim()) {
          setTimeout(() => sendMessage(current), 50);
          return "";
        }
        return current;
      });
    };

    recognition.onerror = (event) => {
      if (event.error !== "no-speech" && event.error !== "aborted") {
        toast.error(`Mic error: ${event.error}. Check browser permissions.`);
      }
      setIsListening(false);
      setTranscript("");
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [loading, stopSpeaking, sendMessage]);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  const send = (text: string) => sendMessage(text);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-neon text-ink shadow-lg ring-2 ring-ink animate-pulse-glow hover:scale-105 transition"
        aria-label="Open ThinkAi chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-2 left-2 sm:left-auto sm:right-4 z-50 flex h-[72vh] max-h-[640px] w-auto sm:w-[390px] flex-col overflow-hidden rounded-2xl border-2 border-ink bg-bone shadow-2xl">

          {/* Header */}
          <div className="flex items-center gap-2 border-b-2 border-ink bg-ink px-4 py-3 text-bone">
            <Sparkles className="h-5 w-5 text-neon" />
            <div className="flex-1">
              <div className="font-display text-base">ThinkAi</div>
              <div className="text-[10px] uppercase tracking-wider text-bone/60">
                {isListening
                  ? "🔴 Listening…"
                  : isSpeaking
                  ? "🔊 Speaking…"
                  : "Your style concierge · Voice ready"}
              </div>
            </div>
            {voiceSupported && (
              <button
                onClick={() => { setVoiceEnabled((v) => !v); if (isSpeaking) stopSpeaking(); }}
                className="rounded-md p-1.5 hover:bg-white/10 transition"
                title={voiceEnabled ? "Mute AI voice" : "Unmute AI voice"}
              >
                {voiceEnabled ? (
                  <Volume2 className="h-4 w-4 text-neon" />
                ) : (
                  <VolumeX className="h-4 w-4 text-bone/40" />
                )}
              </button>
            )}
            <span className="flex h-2 w-2 rounded-full bg-neon" />
          </div>

          {/* Listening indicator */}
          {isListening && (
            <div className="flex items-center gap-3 border-b border-magenta/20 bg-magenta/10 px-4 py-2">
              <div className="flex items-end gap-0.5 h-5">
                {[6, 12, 8, 14, 6].map((h, i) => (
                  <span
                    key={i}
                    className="inline-block w-1 rounded-full bg-magenta animate-bounce"
                    style={{ height: `${h}px`, animationDelay: `${i * 70}ms` }}
                  />
                ))}
              </div>
              <span className="flex-1 text-xs font-semibold text-magenta truncate">
                {transcript || "Speak now…"}
              </span>
              <button onClick={stopListening} className="text-[10px] text-magenta/70 hover:text-magenta">
                cancel
              </button>
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[86%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-ink text-bone rounded-br-sm"
                      : "bg-card border-2 border-ink rounded-bl-sm"
                  }`}
                >
                  <div className="chat-md">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                  {m.products && m.products.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {m.products.map((p) => (
                        <Link
                          key={p.id}
                          to="/product/$id"
                          params={{ id: p.id }}
                          onClick={() => setOpen(false)}
                          className="block overflow-hidden rounded-lg border-2 border-ink bg-bone hover:scale-[1.02] transition"
                        >
                          <img
                            src={getProductImage(p.image_url)}
                            alt={p.name}
                            className="aspect-square w-full object-cover"
                            loading="lazy"
                          />
                          <div className="p-1.5">
                            <div className="line-clamp-1 text-[11px] font-bold uppercase">{p.name}</div>
                            <div className="text-[11px]">{formatPrice(p.price_cents)}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border-2 border-ink bg-card px-3 py-2 text-sm">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink [animation-delay:240ms]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Suggested prompts */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-1.5 border-t border-ink/10 bg-bone px-3 pt-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-ink/30 bg-card px-2.5 py-1 text-[11px] hover:bg-neon transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 border-t-2 border-ink bg-bone p-2"
          >
            {voiceSupported && (
              <button
                type="button"
                onClick={toggleListening}
                disabled={loading}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ring-2 transition disabled:opacity-40 ${
                  isListening
                    ? "animate-pulse bg-magenta text-bone ring-magenta"
                    : "bg-bone text-ink ring-ink hover:bg-magenta/10"
                }`}
                aria-label={isListening ? "Stop listening" : "Start voice input"}
                title={isListening ? "Tap to stop" : "Tap to speak"}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            )}

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening…" : voiceSupported ? "Type or tap 🎤 to speak" : "Ask ThinkAi…"}
              maxLength={2000}
              className="flex-1 rounded-md border-2 border-ink bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-magenta"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-neon text-ink ring-2 ring-ink disabled:opacity-50 transition hover:scale-105"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          {voiceSupported && (
            <p className="bg-bone pb-2 text-center text-[10px] text-ink/40">
              🎤 mic = speak to chat &nbsp;·&nbsp; 🔊 = toggle AI voice reply
            </p>
          )}
        </div>
      )}
    </>
  );
}
