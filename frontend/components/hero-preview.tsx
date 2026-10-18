"use client";
import { Bar, Line, ComposedChart, ResponsiveContainer, XAxis } from "recharts";

const data = [
  { m: "Jul", in: 46, out: 41 }, { m: "Aug", in: 49, out: 44 }, { m: "Sep", in: 47, out: 46 },
  { m: "Oct", in: 52, out: 45 }, { m: "Nov", in: 55, out: 47 }, { m: "Dec", in: 51, out: 48 },
].map((d) => ({ ...d, net: d.in - d.out }));

/** Illustrative only: a miniature of the real dashboard chart. */
export function HeroPreview() {
  return (
    <div className="rounded-[28px] bg-[#121212] p-6 text-white sm:p-7" role="img" aria-label="Example chart of monthly money in, money out and net cash flow">
      <p className="text-sm text-white/60">Projected net cash flow, next month</p>
      <p className="mt-1 text-4xl font-bold tracking-tight">+$6,000</p>
      <div className="mt-5 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
            <XAxis dataKey="m" tick={{ fill: "#ffffff99", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Bar dataKey="in" fill="#f5eee4" radius={[6, 6, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="out" fill="#6b6359" radius={[6, 6, 0, 0]} isAnimationActive={false} />
            <Line dataKey="net" stroke="#8fd3a4" strokeWidth={2.5} dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/70">
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-[#f5eee4]" />Money in</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-[#6b6359]" />Money out</span>
        <span className="flex items-center gap-1.5"><i className="h-0.5 w-3 bg-[#8fd3a4]" />Net</span>
      </div>
      <p className="mt-3 text-xs text-white/50">Example values for illustration.</p>
    </div>
  );
}
