import { playlist } from "@/lib/playlist";
import { MusicSection } from "@/components/music/music-section";
import { Music2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courtside Mixtape",
  description: "The tracks that keep me going on the court",
};

export default function MusicPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Music2 className="w-7 h-7 text-hoop-orange" />
        <h1 className="font-heading text-4xl text-white tracking-widest">
          COURTSIDE MIXTAPE
        </h1>
      </div>
      <p className="font-body text-xs text-slate-600 mb-8 uppercase tracking-wider">
        tracks that keep me locked in
      </p>

      {/* Court line */}
      <div className="h-px bg-gradient-to-r from-hoop-orange via-hoop-orange/50 to-transparent mb-8" />

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-sm bg-slate-900 border border-slate-800 mb-6">
        <span className="text-xl flex-shrink-0">🎧</span>
        <div>
          <p className="font-body text-sm text-slate-300">
            Click the play button to preview a track right here, or hit the Spotify icon to open it in the app.
          </p>
          <p className="font-body text-xs text-slate-600 mt-1">
            On mobile, tracks open directly in Spotify.
          </p>
        </div>
      </div>

      <MusicSection songs={playlist} compact={false} />
    </div>
  );
}
