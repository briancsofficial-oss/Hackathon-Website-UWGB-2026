import Link from "next/link";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NoData({ feature }: { feature: string }) {
  return (
    <Card><CardContent className="flex flex-col items-center gap-2 p-10 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-black text-white"><FileUp size={20} aria-hidden /></span>
      <p className="font-semibold">Import statements to use {feature}</p>
      <p className="max-w-md text-sm leading-6 text-foreground/85">This page works from your imported bank statements. Add PDFs, or load the sample data, on the dashboard.</p>
      <Button className="mt-2"><Link href="/dashboard">Go to dashboard</Link></Button>
    </CardContent></Card>
  );
}
