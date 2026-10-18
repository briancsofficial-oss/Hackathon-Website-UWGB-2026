"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Hourglass, LayoutDashboard, LogOut, Menu, MessageSquareText, SlidersHorizontal, X } from "lucide-react";
import { Brand } from "@/components/brand";
import { signOut } from "@/lib/auth";
import { useData } from "@/lib/statements-context";
import { MAX_STATEMENTS } from "@/lib/types";
import { Button } from "./ui/button";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/interview", label: "AI interview", icon: MessageSquareText },
  { href: "/what-if", label: "What-if analysis", icon: SlidersHorizontal },
  { href: "/runway", label: "Cash runway", icon: Hourglass },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { files } = useData();
  const [open, setOpen] = useState(false);
  const current = NAV.find((n) => path.startsWith(n.href))?.label ?? "Menu";

  const nav = (
    <nav aria-label="Main" className="grid gap-1">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = path.startsWith(href);
        return (
          <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${active ? "bg-background text-foreground" : "text-background/80 hover:bg-background hover:text-foreground"}`}>
            <Icon size={16} aria-hidden />{label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-foreground text-background md:grid md:grid-cols-[250px_1fr]">
      <aside className="border-b border-background/15 shadow-md p-4 md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-b-0 md:border-r md:p-3">
        <div className="flex items-center justify-between md:mb-6 md:px-1">
          <Brand href="/dashboard" />
          <button className="flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-sm md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
            {current}{open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
        <div className={`${open ? "block" : "hidden"} mt-3 md:mt-0 md:flex md:flex-1 md:flex-col`}>
          {nav}
          {/* <div className="mt-5 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 text-sm md:mt-auto">
            <p className="font-semibold">{files.length} of {MAX_STATEMENTS} statements</p>
            <p className="mt-1 text-xs leading-5 text-foreground/80">{files.length ? "Used by the dashboard, what-if and runway pages." : "Import statements on the dashboard to fill in your numbers."}</p>
          </div> */}
          <Button size={"lg"} variant={"ghost"} onClick={() => { signOut(); router.push("/"); }} className="mt-auto justify-start">
            <LogOut size={16} aria-hidden /> Sign out
          </Button>
        </div>
      </aside>
      <main className="min-w-0 px-5 py-8 sm:px-8 bg-background text-foreground">{children}</main>
    </div>
  );
}
