"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Github, Loader2, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const searchParams = useSearchParams();
  const isVerify = searchParams.get("verify") === "1";
  const isError = searchParams.get("error") === "1";

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await signIn("resend", { email, redirect: false, callbackUrl: "/" });
      if (res?.error) toast.error("Couldn't send link. Try again.");
      else setSent(true);
    } catch { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  };

  if (sent || isVerify) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
          <CheckCircle className="w-7 h-7 text-blue-600" />
        </div>
        <h2 className="font-serif text-2xl text-ink">Check your email</h2>
        <p className="text-slate-500 text-sm">
          We sent a magic link to <strong>{email || "your email"}</strong>. Click it to sign in.
        </p>
        <p className="text-xs text-slate-400">(Check your spam folder if you don&apos;t see it.)</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {isError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 text-center">
          Something went wrong. Please try again.
        </div>
      )}

      <form onSubmit={handleEmail} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
        </div>
        <Button type="submit" className="w-full" disabled={loading || !email}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          {loading ? "Sending…" : "Send magic link"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-slate-400">or</span></div>
      </div>

      <Button variant="outline" className="w-full" onClick={() => signIn("github", { callbackUrl: "/" })}>
        <Github className="w-4 h-4" />
        Continue with GitHub
      </Button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-semibold text-ink mb-2">Welcome back</h1>
          <p className="text-slate-500 text-sm">Sign in to read and comment.</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-8">
          <Suspense fallback={<div className="h-40 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-blue-400" /></div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
