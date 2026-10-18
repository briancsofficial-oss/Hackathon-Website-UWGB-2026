"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, RotateCcw, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { baseline, money } from "@/lib/analytics";
import { useData } from "@/lib/statements-context";

type Msg = { role: "user" | "assistant"; content: string };
const KEY = "smartflow:interview";
const OPENING: Msg = { role: "assistant", content: "Hi, I'm the Smart Flow interviewer. I'll ask a few questions about your business, one at a time. Estimates are fine, and please don't share account numbers or passwords. To start: what does your business do?" };

export default function InterviewPage() {
  const { txns, files } = useData();
  const base = useMemo(() => baseline(txns, files), [txns, files]);
  const [msgs, setMsgs] = useState<Msg[]>([OPENING]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("");
  const [done, setDone] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { const raw = sessionStorage.getItem(KEY); if (raw) { const s = JSON.parse(raw); setMsgs(s.msgs); setDone(!!s.done); } } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) try { sessionStorage.setItem(KEY, JSON.stringify({ msgs, done })); } catch {} }, [msgs, done, hydrated]);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [msgs, busy]);

  async function send(e: React.SubmitEvent) {
    e.preventDefault();
    const content = text.trim();
    if (!content || busy || done) return;
    const next = [...msgs, { role: "user" as const, content }];
    setMsgs(next); setText(""); setError(""); setBusy(true);
    try {
      const summary = base ? `revenue ${money(base.revenue)}/month, raw materials ${money(base.materials)}/month, other operating expenses ${money(base.otherOpex)}/month, debt payments ${money(base.debt)}/month, cash ${money(base.cash)}` : undefined;
      const res = await fetch("/api/interview", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next, summary }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setMsgs([...next, { role: "assistant", content: data.reply }]); setMode(data.mode); setDone(!!data.done);
    } catch (err) {
      setMsgs(msgs); setText(content);
      setError(err instanceof Error ? err.message : "Could not send. Try again.");
    } finally { setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">AI Interview</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-foreground/80">Answer a few questions about your business. {base ? "The interviewer can also see your statement averages (not your transactions)." : "Import statements on the dashboard to give it more context."}</p>
        </div>
        <div className="flex items-center gap-2">
          {mode && <Badge variant={mode === "openai" ? "default" : "muted"}>{mode === "openai" ? "OpenAI" : "Demo questions"}</Badge>}
          <Button variant="outline" size="sm" onClick={() => { setMsgs([OPENING]); setDone(false); setError(""); setText(""); }} disabled={busy || msgs.length === 1}><RotateCcw size={14} /> Restart</Button>
        </div>
      </div>

      <Card className="overflow-hidden mt-5">
        <div className="max-h-[56vh] min-h-[320px] space-y-3 overflow-y-auto p-5" role="log" aria-live="polite" aria-label="Interview conversation">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : ""}`}>
              <p className={`max-w-[65%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-6 ${m.role === "user" ? "bg-black text-white" : "bg-[#f7b8c9]"}`}>{m.content}</p>
            </div>
          ))}
          {busy && <div className="flex"><p className="flex items-center gap-2 rounded-3xl bg-[#be8940] px-4 py-3 text-sm text-background"><Loader2 size={14} className="animate-spin" /> Thinking…</p></div>}
          <div ref={end} />
        </div>
        <form onSubmit={send} className="border-t border-[var(--line)] p-4">
          {error && <p role="alert" className="mb-2 text-sm font-medium text-[#8a2a16]">{error}</p>}
          {done ? <p className="text-sm text-[var(--muted)]">Interview complete. Restart to answer again.</p> : (
            <div className="flex items-start gap-2">
              <Textarea value={text} onChange={(e) => setText(e.target.value)} aria-label="Your answer" placeholder="Type your answer" className="min-h-12 flex-1 resize-none" rows={2}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }} />
              <Button type="submit" size="icon" disabled={busy || !text.trim()} aria-label="Send answer"><Send size={16} /></Button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
