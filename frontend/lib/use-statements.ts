"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_FILE_BYTES, MAX_STATEMENTS, type StatementMeta, type Txn } from "./types";
import { sampleData } from "./sample-data";

const KEY = "smartflow:data";
type State = { files: StatementMeta[]; txns: Txn[] };

/** Parsed statements live in sessionStorage only (cleared on sign-out/tab close). Raw PDFs are never stored. */
export function useStatements() {
  const [state, setState] = useState<State>({ files: [], txns: [] });
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const loaded = useRef(false);

  useEffect(() => {
    try { const raw = sessionStorage.getItem(KEY); if (raw) setState(JSON.parse(raw)); } catch {}
    loaded.current = true; setReady(true);
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch { setNotice("Browser storage is full, so this session's data will not survive a refresh."); }
  }, [state]);

  const addFiles = useCallback(async (picked: File[]) => {
    setNotice("");
    const known = new Set(state.files.map((f) => `${f.name}:${f.size}`));
    const problems: string[] = [];
    let room = MAX_STATEMENTS - state.files.length;
    const accepted: File[] = [];
    for (const f of picked) {
      if (!/\.pdf$/i.test(f.name) && f.type !== "application/pdf") problems.push(`${f.name} is not a PDF.`);
      else if (f.size > MAX_FILE_BYTES) problems.push(`${f.name} is larger than 10 MB.`);
      else if (known.has(`${f.name}:${f.size}`)) problems.push(`${f.name} is already imported.`);
      else if (room <= 0) problems.push(`${f.name} was skipped: the limit is ${MAX_STATEMENTS} statements.`);
      else { accepted.push(f); room--; }
    }
    if (problems.length) setNotice(problems.join(" "));
    if (!accepted.length) return;

    setBusy(true);
    for (const file of accepted) {
      const form = new FormData(); form.append("file", file);
      let meta: StatementMeta; let txns: Txn[] = [];
      try {
        const res = await fetch("/api/parse-statement", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not read this PDF.");
        txns = (data.transactions as Omit<Txn, "id" | "source">[]).map((t, i) => ({ ...t, id: `${file.name}-${i}`, source: file.name }));
        meta = { name: file.name, size: file.size, status: txns.length ? "ok" : "empty", count: txns.length, from: data.from, to: data.to, endingBalance: data.endingBalance,
          message: txns.length ? undefined : "No transactions found. Scanned (image-only) PDFs aren't supported yet." };
      } catch (e) {
        meta = { name: file.name, size: file.size, status: "error", count: 0, message: e instanceof Error ? e.message : "Upload failed." };
      }
      setState((s) => ({ files: [...s.files, meta], txns: [...s.txns, ...txns] }));
    }
    setBusy(false);
  }, [state.files]);

  const remove = (name: string) => setState((s) => ({ files: s.files.filter((f) => f.name !== name), txns: s.txns.filter((t) => t.source !== name) }));
  const clear = () => { setState({ files: [], txns: [] }); setNotice(""); };
  const loadSample = () => { setState(sampleData()); setNotice(""); };

  return { ...state, ready, busy, notice, addFiles, remove, clear, loadSample };
}
