import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="font-serif text-8xl font-semibold text-blue-200 mb-4">404</p>
        <h1 className="font-serif text-2xl font-semibold text-ink mb-3">Page not found</h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/"><ArrowLeft className="w-4 h-4" />Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
