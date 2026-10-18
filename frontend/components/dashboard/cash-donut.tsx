"use client";
import { useMemo, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  money,
  monthLabel,
  periodBreakdown,
  type Granularity,
} from "@/lib/analytics";
import { SLICE_COLORS, SLICE_LABELS } from "@/lib/categorize";
import type { Txn } from "@/lib/types";
import SelectContainer from "../select/SelectContainer";

const dayLabel = (d: string) =>
  new Date(`${d}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export function CashDonut({ txns, month }: { txns: Txn[]; month: string }) {
  const [g, setG] = useState<Granularity>("monthly");
  const [picked, setPicked] = useState<Record<Granularity, string>>({
    daily: "",
    monthly: "",
    yearly: "",
  });

  const chartColors = [
    "#10B981",
    "#F43F5E",
    "#6366F1",
    "#F59E0B",
    "#86EFAC",
    "#0EA5E9",
    "#EA580C",
    "#A855F7",
  ];

  const options = useMemo(() => {
    const dates = [...new Set(txns.map((t) => t.date))].sort();
    return {
      daily: dates
        .filter((d) => d.startsWith(month))
        .map((d) => ({ value: d, label: dayLabel(d) })),
      monthly: [...new Set(dates.map((d) => d.slice(0, 7)))].map((m) => ({
        value: m,
        label: monthLabel(m),
      })),
      yearly: [...new Set(dates.map((d) => d.slice(0, 4)))].map((y) => ({
        value: y,
        label: y,
      })),
    };
  }, [txns, month]);

  const list = options[g];
  const fallback =
    g === "monthly"
      ? month
      : g === "yearly"
        ? month.slice(0, 4)
        : (list[list.length - 1]?.value ?? "");
  const current = list.some((o) => o.value === picked[g])
    ? picked[g]
    : list.some((o) => o.value === fallback)
      ? fallback
      : (list[list.length - 1]?.value ?? "");
  const data = useMemo(
    () => (current ? periodBreakdown(txns, current) : null),
    [txns, current],
  );
  const label = list.find((o) => o.value === current)?.label ?? "";
  const hasData = !!data && data.slices.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Cash flow breakdown</CardTitle>
            <CardDescription>
              How each dollar of revenue was used. Green is cash kept.{" "}
              {g === "daily" ? "Days come from the month selected above." : ""}
            </CardDescription>
          </div>
          <Tabs value={g} onValueChange={(v) => setG(v as Granularity)}>
            <TabsList aria-label="Breakdown period">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-center gap-2">
          {/* <label htmlFor="donut-period" className="text-sm font-semibold">
            {g === "daily" ? "Day" : g === "monthly" ? "Month" : "Year"}
          </label> */}

          <SelectContainer>
            <select
              id="donut-period"
              value={current}
              onChange={(e) => setPicked({ ...picked, [g]: e.target.value })}
              className="bg-foreground text-background text-sm font-semibold"
            >
              {list.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </SelectContainer>
        </div>
        {!hasData ? (
          <p className="py-10 text-center text-sm text-[var(--muted)]">
            No transactions for this period.
          </p>
        ) : (
          <div className="grid items-center gap-4 sm:grid-cols-[1fr_1fr]">
            <div
              className="relative mx-auto h-[250px] w-full max-w-[280px]"
              role="img"
              aria-label={`Donut chart of cash flow for ${label}. Net ${money(data.net)}.`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.slices}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    /* 3. Radius gap defining the thickness of the donut */
                    innerRadius="65%" // Larger inner hole for that ultra-minimal look
                    outerRadius="85%" // Crisp crisp outer perimeter
                    paddingAngle={1} // Micro-gap spacing between color wedges
                    shape={(props: any) => {
                      // 1. Pull both 'payload' AND 'key' out so they don't get spread into the element
                      const { payload, key, ...sectorProps } = props;
                      const sliceKey =
                        payload?.key as keyof typeof SLICE_COLORS;
                      const fill = SLICE_COLORS[sliceKey] || "#10B981"; // Fallback color

                      // 2. Explicitly pass the key directly to JSX
                      return <Sector key={key} {...sectorProps} fill={fill} />;
                    }}
                  />
                  {/* <Tooltip formatter={(v: number, _n, p) => [money(v), SLICE_LABELS[p.payload.key as keyof typeof SLICE_LABELS]]} contentStyle={{ borderRadius: 12, border: "1px solid #dfd6cb", background: "#fffaf4" }} /> */}
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="text-xs text-[var(--muted)]">Net cash flow</p>
                  <p
                    className={`text-2xl font-bold tracking-tight ${data.net < 0 ? "text-[#8a2a16]" : ""}`}
                  >
                    {data.net >= 0 ? "+" : "-"}
                    {money(Math.abs(data.net))}
                  </p>
                  <p className="text-xs text-[var(--muted)]">{label}</p>
                </div>
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between gap-3 border-b border-[var(--line)] pb-2">
                <span className="text-[var(--muted)]">Revenue</span>
                <strong>{money(data.revenue)}</strong>
              </li>
              {data.slices.map((s) => (
                <li
                  key={s.key}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-2">
                    <i
                      className="h-3 w-3 shrink-0 rounded-sm"
                      style={{ background: SLICE_COLORS[s.key] }}
                    />
                    {SLICE_LABELS[s.key]}
                  </span>
                  <span className="tabular-nums">{money(s.value)}</span>
                </li>
              ))}
              {data.net < 0 && (
                <li className="rounded-xl bg-[#f3d9d2] p-2 text-xs text-[#8a2a16]">
                  Spending was {money(-data.net)} more than revenue in this
                  period, so there is no cash retained.
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
