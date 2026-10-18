"use client";
import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MAX_STATEMENTS, type StatementMeta } from "@/lib/types";

type Props = {
  files: StatementMeta[];
  busy: boolean;
  notice: string;
  onAdd: (f: File[]) => void;
  onRemove: (name: string) => void;
  onClear: () => void;
  onSample: () => void;
};

export function UploadPanel({
  files,
  busy,
  notice,
  onAdd,
  onRemove,
  onClear,
  onSample,
}: Readonly<Props>) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const full = files.length >= MAX_STATEMENTS;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg">Bank statements</CardTitle>
            <CardDescription>
              Add up to 12 PDF statements, usually one per month. They are read
              in memory and not stored.
            </CardDescription>
          </div>
          <Badge variant={full ? "destructive" : "muted"}>
            {files.length} of {MAX_STATEMENTS} imported
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            if (!full) onAdd(Array.from(e.dataTransfer.files));
          }}
          className={`rounded-3xl border-2 border-dashed p-6 text-center transition-colors ${over ? "border-black bg-[#f3eadc]" : "border-[var(--line)] bg-[#fffdf9]"}`}
        >
          {busy ? (
            <Loader2
              className="mx-auto mb-3 animate-spin"
              size={28}
              aria-hidden
            />
          ) : (
            <Upload className="mx-auto mb-3" size={28} aria-hidden />
          )}
          <p className="font-semibold" aria-live="polite">
            {busy
              ? "Reading statements…"
              : full
                ? "You've reached the 12-statement limit"
                : "Drop PDF statements here"}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button
              onClick={() => input.current?.click()}
              disabled={busy || full}
            >
              Choose PDFs
            </Button>
            <Button variant="outline" onClick={onSample} disabled={busy}>
              Use sample data
            </Button>
            {files.length > 0 && (
              <Button variant="ghost" onClick={onClear} disabled={busy}>
                Clear all
              </Button>
            )}
          </div>
          <input
            ref={input}
            type="file"
            accept="application/pdf,.pdf"
            multiple
            className="sr-only"
            aria-label="Choose PDF bank statements"
            onChange={(e) => {
              onAdd(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        </div>

        {notice && (
          <p
            role="alert"
            className="mt-3 flex items-start gap-2 text-sm text-[#8a2a16]"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
            {notice}
          </p>
        )}

        {/* {files.length > 0 && (
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {files.map((f) => (
              <li
                key={f.name}
                className="flex min-w-0 items-center gap-3 rounded-2xl border border-[var(--line)] bg-[#fffdf9] p-3 text-sm"
              >
                <FileText
                  size={18}
                  className="shrink-0 text-[var(--muted)]"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{f.name}</p>
                  <p
                    className={`truncate text-xs ${f.status === "ok" ? "text-[var(--muted)]" : "text-[#8a2a16]"}`}
                  >
                    {f.status === "ok"
                      ? `${f.count} transactions${f.from ? `, ${f.from} to ${f.to}` : ""}`
                      : f.message}
                  </p>
                </div>
                {f.status === "ok" ? (
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-[#1f5a35]"
                    aria-label="Imported"
                  />
                ) : (
                  <AlertCircle
                    size={18}
                    className="shrink-0 text-[#8a2a16]"
                    aria-label="Problem"
                  />
                )}
                <button
                  onClick={() => onRemove(f.name)}
                  className="rounded-full p-1.5 text-[var(--muted)] hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  aria-label={`Remove ${f.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )} */}
      </CardContent>
    </Card>
  );
}
