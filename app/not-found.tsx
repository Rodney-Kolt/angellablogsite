import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Cute illustration */}
        <div className="relative mb-8">
          <div className="text-8xl float">🌸</div>
          <div className="absolute -top-2 -right-4 text-4xl animate-bounce">
            ✨
          </div>
          <div className="absolute -bottom-2 -left-4 text-3xl animate-pulse">
            💕
          </div>
        </div>

        <h1 className="font-heading text-6xl font-bold text-pink-300 mb-2">
          404
        </h1>
        <h2 className="font-heading text-2xl text-pink-700 mb-4">
          page not found 🌙
        </h2>
        <p className="font-body text-pink-400 mb-8 leading-relaxed">
          oops! this page seems to have floated away into the clouds. maybe it
          was a dream? ☁️
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4" />
              go home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-4 h-4" />
              go back
            </Link>
          </Button>
        </div>

        <p className="font-handwriting text-pink-300 text-sm mt-8">
          "not all who wander are lost... but this page is" 🌸
        </p>
      </div>
    </div>
  );
}
