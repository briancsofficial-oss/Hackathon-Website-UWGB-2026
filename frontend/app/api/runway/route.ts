import OpenAI from "openai";
import { NextResponse } from "next/server";
import { clampAssumption, DEFAULT_ASSUMPTIONS, HORIZON, projectAll, type Assumptions, type ScenarioKey } from "@/lib/runway";

const num = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const usd = (n: number) => `${n < 0 ? "-" : ""}$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;
const months = (r: number | null) => (r === null ? `more than ${HORIZON} months` : `${r.toFixed(1)} months`);
const KEYS: ScenarioKey[] = ["expected", "cautious", "optimistic"];

export async function POST(request: Request) {
  try {
    const { cash, costs, revenue, history } = await request.json();
    if (!num(cash) || !num(costs) || !num(revenue) || cash < 0 || costs <= 0 || revenue < 0 || cash > 1e10 || costs > 1e10 || revenue > 1e10) {
      return NextResponse.json({ error: "Enter cash on hand of 0 or more and monthly costs above 0." }, { status: 400 });
    }
    const summary = (a: Assumptions) => {
      const p = projectAll(cash, costs, revenue, a);
      return KEYS.map((k) => `${k}: cash lasts ${months(p[k].runout)}`).join("; ");
    };

    if (!process.env.OPENAI_API_KEY) {
      const p = projectAll(cash, costs, revenue, DEFAULT_ASSUMPTIONS);
      const burn = costs - revenue;
      return NextResponse.json({
        mode: "demo", assumptions: DEFAULT_ASSUMPTIONS,
        narrative: burn <= 0
          ? `Revenue of ${usd(revenue)} covers costs of ${usd(costs)}, so cash is not expected to shrink in the expected case. In the cautious case (costs rising and revenue falling 1.5% a month) cash would last ${months(p.cautious.runout)}.`
          : `You are spending ${usd(burn)} more than you bring in each month. In the expected case, ${usd(cash)} lasts ${months(p.expected.runout)}; cautiously ${months(p.cautious.runout)}; optimistically ${months(p.optimistic.runout)}. These use fixed demo assumptions. Add OPENAI_API_KEY on the server to have AI choose the assumptions.`,
        actions: [],
      });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const context = `Cash on hand ${usd(cash)}. Monthly costs ${usd(costs)}. Monthly revenue ${usd(revenue)}.${history ? ` Recent trend from bank statements: monthly revenue averages ${usd(history.revenue)} and monthly costs ${usd(history.costs)}; the last month's revenue vs. the first month's changed ${history.revenueChangePct}% and costs ${history.costsChangePct}%.` : ""}`;

    const a1 = await client.chat.completions.create({
      model: "gpt-4o-mini", temperature: 0.2, max_tokens: 300, response_format: { type: "json_object" },
      messages: [
        { role: "system", content: `You help a small business project cash runway. Given the figures, choose month-over-month percentage changes for three scenarios (expected, cautious, optimistic) for costs and for revenue. Each value must be a number between -5 and 5. Base them only on the figures and trend given; if no trend is given, use modest values. Reply as JSON: {"expected":{"costGrowthPct":n,"revenueGrowthPct":n},"cautious":{...},"optimistic":{...}}` },
        { role: "user", content: context },
      ],
    });
    let raw: Partial<Record<ScenarioKey, { costGrowthPct?: number; revenueGrowthPct?: number }>> = {};
    try { raw = JSON.parse(a1.choices[0]?.message?.content ?? "{}"); } catch {}
    const assumptions = KEYS.reduce((acc, k) => ({ ...acc, [k]: clampAssumption(raw[k], DEFAULT_ASSUMPTIONS[k]) }), {} as Assumptions);

    const a2 = await client.chat.completions.create({
      model: "gpt-4o-mini", temperature: 0.3, max_tokens: 420, response_format: { type: "json_object" },
      messages: [
        { role: "system", content: `You are Smart Flow, a careful small-business cash analyst. Use only the figures provided; never invent numbers. In under 110 words, explain how long the cash lasts under each scenario and what drives the difference. Then give 2 or 3 short, practical actions to extend runway. Do not give tax, legal, investment or lending advice. Say it is a projection from the stated assumptions. Reply as JSON: {"narrative": string, "actions": string[]}` },
        { role: "user", content: `${context} Assumptions per month (cost change %, revenue change %): ${KEYS.map((k) => `${k} ${assumptions[k].costGrowthPct}/${assumptions[k].revenueGrowthPct}`).join("; ")}. Results: ${summary(assumptions)}.` },
      ],
    });
    let out: { narrative?: string; actions?: unknown } = {};
    try { out = JSON.parse(a2.choices[0]?.message?.content ?? "{}"); } catch {}
    const actions = Array.isArray(out.actions) ? out.actions.filter((x): x is string => typeof x === "string").slice(0, 3) : [];
    return NextResponse.json({ mode: "openai", assumptions, narrative: out.narrative ?? "No analysis returned.", actions });
  } catch {
    return NextResponse.json({ error: "Could not generate the projection. Check the server configuration." }, { status: 500 });
  }
}
