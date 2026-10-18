export type Assumption = { costGrowthPct: number; revenueGrowthPct: number }; // change per month
export type ScenarioKey = "expected" | "cautious" | "optimistic";
export type Assumptions = Record<ScenarioKey, Assumption>;

export const DEFAULT_ASSUMPTIONS: Assumptions = {
  expected: { costGrowthPct: 0, revenueGrowthPct: 0 },
  cautious: { costGrowthPct: 1.5, revenueGrowthPct: -1.5 },
  optimistic: { costGrowthPct: -0.5, revenueGrowthPct: 1 },
};
export const HORIZON = 24;
const clamp = (n: unknown, lo: number, hi: number, fallback: number) => (typeof n === "number" && Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback);
export const clampAssumption = (a: Partial<Assumption> | undefined, fallback: Assumption): Assumption => ({
  costGrowthPct: clamp(a?.costGrowthPct, -5, 5, fallback.costGrowthPct),
  revenueGrowthPct: clamp(a?.revenueGrowthPct, -5, 5, fallback.revenueGrowthPct),
});

/** Month-by-month cash. Month 1 uses the entered figures; growth compounds from month 2. `runout` is fractional months of cash, or null if cash lasts the whole horizon. */
export function project(cash: number, costs: number, revenue: number, a: Assumption, horizon = HORIZON) {
  const path = [cash];
  let c = costs, r = revenue, runout: number | null = cash <= 0 ? 0 : null;
  for (let m = 1; m <= horizon; m++) {
    if (m > 1) { c *= 1 + a.costGrowthPct / 100; r *= 1 + a.revenueGrowthPct / 100; }
    const prev = path[m - 1], next = prev + r - c;
    path.push(Math.round(next));
    if (runout === null && next < 0) runout = m - 1 + prev / (c - r);
  }
  return { path, runout };
}

export function projectAll(cash: number, costs: number, revenue: number, as: Assumptions) {
  return (Object.keys(as) as ScenarioKey[]).reduce((acc, k) => ({ ...acc, [k]: project(cash, costs, revenue, as[k]) }), {} as Record<ScenarioKey, ReturnType<typeof project>>);
}
