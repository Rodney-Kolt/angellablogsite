import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Bouncing basketball */}
        <div className="relative mb-8 inline-block">
          <div className="text-8xl bounce-ball inline-block select-none">🏀</div>
          {/* Shadow that squishes */}
          <div
            className="mx-auto mt-2 rounded-full bg-black/40 blur-sm animate-pulse"
            style={{ width: 60, height: 8 }}
          />
        </div>

        <h1 className="font-heading text-8xl text-hoop-orange mb-2 tracking-widest"
          style={{ textShadow: "0 0 40px rgba(249,115,22,0.4)" }}>
          404
        </h1>
        <h2 className="font-heading text-2xl text-white mb-4 tracking-widest">
          OUT OF BOUNDS
        </h2>
        <p className="font-body text-slate-500 mb-8 leading-relaxed text-sm">
          looks like this page stepped out of bounds. the ref called it — page not found.
        </p>

        {/* Court line decoration */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-hoop-orange" />
          <span className="text-hoop-orange text-xs">●</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-hoop-orange" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4" />
              Back to Court
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Link>
          </Button>
        </div>

        <p className="font-heading text-slate-700 text-xs mt-8 tracking-widest">
          "EVEN THE BEST MISS SOMETIMES" 🏀
        </p>
      </div>
    </div>
  );
}
