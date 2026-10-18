import type { Category, StatementMeta, Txn } from "./types";

export type Granularity = "daily" | "monthly" | "yearly";
export type Row = { key: string; label: string; revenue: number; opex: number; debt: number; net: number };

const isOpex = (c: Category) => c !== "revenue" && c !== "debt" && c !== "transfer";
const r2 = (n: number) => Math.round(n * 100) / 100;

export const monthOf = (date: string) => date.slice(0, 7);
export const monthLabel = (m: string) => new Date(`${m}-15T12:00:00`).toLocaleDateString("en-US", { month: "short", year: "numeric" });

function emptyRow(key: string, label: string): Row {
  return { key, label, revenue: 0, opex: 0, debt: 0, net: 0 };
}
function add(row: Row, t: Txn) {
  if (t.category === "transfer") return;
  if (t.category === "revenue") row.revenue += t.amount;
  else if (t.category === "debt") row.debt += -t.amount;
  else if (isOpex(t.category)) row.opex += -t.amount;
  row.net = row.revenue - row.opex - row.debt;
}
function finish(rows: Row[]) {
  return rows.map((r) => ({ ...r, revenue: r2(r.revenue), opex: r2(r.opex), debt: r2(r.debt), net: r2(r.net) }));
}

export function availableMonths(txns: Txn[]) {
  return [...new Set(txns.map((t) => monthOf(t.date)))].sort();
}

/** Roll transactions up for a chart. Daily view covers one month (`month`), the others cover everything. */
export function aggregate(txns: Txn[], g: Granularity, month?: string): Row[] {
  const map = new Map<string, Row>();
  const sorted = [...txns].sort((a, b) => a.date.localeCompare(b.date));
  for (const t of sorted) {
    let key: string, label: string;
    if (g === "daily") {
      if (monthOf(t.date) !== month) continue;
      key = t.date; label = String(+t.date.slice(8));
    } else if (g === "monthly") {
      key = monthOf(t.date); label = new Date(`${key}-15T12:00:00`).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    } else {
      key = t.date.slice(0, 4); label = key;
    }
    if (!map.has(key)) map.set(key, emptyRow(key, label));
    add(map.get(key)!, t);
  }
  if (g === "daily" && month) {
    // Fill empty days so the x-axis is a full calendar month.
    const [y, m] = month.split("-").map(Number);
    const days = new Date(y, m, 0).getDate();
    for (let d = 1; d <= days; d++) {
      const key = `${month}-${String(d).padStart(2, "0")}`;
      if (!map.has(key)) map.set(key, emptyRow(key, String(d)));
    }
  }
  return finish([...map.values()].sort((a, b) => a.key.localeCompare(b.key)));
}

export function categoryTotals(txns: Txn[], month: string) {
  const totals = new Map<Category, number>();
  for (const t of txns) {
    if (monthOf(t.date) !== month || t.amount >= 0 || t.category === "transfer") continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + -t.amount);
  }
  return [...totals.entries()].map(([category, value]) => ({ category, value: r2(value) })).sort((a, b) => b.value - a.value);
}

/** Cash on hand at the end of `month`, from the latest statement ending balance on or before it. Null if none was found. */
export function cashAt(files: StatementMeta[], month: string): number | null {
  const f = files.filter((x) => x.endingBalance !== undefined && x.to && monthOf(x.to) <= month).sort((a, b) => a.to!.localeCompare(b.to!));
  return f.length ? f[f.length - 1].endingBalance! : null;
}

export type Baseline = { revenue: number; materials: number; otherOpex: number; debt: number; cash: number; months: number; cashIsEstimate: boolean };

/** Average monthly figures over the most recent `window` months, used as the forecast baseline. */
export function baseline(txns: Txn[], files: StatementMeta[], window = 3): Baseline | null {
  const months = availableMonths(txns);
  if (!months.length) return null;
  const used = months.slice(-window);
  let revenue = 0, materials = 0, otherOpex = 0, debt = 0;
  for (const t of txns) {
    if (!used.includes(monthOf(t.date)) || t.category === "transfer") continue;
    if (t.category === "revenue") revenue += t.amount;
    else if (t.category === "debt") debt += -t.amount;
    else if (t.category === "materials") materials += -t.amount;
    else otherOpex += -t.amount;
  }
  const n = used.length;
  const printed = cashAt(files, months[months.length - 1]);
  const cash = printed ?? txns.filter((t) => t.category !== "transfer").reduce((s, t) => s + t.amount, 0);
  return { revenue: r2(revenue / n), materials: r2(materials / n), otherOpex: r2(otherOpex / n), debt: r2(debt / n), cash: r2(cash), months: n, cashIsEstimate: printed === null };
}

export type Adjustments = { revenueDropPct: number; materialsRisePct: number; unexpected: number };
export const NO_ADJ: Adjustments = { revenueDropPct: 0, materialsRisePct: 0, unexpected: 0 };

/** Straight-line projection. `unexpected` is a one-time cost that hits in month 1. */
export function forecast(b: Baseline, adj: Adjustments, horizon = 6) {
  const revenue = b.revenue * (1 - adj.revenueDropPct / 100);
  const materials = b.materials * (1 + adj.materialsRisePct / 100);
  const net = revenue - materials - b.otherOpex - b.debt;
  const path = [{ month: 0, cash: b.cash }];
  for (let i = 1; i <= horizon; i++) path.push({ month: i, cash: r2(path[i - 1].cash + net - (i === 1 ? adj.unexpected : 0)) });
  const out = path.find((p) => p.cash < 0);
  return { revenue: r2(revenue), materials: r2(materials), net: r2(net), path, endCash: path[horizon].cash, margin: revenue ? net / revenue : 0, runsOutInMonth: out ? out.month : null };
}

export type Slice = { key: Category | "retained"; name: string; value: number };

/** Where revenue went in one period (`prefix` is a day, month or year: YYYY-MM-DD, YYYY-MM or YYYY). */
export function periodBreakdown(txns: Txn[], prefix: string) {
  let revenue = 0;
  const out = new Map<Category, number>();
  for (const t of txns) {
    if (!t.date.startsWith(prefix) || t.category === "transfer") continue;
    if (t.category === "revenue") revenue += t.amount;
    else out.set(t.category, (out.get(t.category) ?? 0) + -t.amount);
  }
  const outflow = [...out.values()].reduce((a, b) => a + b, 0);
  const net = revenue - outflow;
  const slices: Slice[] = [...out.entries()].map(([key, value]) => ({ key, name: key, value: r2(value) })).sort((a, b) => b.value - a.value);
  if (net > 0) slices.push({ key: "retained", name: "retained", value: r2(net) });
  return { slices, revenue: r2(revenue), outflow: r2(outflow), net: r2(net) };
}

export const money = (v: number, compact = false) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0, ...(compact ? { notation: "compact" as const } : {}) });
