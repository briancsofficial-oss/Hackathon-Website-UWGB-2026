"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", business: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => { setF({ ...f, [k]: e.target.value }); setError(""); };

  function submit(e: React.SubmitEvent) {
    e.preventDefault();
    if (!f.name.trim() || !f.business.trim() || !/^\S+@\S+\.\S+$/.test(f.email)) return setError("Enter your name, business name and a valid email address.");
    if (f.password.length < 8) return setError("Use a password with at least 8 characters.");
    if (f.password !== f.confirm) return setError("The passwords don't match.");
    // DEMO ONLY: nothing is saved. Real account creation replaces this redirect.
    router.push("/signin?from=signup");
  }

  return (
    <AuthShell title="Create your workspace" description="Tell us who you are, then import your bank statements." footer={<>Already have an account? <Link href="/signin" className="font-semibold text-[var(--ink)] underline underline-offset-4">Sign in</Link></>}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="flex flex-col gap-2"><Label htmlFor="name">Your name</Label><Input id="name" autoComplete="name" value={f.name} onChange={set("name")} required /></div>
        <div className="flex flex-col gap-2"><Label htmlFor="business">Business name</Label><Input id="business" autoComplete="organization" value={f.business} onChange={set("business")} required /></div>
        <div className="flex flex-col gap-2"><Label htmlFor="email">Work email</Label><Input id="email" type="email" autoComplete="email" value={f.email} onChange={set("email")} required /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete="new-password" value={f.password} onChange={set("password")} required /></div>
          <div className="flex flex-col gap-2"><Label htmlFor="confirm">Confirm password</Label><Input id="confirm" type="password" autoComplete="new-password" value={f.confirm} onChange={set("confirm")} required /></div>
        </div>
        {error && <p role="alert" className="text-sm font-medium text-[#8a2a16]">{error}</p>}
        <Button type="submit" size="lg" className="w-full">Create account</Button>
      </form>
    </AuthShell>
  );
}
