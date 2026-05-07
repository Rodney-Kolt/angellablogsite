import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Waves } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-7xl mb-5 animate-float">🌊</div>
        <h1 className="font-heading text-5xl text-aqua-400 mb-2">404</h1>
        <h2 className="font-heading text-2xl text-navy mb-3">washed away ✦</h2>
        <p className="font-body text-navy-muted text-sm mb-8 leading-relaxed">
          this page drifted out to sea. let&apos;s find our way back to shore.
        </p>
        <Button asChild variant="coral">
          <Link href="/"><ArrowLeft className="w-4 h-4" />back to shore</Link>
        </Button>
        <p className="font-handwriting text-sm text-aqua-400 mt-6">
          "not all who wander are lost... but this page is" 🌊
        </p>
      </div>
    </div>
  );
}
