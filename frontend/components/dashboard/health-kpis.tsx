import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { money, monthLabel, type Baseline, type Row } from "@/lib/analytics";

type Props = {
  month: string;
  row: Row;
  prev?: Row;
  cash: number | null;
  cashEstimate: number;
  base: Baseline;
  projectedNet: number;
};

function Delta({
  now,
  before,
  goodWhenUp,
}: {
  readonly now: number;
  readonly before?: number;
  readonly goodWhenUp: boolean;
}) {
  if (before === undefined || before === 0) return null;
  const pct = ((now - before) / Math.abs(before)) * 100;
  if (Math.abs(pct) < 0.5)
    return (
      <p className="mt-1 text-xs text-foreground">Flat vs prior month</p>
    );
  const up = pct > 0,
    good = up === goodWhenUp,
    Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <p
      className={`mt-1 flex items-center gap-1 text-xs font-medium ${good ? "text-green-500" : "text-red-500"}`}
    >
      <Icon size={13} aria-hidden />
      {Math.abs(pct).toFixed(0)}% vs prior month
    </p>
  );
}

function Kpi({
  label,
  value,
  children,
  tone,
}: {
  readonly label: string;
  readonly value: string;
  readonly children?: React.ReactNode;
  readonly tone?: "good" | "bad";
}) {
  return (
    <div className="rounded-3xl bg-card shadow-md p-5">
      <p className="text-sm text-foreground">{label}</p>
      <p
        className={`mt-2 wrap-break-word text-2xl font-semibold tracking-tight ${tone === "bad" ? "text-red-500" : tone === "good" ? "text-green-500" : "text-foreground"}`}
      >
        {value}
      </p>
      {children}
    </div>
  );
}

export function HealthKpis({
  month,
  row,
  prev,
  cash,
  cashEstimate,
  base,
  projectedNet,
}: Readonly<Props>) {
  return (
    <section
      aria-label={`Financial health for ${monthLabel(month)}`}
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
    >
      <Kpi label="Revenue" value={money(row.revenue)}>
        <Delta now={row.revenue} before={prev?.revenue} goodWhenUp />
      </Kpi>
      <Kpi label="Operating expenses" value={money(row.opex)}>
        <Delta now={row.opex} before={prev?.opex} goodWhenUp={false} />
      </Kpi>
      <Kpi label="Debt payments" value={money(row.debt)}>
        <Delta now={row.debt} before={prev?.debt} goodWhenUp={false} />
      </Kpi>
      <Kpi label="Available cash" value={money(cash ?? cashEstimate)}>
        <p className="mt-1 text-xs text-foreground/80">
          {cash === null
            ? "Estimated: net of imported transactions"
            : `Statement balance, end of ${monthLabel(month)}`}
        </p>
      </Kpi>
      <Kpi
        label="Projected net cash flow"
        value={`${projectedNet >= 0 ? "+" : ""}${money(projectedNet)}`}
        tone={projectedNet >= 0 ? "good" : "bad"}
      >
        <p className="mt-1 text-xs text-foreground/80">
          Per month, from the last {base.months} month
          {base.months > 1 ? "s" : ""}&apos; average
        </p>
      </Kpi>
    </section>
  );
}
