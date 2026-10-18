import Link from "next/link";
import { Wind } from "lucide-react";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black">
      <Wind size={28} aria-hidden />
      <span className="text-2xl font-bold tracking-tight">Smart Flow</span>
    </Link>
  );
}
