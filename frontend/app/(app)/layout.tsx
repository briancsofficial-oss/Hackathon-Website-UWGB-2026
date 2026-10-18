"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { StatementsProvider } from "@/lib/statements-context";
import { isSignedIn } from "@/lib/auth";

export default function AppLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  
  useEffect(() => {
    if (isSignedIn()) setOk(true);
    else router.replace("/signin");
  }, [router]);

  // Always return the wrapper structure so Next.js can find the children segment
  return (
    <StatementsProvider>
      <AppShell>
        {ok ? children : null} 
      </AppShell>
    </StatementsProvider>
  );
}