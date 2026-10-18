import OpenAI from "openai";
import { NextResponse } from "next/server";

type Scenario = { revenue: number; materials: number; net: number; endCash: number };
const num = (v: unknown) => typeof v === "number" && Number.isFinite(v);
const usd = (n: number) => `${n < 0 ? "-" : ""}$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;
const valid = (s: Scenario) => s && num(s.revenue) && num(s.materials) && num(s.net) && num(s.endCash);

export async function POST(request: Request) {
  try {
    const { base, scenario, adj, otherOpex, debt } = await request.json();
    if (!valid(base) || !valid(scenario) || !num(adj?.revenuePct) || !num(adj?.materialsPct) || !num(otherOpex) || !num(debt)) {
      return NextResponse.json({ error: "Invalid scenario values." }, { status: 400 });
    }
    const delta = scenario.net - base.net;
    const facts = `Average monthly figures from the user's imported bank statements (3-month window). Baseline: revenue ${usd(base.revenue)}, raw materials ${usd(base.materials)}, other operating expenses ${usd(otherOpex)}, debt payments ${usd(debt)}, net cash flow ${usd(base.net)}/month, projected cash after 3 months ${usd(base.endCash)}. Scenario: revenue ${adj.revenuePct >= 0 ? "+" : ""}${adj.revenuePct}%, raw-material cost ${adj.materialsPct >= 0 ? "+" : ""}${adj.materialsPct}%. Result: revenue ${usd(scenario.revenue)}, raw materials ${usd(scenario.materials)}, net cash flow ${usd(scenario.net)}/month (${delta >= 0 ? "+" : ""}${usd(delta)} vs baseline), projected cash after 3 months ${usd(scenario.endCash)}.`;

    if (!process.env.OPENAI_API_KEY) {
      const dir = delta > 0 ? "improves" : delta < 0 ? "reduces" : "does not change";
      return NextResponse.json({
        mode: "demo",
        insight: `This scenario ${dir} monthly net cash flow by ${usd(Math.abs(delta))}, to ${usd(scenario.net)} per month. Over three months, cash would reach about ${usd(scenario.endCash)} versus ${usd(base.endCash)} at baseline.${scenario.net < 0 ? " Net cash flow is negative in this scenario, so cash would shrink every month." : ""} This is a straight-line projection from recent averages and ignores seasonality, timing of invoices and taxes. Add OPENAI_API_KEY on the server for a written analysis.`,
      });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 350,
      messages: [
        { role: "system", content: "You are Smart Flow, a careful small-business cash-flow analyst. Use only the figures provided and never invent numbers. In under 150 words, explain the financial impact of the what-if scenario in plain language: what changed, how much cash flow moved, the runway/risk implication, and one or two practical things to examine (for example supplier pricing, pass-through to customers, or timing). State that this is a simple projection from recent averages. Do not give tax, legal, investment or lending advice." },
        { role: "user", content: facts },
      ],
    });
    return NextResponse.json({ mode: "openai", insight: completion.choices[0]?.message?.content ?? "No analysis returned." });
  } catch {
    return NextResponse.json({ error: "Could not generate the analysis. Check the server configuration." }, { status: 500 });
  }
}
