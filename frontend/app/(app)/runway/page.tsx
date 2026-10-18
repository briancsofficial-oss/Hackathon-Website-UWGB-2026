"use client";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { aggregate, baseline, money } from "@/lib/analytics";
import {
  DEFAULT_ASSUMPTIONS,
  HORIZON,
  projectAll,
  type Assumptions,
  type ScenarioKey,
} from "@/lib/runway";
import { useData } from "@/lib/statements-context";
import { COLORS } from "@/lib/categorize";

const tip = {
  borderRadius: 12,
  border: "1px solid #dfd6cb",
  background: "#fffaf4",
};
const SCEN: { key: ScenarioKey; label: string; color: string }[] = [
  { key: "expected", label: "Expected", color: COLORS[0] },
  { key: "cautious", label: "Cautious", color: COLORS[1] },
  { key: "optimistic", label: "Optimistic", color: COLORS[2] },
];
const fmtRunout = (r: number | null) =>
  r === null
    ? `${HORIZON}+ months`
    : r < 1
      ? "Under 1 month"
      : `${r.toFixed(1)} months`;

type Result = {
  assumptions: Assumptions;
  narrative: string;
  actions: string[];
  mode: string;
  inputs: { cash: number; costs: number; revenue: number };
};

export default function RunwayPage() {
  const { txns, files } = useData();
  const base = useMemo(() => baseline(txns, files), [txns, files]);
  const [cash, setCash] = useState("");
  const [costs, setCosts] = useState("");
  const [revenue, setRevenue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const fillFromStatements = () => {
    if (!base) return;
    setCash(String(Math.round(base.cash)));
    setCosts(String(Math.round(base.materials + base.otherOpex + base.debt)));
    setRevenue(String(Math.round(base.revenue)));
    setError("");
  };

  async function run(e: React.SubmitEvent) {
    e.preventDefault();
    const c = Number(cash),
      k = Number(costs),
      r = revenue === "" ? 0 : Number(revenue);
    if (cash === "" || !Number.isFinite(c) || c < 0)
      return setError("Enter the cash you have on hand (0 or more).");
    if (costs === "" || !Number.isFinite(k) || k <= 0)
      return setError("Enter your monthly costs (more than 0).");
    if (!Number.isFinite(r) || r < 0)
      return setError("Monthly revenue must be 0 or more, or left blank.");
    setError("");
    setBusy(true);
    try {
      let history;
      if (txns.length) {
        const m = aggregate(txns, "monthly");
        if (m.length >= 2) {
          const first = m[0],
            last = m[m.length - 1];
          const pct = (a: number, b: number) =>
            a ? Math.round(((b - a) / a) * 100) : 0;
          history = {
            revenue: Math.round(
              m.reduce((s, x) => s + x.revenue, 0) / m.length,
            ),
            costs: Math.round(
              m.reduce((s, x) => s + x.opex + x.debt, 0) / m.length,
            ),
            revenueChangePct: pct(first.revenue, last.revenue),
            costsChangePct: pct(first.opex + first.debt, last.opex + last.debt),
          };
        }
      }
      const res = await fetch("/api/runway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cash: c, costs: k, revenue: r, history }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Could not generate the projection.");
      setResult({
        ...data,
        assumptions: data.assumptions ?? DEFAULT_ASSUMPTIONS,
        inputs: { cash: c, costs: k, revenue: r },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not generate the projection.",
      );
    } finally {
      setBusy(false);
    }
  }

  const proj = useMemo(
    () =>
      result
        ? projectAll(
            result.inputs.cash,
            result.inputs.costs,
            result.inputs.revenue,
            result.assumptions,
          )
        : null,
    [result],
  );
  const lineData = useMemo(
    () =>
      proj
        ? proj.expected.path.map((_, i) => ({
            month: i,
            expected: Math.max(0, proj.expected.path[i]),
            cautious: Math.max(0, proj.cautious.path[i]),
            optimistic: Math.max(0, proj.optimistic.path[i]),
          }))
        : [],
    [proj],
  );
  const barData = proj
    ? SCEN.map((s) => ({
        name: s.label,
        months: proj[s.key].runout ?? HORIZON,
        color: s.color,
        open: proj[s.key].runout === null,
      }))
    : [];
  const burn = result ? result.inputs.costs - result.inputs.revenue : 0;

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Cash runway
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-foreground/85">
          Enter the cash you have and what you spend each month. AI picks cost
          and revenue trends for three scenarios and shows how long the cash
          lasts.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-lg">Your numbers</CardTitle>
            {base && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillFromStatements}
              >
                <Wand2 size={14} /> Use my statements
              </Button>
            )}
          </div>
          <CardDescription>
            Revenue is optional. Leave it blank to see how long cash lasts with
            no income.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={run} className="grid gap-4 sm:grid-cols-3" noValidate>
            <div className="flex flex-col gap-3">
              <Label htmlFor="cash">Cash on hand ($)</Label>
              <Input
                id="cash"
                type="number"
                inputMode="decimal"
                min={0}
                value={cash}
                onChange={(e) => {
                  setCash(e.target.value);
                  setError("");
                }}
                placeholder="50000"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="costs">Monthly costs ($)</Label>
              <Input
                id="costs"
                type="number"
                inputMode="decimal"
                min={0}
                value={costs}
                onChange={(e) => {
                  setCosts(e.target.value);
                  setError("");
                }}
                placeholder="30000"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="rev">Monthly revenue ($, optional)</Label>
              <Input
                id="rev"
                type="number"
                inputMode="decimal"
                min={0}
                value={revenue}
                onChange={(e) => {
                  setRevenue(e.target.value);
                  setError("");
                }}
                placeholder="0"
              />
            </div>
            <div className="sm:col-span-3">
              {error && (
                <p
                  role="alert"
                  className="mb-3 text-sm font-medium text-[#8a2a16]"
                >
                  {error}
                </p>
              )}
              <Button type="submit" size="lg" disabled={busy}>
                {busy ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}{" "}
                {busy ? "Projecting…" : "Project my runway"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {result && proj && (
        <>
          <section
            aria-label="Runway results"
            className="grid gap-3 sm:grid-cols-3"
          >
            {SCEN.map((s) => {
              const r = proj[s.key].runout;
              return (
                <div key={s.key} className="rounded-3xl bg-card shadow-md p-5">
                  <p className="flex items-center gap-2 text-sm text-foreground">
                    <i
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: s.color }}
                    />
                    {s.label}
                  </p>
                  <p
                    className={`mt-2 text-2xl font-semibold tracking-tight ${r !== null && r < 6 ? "text-[#8a2a16]" : ""}`}
                  >
                    {fmtRunout(r)}
                  </p>
                  <p className="mt-1 text-xs text-foreground/80">
                    Costs{" "}
                    {result.assumptions[s.key].costGrowthPct >= 0 ? "+" : ""}
                    {result.assumptions[s.key].costGrowthPct}%/mo, revenue{" "}
                    {result.assumptions[s.key].revenueGrowthPct >= 0 ? "+" : ""}
                    {result.assumptions[s.key].revenueGrowthPct}%/mo
                  </p>
                </div>
              );
            })}
          </section>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-lg">
                  Projected cash balance
                </CardTitle>
                <Badge variant={result.mode === "openai" ? "default" : "muted"}>
                  {result.mode === "openai"
                    ? "AI assumptions"
                    : "Demo assumptions"}
                </Badge>
              </div>
              <CardDescription>
                {burn > 0
                  ? `Net burn starts at ${money(burn)} per month.`
                  : `Revenue covers costs by ${money(-burn)} per month at the start.`}{" "}
                Each line flattens at $0 once that scenario&apos;s cash has run
                out.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={lineData}
                    margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="#e4dbd0"
                      strokeDasharray="4 4"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(m) => (m === 0 ? "Now" : `M${m}`)}
                      interval={2}
                    />
                    {/* <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => money(v, true)} width={60} /> */}
                    <Tooltip
                      // 1. Remove explicit parameter types to allow native inference
                      formatter={(v, n) => {
                        const numericValue =
                          typeof v === "number" ? v : Number(v);
                        const nameString = String(n);

                        return [
                          money(numericValue),
                          SCEN.find((s) => s.key === nameString)?.label ??
                            nameString,
                        ];
                      }}
                      // 2. Safely process the label metric
                      labelFormatter={(m) => {
                        const monthValue =
                          typeof m === "number" ? m : Number(m);
                        return monthValue === 0 ? "Now" : `Month ${m}`;
                      }}
                      contentStyle={tip}
                    />
                    <ReferenceLine
                      y={0}
                      stroke="#8a2a16"
                      strokeDasharray="2 2"
                    />
                    {SCEN.map((s) => (
                      <Line
                        key={s.key}
                        dataKey={s.key}
                        stroke={s.color}
                        strokeWidth={s.key === "expected" ? 3 : 2}
                        dot={false}
                        strokeDasharray={
                          s.key === "expected" ? undefined : "6 4"
                        }
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--muted)]">
                {SCEN.map((s) => (
                  <span key={s.key} className="flex items-center gap-1.5">
                    <i className="h-0.5 w-4" style={{ background: s.color }} />
                    {s.label}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Months of cash by scenario
                </CardTitle>
                <CardDescription>
                  Capped at {HORIZON} months, the length of the projection.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barData}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        stroke="#e4dbd0"
                        strokeDasharray="4 4"
                        vertical={false}
                      />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      {/* <YAxis tick={{ fontSize: 12 }} domain={[0, HORIZON]} width={32} /> */}
                      <Tooltip
                        formatter={(v, _n, p) => {
                          // 2. Cast the specific field you need to access safely
                          const payload = p.payload as { open?: boolean };
                          const numericValue =
                            typeof v === "number" ? v : Number(v);

                          return [
                            payload?.open
                              ? `${HORIZON}+ months`
                              : `${numericValue.toFixed(1)} months`,
                            "Cash lasts",
                          ];
                        }}
                        contentStyle={tip}
                        cursor={{ fill: "#00000008" }}
                      />
                      <Bar dataKey="months" radius={[6, 6, 0, 0]}>
                        {barData.map((d) => (
                          <Cell key={d.name} fill={d.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI summary</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6">
                <p>{result.narrative}</p>
                {result.actions.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1 pl-5">
                    {result.actions.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                )}
                <p className="mt-3 text-xs text-[var(--muted)]">
                  A projection from the assumptions shown above, not a forecast
                  or financial advice.{" "}
                  {result.mode === "demo" &&
                    "No OpenAI key is set, so fixed demo assumptions were used."}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
