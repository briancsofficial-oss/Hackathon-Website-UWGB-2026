"use client";
import {
  Bar,
  BarChart,
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
import { categoryTotals, money, monthLabel } from "@/lib/analytics";
import { CATEGORY_LABELS } from "@/lib/categorize";
import type { Txn } from "@/lib/types";

export function CategoryChart({ txns, month }: { txns: Txn[]; month: string }) {
  const data = categoryTotals(txns, month).map((d) => ({
    name: CATEGORY_LABELS[d.category],
    value: d.value,
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Where the money went</CardTitle>
        <CardDescription>
          Spending by category in {monthLabel(month)}. Categories come from
          keywords in each transaction description.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-foreground/80">
            No spending found for this month.
          </p>
        ) : (
          <div
            style={{ height: Math.max(180, data.length * 48) }}
            className="w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => money(v, true)}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(v: any) => money(Number(v))}
                  cursor={{ fill: "#00000008" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #dfd6cb",
                    background: "#fffaf4",
                  }}
                />
                <Bar dataKey="value" fill="#121212" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
