import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const revenue = Number(body.revenue);
    const expenses = Number(body.expenses);
    if (!Number.isFinite(revenue) || !Number.isFinite(expenses) || revenue < 0 || expenses < 0) {
      return NextResponse.json({ error: "Enter valid, non-negative revenue and expense amounts." }, { status: 400 });
    }
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      return NextResponse.json({
        mode: "demo",
        insight: `Your entered monthly revenue is $${revenue.toLocaleString("en-US")} and expenses are $${expenses.toLocaleString("en-US")}. The simple difference is $${(revenue-expenses).toLocaleString("en-US")}. Add OPENAI_API_KEY on the server to enable AI-generated explanations. This difference is not necessarily accounting profit or operating cash flow.`
      });
    }
    const client = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Smart Flow, a careful business-finance explainer. Use only the figures provided. Do not claim this is a full accounting profit calculation. Identify limitations, ask for missing context, and do not give tax, legal, investment, or lending advice. Be concise and practical." },
        { role: "user", content: `Provide a brief plain-language preliminary observation from these user-entered monthly estimates. Revenue: ${revenue}. Expenses: ${expenses}. Simple difference: ${revenue-expenses}. Clearly state that the estimate may omit costs, timing, taxes, debt payments, and accounting adjustments.` }
      ],
      temperature: 0.3,
      max_tokens: 250
    });
    return NextResponse.json({ mode: "openai", insight: completion.choices[0]?.message?.content ?? "No insight returned." });
  } catch {
    return NextResponse.json({ error: "Could not generate an insight. Check the input and server configuration." }, { status: 500 });
  }
}