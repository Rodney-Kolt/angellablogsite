"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Github, Loader2, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const searchParams = useSearchParams();
  const isVerify = searchParams.get("verify") === "1";
  const isError = searchParams.get("error") === "1";

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const result = await signIn("resend", { email, redirect: false, callbackUrl: "/" });
      if (result?.error) {
        toast.error("couldn't send magic link");
      } else {
        setSent(true);
        toast.success("magic link sent! check your email 🏀");
      }
    } catch {
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = () => signIn("github", { callbackUrl: "/" });

  if (sent || isVerify) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-sm bg-hoop-orange/20 border border-hoop-orange/40 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-hoop-orange" />
        </div>
        <h2 className="font-heading text-2xl text-white tracking-widest">
          CHECK YOUR EMAIL
        </h2>
        <p className="font-body text-slate-400 text-sm">
          we sent a magic link to{" "}
          <span className="font-semibold text-hoop-orange">{email || "your email"}</span>.
          click it to get on the court.
        </p>
        <p className="font-body text-xs text-slate-600">
          (check your spam folder if you don&apos;t see it)
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isError && (
        <div className="p-3 rounded-sm bg-red-900/30 border border-red-800 text-center">
          <p className="font-body text-sm text-red-400">
            something went wrong. try again.
          </p>
        </div>
      )}

      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            autoComplete="email"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading || !email}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          {loading ? "Sending..." : "Send Magic Link"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#1e293b] px-3 font-body text-slate-600 uppercase tracking-wider">or</span>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={handleGitHubSignIn}>
        <Github className="w-4 h-4" />
        Continue with GitHub
      </Button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1e293b] rounded-sm border border-slate-800 p-8 shadow-court">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4 float inline-block">🏀</div>
            <h1 className="font-heading text-4xl text-white mb-2 tracking-widest">
              STEP ON THE{" "}
              <span className="text-hoop-orange">COURT</span>
            </h1>
            <p className="font-body text-sm text-slate-500">
              sign in to unlock private posts and drop comments
            </p>
          </div>

          <Suspense fallback={<div className="spinner-ball mx-auto" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center font-body text-xs text-slate-700 mt-4 uppercase tracking-wider">
          play hard, stay humble 🏀
        </p>
      </div>
    </div>
  );
}
