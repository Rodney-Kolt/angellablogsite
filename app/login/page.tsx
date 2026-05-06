"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Mail, Github, Loader2, CheckCircle } from "lucide-react";
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
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/",
      });
      if (result?.error) {
        toast.error("couldn't send magic link 😢");
      } else {
        setSent(true);
        toast.success("magic link sent! check your email ✨");
      }
    } catch {
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = () => {
    signIn("github", { callbackUrl: "/" });
  };

  if (sent || isVerify) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="font-heading text-2xl text-pink-800">
          check your email! ✨
        </h2>
        <p className="font-body text-pink-500">
          we sent a magic link to{" "}
          <span className="font-semibold">{email || "your email"}</span>. click
          it to sign in 🌸
        </p>
        <p className="font-body text-xs text-pink-300">
          (check your spam folder if you don't see it)
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isError && (
        <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-center">
          <p className="font-body text-sm text-red-500">
            something went wrong. please try again 🌸
          </p>
        </div>
      )}

      {/* Email form */}
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">email address</Label>
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
        <Button
          type="submit"
          className="w-full"
          disabled={loading || !email}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
          {loading ? "sending..." : "send magic link ✨"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-pink-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 font-body text-pink-400">or</span>
        </div>
      </div>

      {/* GitHub */}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGitHubSignIn}
      >
        <Github className="w-4 h-4" />
        continue with github
      </Button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-pink-100 shadow-girly-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center mx-auto mb-4 shadow-girly float">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-pink-800 mb-2">
              welcome back 🌸
            </h1>
            <p className="font-body text-sm text-pink-400">
              sign in to unlock diary entries and leave notes
            </p>
          </div>

          <Suspense fallback={<div className="spinner-girly mx-auto" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center font-body text-xs text-pink-300 mt-4">
          by signing in, you agree to be a kind reader 🌸
        </p>
      </div>
    </div>
  );
}
