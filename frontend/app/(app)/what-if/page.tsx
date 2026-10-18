"use client";
import { useMemo } from "react";
import { baseline } from "@/lib/analytics";
import { useData } from "@/lib/statements-context";
import { WhatIf } from "@/components/dashboard/what-if";
import { NoData } from "@/components/dashboard/no-data";

export default function WhatIfPage() {
  const { txns, files, ready } = useData();
  const base = useMemo(() => baseline(txns, files), [txns, files]);
  if (!ready) return null;
  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">What-if analysis</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/80">Test how a revenue drop, rising raw-material costs or a surprise expense would change your cash over the next six months.</p>
      </div>
      {base ? <WhatIf base={base} /> : <NoData feature="what-if analysis" />}
    </div>
  );
}
