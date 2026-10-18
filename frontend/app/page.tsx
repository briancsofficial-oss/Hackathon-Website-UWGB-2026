import Link from "next/link";
import {
  ArrowRight,
  FileUp,
  LineChart,
  SlidersHorizontal,
  UserPlus,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { HeroPreview } from "@/components/hero-preview";
import { Button } from "@/components/ui/button";

export default function Home() {
  const steps = [
    {
      icon: UserPlus,
      title: "Create your workspace",
      text: "Sign up with your business details. This demo uses one shared login, shown on the sign-in page.",
    },
    {
      icon: FileUp,
      title: "Import up to 12 bank statements",
      text: "Drop in PDF statements, one per month. Smart Flow reads the transactions and sorts them into revenue, operating costs and debt payments.",
    },
    {
      icon: LineChart,
      title: "See your financial health",
      text: "Check revenue, operating expenses, debt payments, available cash and projected net cash flow, by day, month or year.",
    },
    {
      icon: SlidersHorizontal,
      title: "Test what-ifs",
      text: "Raise raw-material costs or cut revenue and watch next quarter's cash change right away, with an AI explanation.",
    },
  ];
  return (
    <main className="min-h-screen bg-(--cream)">
      <SiteHeader />
      <section className="mx-auto grid max-w-295 items-center gap-10 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:pt-14">
        <div>
          <h1 className="max-w-xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Know where your cash is going before it gets there.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-foreground/85 sm:text-lg">
            Upload a year of bank statements and get a clear view of revenue,
            costs, debt and cash. Then ask what happens if materials get more
            expensive.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg">
              <Link href="/signup" className="flex items-center gap-2">
                Create your workspace 
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link href="/signin">Sign in</Link>
            </Button>
          </div>
        </div>
        <HeroPreview />
      </section>

      <section
        className="bg-foreground text-background"
        aria-labelledby="how"
      >
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
          <h2
            id="how"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Set up in four steps
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                className="rounded-3xl bg-background text-foreground p-5"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-white">
                    <Icon size={18} aria-hidden />
                  </span>
                  <span className="text-sm font-semibold">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 opacity-85">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="mx-auto max-w-[1180px] px-5 py-8 text-center text-xs sm:px-8">
        Demo prototype. Statements are read in memory and not stored. Use sample
        or non-sensitive data only.
      </footer>
    </main>
  );
}
