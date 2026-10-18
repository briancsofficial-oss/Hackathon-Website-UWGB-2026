"use client";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
  aggregate,
  money,
  monthLabel,
  type Granularity,
} from "@/lib/analytics";
import type { Txn } from "@/lib/types";
import SelectContainer from "../select/SelectContainer";
import { COLORS } from "@/lib/categorize";

type Props = {
  txns: Txn[];
  months: string[];
  month: string;
  onMonth: (m: string) => void;
  g: Granularity;
  onG: (g: Granularity) => void;
};

const DESC: Record<Granularity, string> = {
  daily: "Each day of the selected month.",
  monthly: "Every month in your imported statements.",
  yearly:
    "Calendar-year totals. Years with fewer than 12 months of statements are partial.",
};

export function CashFlowChart({ txns, months, month, onMonth, g, onG }: Props) {
  const data = aggregate(txns, g, month);
  const names: Record<string, string> = {
    revenue: "Revenue",
    opex: "Operating expenses",
    debt: "Debt payments",
    net: "Net cash flow",
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Cash flow over time</CardTitle>
            <CardDescription>
              {DESC[g]} Transfers between your own accounts are excluded.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {g === "daily" && (
              <SelectContainer>
                <select
                  value={month}
                  onChange={(e) => onMonth(e.target.value)}
                  aria-label="Month"
                  className="h-11 rounded-full px-4 text-sm font-semibold"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {monthLabel(m)}
                    </option>
                  ))}
                </select>
              </SelectContainer>
            )}
            <Tabs value={g} onValueChange={(v) => onG(v as Granularity)}>
              <TabsList aria-label="Time range">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                stroke="#e4dbd0"
                strokeDasharray="4 4"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                interval={g === "daily" ? 2 : 0}
              />
              {/* <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => money(v, true)} width={56} /> */}
              {/* formatter={(v: number, n: string) => [money(v), names[n] ?? n]} */}
              <Tooltip
                labelFormatter={(l) =>
                  g === "daily" ? `${monthLabel(month)} ${l}` : l
                }
                // 1. Remove explicit inline types to let Recharts infer them safely
                formatter={(v, n) => {
                  const numericValue = typeof v === "number" ? v : Number(v);
                  const nameString = String(n);

                  // 2. Safely look up keys in your "names" map
                  return [
                    money(numericValue),
                    (names as Record<string, string>)[nameString] ?? nameString,
                  ];
                }}
                contentStyle={{
                  gap: "0px",
                  borderRadius: 12,
                  border: "1px solid #dfd6cb",
                  background: "#fff",
                }}
              />
              {/* <Legend
                formatter={(n: string) => names[n] ?? n}
                wrapperStyle={{ fontSize: 12 }}
              /> */}
              <Bar dataKey="revenue" fill="#121212" radius={[8, 8, 8, 8]} />
              <Bar
                dataKey="opex"
                stackId="out"
                fill="#12121250"
                radius={[8, 8, 8, 8]}
              />
              {/* <Bar dataKey="debt" stackId="out" fill="#d9c7ad" radius={[4, 4, 0, 0]} /> */}
              <Line
                dataKey="net"
                type="monotone"
                stroke={COLORS[0]}
                strokeWidth={2.5}
                dot={g !== "daily"}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
