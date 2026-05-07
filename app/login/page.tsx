"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Github, Loader2, CheckCircle, Waves } from "lucide-react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

function LoginForm() {
  const searchParams = useSearchParams();
  const isVerify = searchParams.get("verify") === "1";
  const isError = searchParams.get("error") === "1";

  if (isVerify) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-aqua-100 flex items-center justify-center mx-auto">
          <CheckCircle className="w-7 h-7 text-aqua-500" />
        </div>
        <h2 className="font-heading text-2xl text-navy">check your email ✦</h2>
        <p className="font-body text-navy-muted text-sm">
          we sent a magic link — click it to sign in 🌊
        </p>
        <p className="font-body text-xs text-navy-faint">(check your spam folder too)</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {isError && (
        <div className="p-3 rounded-xl bg-coral-50 border-2 border-dashed border-coral-200 text-sm text-coral-600 text-center font-body">
          something went wrong. please try again ✦
        </div>
      )}

      <EmailForm />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-aqua-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 font-body text-navy-faint">or</span>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={() => signIn("github", { callbackUrl: "/" })}>
        <Github className="w-4 h-4" />
        continue with github
      </Button>

      <p className="font-body text-xs text-navy-faint text-center leading-relaxed">
        📬 Magic link only works for the blog owner&apos;s email.<br />
        Everyone else: use GitHub to sign in.
      </p>
    </div>
  );
}

function EmailForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await signIn("resend", { email, redirect: false, callbackUrl: "/" });
      if (res?.error) {
        if (res.error === "Configuration") {
          toast.error("Email service not configured — use GitHub instead.");
        } else {
          toast.error("Magic link only works for the owner's email. Use GitHub to sign in.");
        }
      } else {
        setSent(true);
      }
    } catch {
      toast.error("Something went wrong. Try GitHub sign-in.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-3 p-4 rounded-xl bg-aqua-50 border-2 border-dashed border-aqua-200">
        <CheckCircle className="w-6 h-6 text-aqua-500 mx-auto" />
        <p className="font-body text-sm text-navy">magic link sent! check your inbox 🌊</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleEmail} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="email">email address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading || !email}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
        {loading ? "sending..." : "send magic link"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-aqua-200 flex items-center justify-center mx-auto mb-4 animate-float">
            <Waves className="w-7 h-7 text-navy" />
          </div>
          <h1 className="font-heading text-3xl text-navy mb-2">welcome back ✦</h1>
          <p className="font-body text-navy-muted text-sm">sign in to read and leave little notes 🌊</p>
        </div>
        <div className="bg-white/80 rounded-2xl border-2 border-dashed border-aqua-200 shadow-polaroid p-8">
          <Suspense fallback={<div className="h-40 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-aqua-400" /></div>}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="text-center font-handwriting text-sm text-navy-faint mt-4">by signing in, you agree to be kind ✦</p>
      </div>
    </div>
  );
}
