"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_PASSWORD, DEMO_USERNAME, isSignedIn, signIn } from "@/lib/auth";

function SignInForm() {
  const router = useRouter();
  const fromSignup = useSearchParams().get("from") === "signup";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { if (isSignedIn()) router.replace("/dashboard"); }, [router]);

  function submit(e: React.SubmitEvent) {
    e.preventDefault();
    if (signIn(username.trim(), password)) router.push("/dashboard");
    else setError("That username and password don't match. Check them and try again.");
  }

  return (
    <AuthShell title="Sign in" description="Welcome back. Sign in to see your financial health." footer={<>New to Smart Flow? <Link href="/signup" className="font-semibold text-[var(--ink)] underline underline-offset-4">Create an account</Link></>}>
      {fromSignup && <p className="mb-4 rounded-2xl bg-[#e9dfd2] p-3 text-sm leading-6" role="status">Thanks. Accounts aren&apos;t created in this demo yet, so sign in with the demo login below.</p>}
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="flex flex-col gap-3">
          <Label htmlFor="username">Username</Label>
          <Input id="username" autoComplete="username" value={username} onChange={(e) => { setUsername(e.target.value); setError(""); }} required />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} required aria-describedby={error ? "signin-error" : undefined} />
        </div>
        {error && <p id="signin-error" role="alert" className="text-sm font-medium text-[#8a2a16]">{error}</p>}
        <Button type="submit" size="lg" className="w-full">Sign in</Button>
      </form>
      <div className="mt-5 rounded-2xl border border-dashed border-[var(--line)] p-3 text-sm leading-6 text-muted">
        Demo login: <strong className="text-foreground/85">{DEMO_USERNAME}</strong> / <strong className="text-foreground/85">{DEMO_PASSWORD}</strong>
        <button type="button" onClick={() => { setUsername(DEMO_USERNAME); setPassword(DEMO_PASSWORD); setError(""); }} className="ml-2 font-semibold text-foreground underline underline-offset-4">Fill in</button>
      </div>
    </AuthShell>
  );
}

export default function SignInPage() {
  return <Suspense><SignInForm /></Suspense>;
}
