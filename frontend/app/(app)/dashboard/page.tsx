"use client";
import { useMemo, useState } from "react";
import { UploadPanel } from "@/components/dashboard/upload-panel";
import { HealthKpis } from "@/components/dashboard/health-kpis";
import { CashFlowChart } from "@/components/dashboard/cash-flow-chart";
import { CashDonut } from "@/components/dashboard/cash-donut";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { NoData } from "@/components/dashboard/no-data";
import { Card, CardContent } from "@/components/ui/card";
import {
  aggregate,
  availableMonths,
  baseline,
  cashAt,
  forecast,
  monthLabel,
  NO_ADJ,
  type Granularity,
} from "@/lib/analytics";
import { useData } from "@/lib/statements-context";
import SelectContainer from "@/components/select/SelectContainer";

export default function Dashboard() {
  const s = useData();
  const [g, setG] = useState<Granularity>("monthly");
  const [picked, setPicked] = useState("");

  const months = useMemo(() => availableMonths(s.txns), [s.txns]);
  const month = months.includes(picked)
    ? picked
    : (months[months.length - 1] ?? "");
  const base = useMemo(() => baseline(s.txns, s.files), [s.txns, s.files]);
  const monthly = useMemo(() => aggregate(s.txns, "monthly"), [s.txns]);

  if (!s.ready) return null;
  const idx = monthly.findIndex((r) => r.key === month);
  const row = monthly[idx];
  const projectedNet = base ? forecast(base, NO_ADJ).net : 0;
  const cashEstimate = s.txns
    .filter((t) => t.category !== "transfer")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Financial health
        </h1>
        {/* ? `Showing ${monthLabel(month)}. Figures come from the statements you import and are not a substitute for your accounting records.` */}
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          {!row &&
            "Import your bank statements to see revenue, costs, debt, cash and a forecast."}
        </p>
      </div>

      <UploadPanel
        files={s.files}
        busy={s.busy}
        notice={s.notice}
        onAdd={s.addFiles}
        onRemove={s.remove}
        onClear={s.clear}
        onSample={s.loadSample}
      />

      {!row || !base ? (
        <NoData feature="the dashboard charts" />
      ) : (
        <>
          <div className="flex items-center gap-2">
            {/* <label htmlFor="month" className="text-sm font-semibold">Month</label> */}
            <SelectContainer>
              <select
                id="month"
                value={month}
                onChange={(e) => setPicked(e.target.value)}
                className="bg-foreground text-background px-4 text-sm"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {monthLabel(m)}
                  </option>
                ))}
              </select>
            </SelectContainer>
          </div>
          <HealthKpis
            month={month}
            row={row}
            prev={monthly[idx - 1]}
            cash={cashAt(s.files, month)}
            cashEstimate={cashEstimate}
            base={base}
            projectedNet={projectedNet}
          />
          <CashFlowChart
            txns={s.txns}
            months={months}
            month={month}
            onMonth={setPicked}
            g={g}
            onG={setG}
          />
          <CashDonut txns={s.txns} month={month} />
          <div className="grid gap-5 lg:grid-cols-2">
            <CategoryChart txns={s.txns} month={month} />
            <Card>
              <CardContent className="p-5 text-sm leading-6">
                <p className="mb-2 font-semibold">
                  How these numbers are built
                </p>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>
                    <strong className="">Revenue</strong> is
                    money in, excluding transfers between your own accounts.
                  </li>
                  <li>
                    <strong className="">
                      Operating expenses
                    </strong>{" "}
                    are payroll, raw materials, rent, utilities, software and
                    other spending, excluding debt and transfers.
                  </li>
                  <li>
                    <strong className="">Debt payments</strong>{" "}
                    are loan, line-of-credit and card payments.
                  </li>
                  <li>
                    <strong className="">
                      Projected net cash flow
                    </strong>{" "}
                    is average monthly revenue minus operating expenses and debt
                    payments over your last {base.months} months.
                  </li>
                </ul>
                <p className="mt-3">
                  Categories use simple keyword matching, so check anything that
                  looks off.
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
