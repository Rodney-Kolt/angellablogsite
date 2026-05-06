"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Music2, Play, Volume2, VolumeX } from "lucide-react";
import type { Song } from "@/lib/playlist";

interface MusicSectionProps {
  songs: Song[];
  compact?: boolean; // sidebar mode
}

export function MusicSection({ songs, compact = false }: MusicSectionProps) {
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    check();
    window.matchMedia("(max-width: 768px)").addEventListener("change", check);
    return () => window.matchMedia("(max-width: 768px)").removeEventListener("change", check);
  }, []);

  const handlePlay = (song: Song) => {
    if (activeSong?.id === song.id) {
      setActiveSong(null);
      setShowEmbed(false);
    } else {
      setActiveSong(song);
      setShowEmbed(true);
    }
  };

  if (compact) {
    // Sidebar compact view
    return (
      <div className="space-y-1">
        {songs.map((song) => (
          <a
            key={song.id}
            href={song.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group p-2 rounded-sm hover:bg-slate-800 transition-colors"
          >
            <span className="text-base flex-shrink-0">{song.emoji ?? "🎵"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-body font-semibold text-slate-300 truncate group-hover:text-hoop-orange transition-colors">
                {song.title}
              </p>
              <p className="text-xs font-body text-slate-600 truncate">{song.artist}</p>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-700 group-hover:text-hoop-orange flex-shrink-0 transition-colors" />
          </a>
        ))}

        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 mt-3 px-3 py-2 rounded-sm border border-[#1DB954]/30 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span className="font-body text-xs text-[#1DB954] font-semibold uppercase tracking-wider">
            Play on Spotify
          </span>
        </a>
      </div>
    );
  }

  // Full page view
  return (
    <div className="space-y-4">
      {/* Track list */}
      <div className="space-y-2">
        {songs.map((song, i) => {
          const isActive = activeSong?.id === song.id;
          return (
            <div
              key={song.id}
              className={`
                flex items-center gap-3 p-3 rounded-sm border transition-all
                ${isActive
                  ? "border-hoop-orange/60 bg-hoop-orange/10"
                  : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                }
              `}
            >
              {/* Track number */}
              <span className="font-heading text-xs text-slate-700 w-5 text-center flex-shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Emoji */}
              <span className="text-lg flex-shrink-0">{song.emoji ?? "🎵"}</span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`font-body text-sm font-semibold truncate ${isActive ? "text-hoop-orange" : "text-slate-200"}`}>
                  {song.title}
                </p>
                <p className="font-body text-xs text-slate-600 truncate">{song.artist}</p>
              </div>

              {/* Duration */}
              {song.duration && (
                <span className="font-body text-xs text-slate-700 flex-shrink-0">
                  {song.duration}
                </span>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Play embed (desktop) or open link (mobile) */}
                {!isMobile && song.spotifyTrackId ? (
                  <button
                    onClick={() => handlePlay(song)}
                    className={`p-1.5 rounded-sm transition-colors ${
                      isActive ? "text-hoop-orange" : "text-slate-600 hover:text-hoop-orange"
                    }`}
                    title={isActive ? "Close player" : "Preview"}
                  >
                    {isActive ? <VolumeX className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                ) : null}

                <a
                  href={song.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-sm text-slate-600 hover:text-[#1DB954] transition-colors"
                  title="Open in Spotify"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Spotify embed player (desktop only, when a song is active) */}
      {showEmbed && activeSong?.spotifyTrackId && !isMobile && (
        <div className="rounded-sm overflow-hidden border border-slate-800">
          <iframe
            src={`https://open.spotify.com/embed/track/${activeSong.spotifyTrackId}?utm_source=generator&theme=0`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title={`${activeSong.title} by ${activeSong.artist}`}
          />
        </div>
      )}

      {/* Spotify playlist button */}
      <a
        href="https://open.spotify.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-sm border border-[#1DB954]/30 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 transition-colors"
      >
        <svg className="w-4 h-4 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
        <span className="font-body text-sm text-[#1DB954] font-semibold uppercase tracking-wider">
          Open Full Playlist on Spotify
        </span>
      </a>
    </div>
  );
}
