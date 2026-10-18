import Link from "next/link";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-5 sm:px-8">
      <Brand />
      <nav className="flex items-center gap-2" aria-label="Account">
        <Button variant="ghost"><Link href="/signin">Sign in</Link></Button>
        <Button><Link href="/signup">Sign up</Link></Button>
      </nav>
    </header>
  );
}
