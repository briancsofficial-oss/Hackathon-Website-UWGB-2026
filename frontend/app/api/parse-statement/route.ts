import { NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";
import { parseStatementText } from "@/lib/parse-statement";
import { MAX_FILE_BYTES } from "@/lib/types";

export const runtime = "nodejs";

// Reads one PDF bank statement in memory and returns parsed transactions. Nothing is written to disk or sent to OpenAI.
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No file received." }, { status: 400 });
    if (file.size > MAX_FILE_BYTES) return NextResponse.json({ error: "File is larger than 10 MB." }, { status: 413 });

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-") return NextResponse.json({ error: "This file is not a valid PDF." }, { status: 400 });

    const pdf = await getDocumentProxy(bytes);
    const { text } = await extractText(pdf, { mergePages: true });
    return NextResponse.json(parseStatementText(text));
  } catch {
    return NextResponse.json({ error: "Could not read this PDF. It may be encrypted or damaged." }, { status: 422 });
  }
}
