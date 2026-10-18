"use client";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  forecast,
  money,
  NO_ADJ,
  type Adjustments,
  type Baseline,
} from "@/lib/analytics";
import { COLORS } from "@/lib/categorize";

const HORIZON = 6;
const tip = {
  borderRadius: 12,
  border: "1px solid #dfd6cb",
  background: "#fffaf4",
};

export function WhatIf({ base }: { base: Baseline }) {
  const [adj, setAdj] = useState<Adjustments>(NO_ADJ);
  const [insight, setInsight] = useState<{ text: string; mode: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);

  const baseline = useMemo(() => forecast(base, NO_ADJ, HORIZON), [base]);
  const scenario = useMemo(() => forecast(base, adj, HORIZON), [base, adj]);
  const delta = scenario.net - baseline.net;
  const changed =
    adj.revenueDropPct > 0 || adj.materialsRisePct > 0 || adj.unexpected > 0;
  const chart = scenario.path.map((p, i) => ({
    month: i === 0 ? "Now" : `Month ${i}`,
    baseline: baseline.path[i].cash,
    scenario: p.cash,
  }));
  const update = (patch: Partial<Adjustments>) => {
    setAdj((a) => ({ ...a, ...patch }));
    setInsight(null);
  };

  async function explain() {
    setBusy(true);
    try {
      const pick = (f: typeof baseline) => ({
        revenue: f.revenue,
        materials: f.materials,
        net: f.net,
        endCash: f.endCash,
      });
      const res = await fetch("/api/whatif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base: pick(baseline),
          scenario: pick(scenario),
          adj,
          otherOpex: base.otherOpex,
          debt: base.debt,
          startCash: base.cash,
          horizon: HORIZON,
        }),
      });
      const data = await res.json();
      setInsight({
        text: data.insight ?? data.error ?? "No analysis available.",
        mode: data.mode ?? "",
      });
    } catch {
      setInsight({
        text: "Could not reach the analysis service. The numbers above still update.",
        mode: "",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Adjust the scenario</CardTitle>
        <CardDescription>
          Starting from your last {base.months} month
          {base.months > 1 ? "s" : ""} of average figures. Results update as you
          move the sliders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div className="space-y-7">
            <div>
              <div className="flex items-baseline justify-between">
                <Label htmlFor="rev">Revenue reduction</Label>
                <span className="text-sm font-bold tabular-nums">
                  {adj.revenueDropPct > 0 ? `-${adj.revenueDropPct}%` : "0%"}
                </span>
              </div>
              <Slider
                id="rev"
                min={0}
                max={30}
                step={1}
                value={[adj.revenueDropPct]}
                onValueChange={(value) => {
                  const v = Array.isArray(value) ? value[0] : value;
                  update({ revenueDropPct: v });
                }}
                aria-label="Revenue reduction in percent"
              />
              <p className="mt-2 text-xs text-foreground/65">
                Range 0 to 30%. {money(base.revenue)} per month becomes{" "}
                {money(scenario.revenue)}.
              </p>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <Label htmlFor="mat">Raw-material cost increase</Label>
                <span className="text-sm font-bold tabular-nums">
                  {adj.materialsRisePct > 0
                    ? `+${adj.materialsRisePct}%`
                    : "0%"}
                </span>
              </div>
              <Slider
                id="mat"
                min={0}
                max={40}
                step={1}
                value={[adj.materialsRisePct]}
                onValueChange={(value) => {
                  const v = Array.isArray(value) ? value[0] : value;
                  update({ materialsRisePct: v });
                }}
                aria-label="Raw-material cost increase in percent"
              />
              <p className="mt-2 text-xs text-foreground/65">
                {base.materials > 0
                  ? `Range 0 to 40%. ${money(base.materials)} per month becomes ${money(scenario.materials)}.`
                  : "No raw-material spending was detected in your statements, so this slider has no effect yet."}
              </p>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <Label htmlFor="unx">Unexpected expenses</Label>
                <span className="text-sm font-bold tabular-nums">
                  {money(adj.unexpected)}
                </span>
              </div>
              <Slider
                id="unx"
                min={0}
                max={40000}
                step={500}
                value={[adj.unexpected]}
                onValueChange={(value) => {
                  const v = Array.isArray(value) ? value[0] : value;
                  update({ unexpected: v });
                }}
                aria-label="Unexpected one-time expenses in dollars"
              />
              <p className="mt-2 text-xs text-foreground/65">
                Range $0 to $40,000. Treated as a one-time cost in month 1.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAdj(NO_ADJ);
                  setInsight(null);
                }}
                disabled={!changed}
              >
                <RotateCcw size={14} /> Reset
              </Button>
              <Button size="sm" onClick={explain} disabled={busy || !changed}>
                {busy ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}{" "}
                Explain with AI
              </Button>
            </div>
          </div>

          <div>
            <div className="grid gap-3 sm:grid-cols-3" aria-live="polite">
              <div className="rounded-2xl shadow-md p-4">
                <p className="text-xs">Net cash flow per month</p>
                <p
                  className={`mt-1 text-xl font-semibold ${scenario.net < 0 ? "text-red-500" : "text-foreground"}`}
                >
                  {money(scenario.net)}
                </p>
                <p
                  className={`mt-1 text-xs font-medium ${delta === 0 ? "text-foreground" : delta > 0 ? "text-green-600" : "text-red-500"}`}
                >
                  {delta === 0
                    ? "Same as baseline"
                    : `${delta > 0 ? "+" : "-"}${money(Math.abs(delta))} vs baseline`}
                </p>
              </div>
              <div className="rounded-2xl shadow-md p-4">
                <p className="text-xs text-foreground">
                  Cash after {HORIZON} months
                </p>
                <p
                  className={`mt-1 text-xl font-semibold ${scenario.endCash < 0 ? "text-bad" : "text-foreground"}`}
                >
                  {money(scenario.endCash)}
                </p>
                <p className="mt-1 text-xs text-foreground/65">
                  Baseline {money(baseline.endCash)}
                </p>
              </div>
              <div className="rounded-2xl shadow-md p-4">
                <p className="text-xs">Cash runs out</p>
                <p
                  className={`mt-1 text-xl font-semibold ${scenario.runsOutInMonth ? "text-bad" : "text-foreground"}`}
                >
                  {scenario.runsOutInMonth
                    ? `Month ${scenario.runsOutInMonth}`
                    : `Not within ${HORIZON} months`}
                </p>
                <p className="mt-1 text-xs text-foreground/65">
                  Baseline:{" "}
                  {baseline.runsOutInMonth
                    ? `month ${baseline.runsOutInMonth}`
                    : "no shortfall"}
                </p>
              </div>
            </div>
            <div className="mt-4 h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chart}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="#e4dbd0"
                    strokeDasharray="4 4"
                    vertical={false}
                  />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  {/* <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => money(v, true)}
                    width={60}
                    domain={["auto", "auto"]}
                  /> */}
                  <Tooltip
                    // 1. Remove explicit inline types to let Recharts handle inference natively
                    formatter={(v, n) => {
                      const numericValue =
                        typeof v === "number" ? v : Number(v);
                      const nameString = String(n);

                      return [
                        money(numericValue),
                        nameString === "baseline"
                          ? "Baseline cash"
                          : "Scenario cash",
                      ];
                    }}
                    contentStyle={tip}
                  />
                  <ReferenceLine
                    y={0}
                    stroke={COLORS[0]}
                    strokeDasharray="2 2"
                  />
                  <Line
                    dataKey="baseline"
                    stroke={COLORS[2]}
                    strokeDasharray="6 4"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    dataKey="scenario"
                    stroke="#121212"
                    strokeWidth={2.5}
                    dot
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-[var(--muted)]">
              Dashed line: baseline cash. Solid line: your scenario. Red line
              marks $0.
            </p>
          </div>
        </div>

        {insight && (
          <div
            className="mt-6 rounded-2xl bg-[var(--cream)] p-4 text-sm leading-6"
            role="status"
          >
            <p className="mb-1 text-xs font-semibold text-[var(--muted)]">
              {insight.mode === "openai"
                ? "AI analysis"
                : insight.mode === "demo"
                  ? "Demo analysis (no OpenAI key set)"
                  : "Result"}
            </p>
            {insight.text}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
