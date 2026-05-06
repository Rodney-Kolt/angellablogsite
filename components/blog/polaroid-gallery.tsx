"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PolaroidGalleryProps {
  images: string[];
  title: string;
}

const rotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-3", "rotate-3"];

export function PolaroidGallery({ images, title }: PolaroidGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center my-8">
        {images.map((url, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            className={`
              group relative bg-white p-3 pb-8 shadow-polaroid
              ${rotations[i % rotations.length]}
              hover:rotate-0 hover:scale-105 hover:shadow-girly-lg
              transition-all duration-300 cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-pink-300
            `}
            aria-label={`View image ${i + 1}`}
          >
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 overflow-hidden">
              <Image
                src={url}
                alt={`${title} - photo ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
            {/* Polaroid caption area */}
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <span className="font-handwriting text-xs text-pink-400">
                {i === 0 ? "✨" : i === 1 ? "🌸" : i === 2 ? "💕" : "🎀"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            <div className="bg-white p-4 pb-12 shadow-2xl">
              <div className="relative w-full aspect-square sm:aspect-video">
                <Image
                  src={images[lightboxIndex]}
                  alt={`${title} - photo ${lightboxIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="font-handwriting text-center text-pink-400 mt-2 text-sm">
                {lightboxIndex + 1} / {images.length}
              </p>
            </div>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setLightboxIndex(
                      (lightboxIndex - 1 + images.length) % images.length
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-girly hover:scale-110 transition-transform"
                >
                  <ChevronLeft className="w-5 h-5 text-pink-500" />
                </button>
                <button
                  onClick={() =>
                    setLightboxIndex((lightboxIndex + 1) % images.length)
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-girly hover:scale-110 transition-transform"
                >
                  <ChevronRight className="w-5 h-5 text-pink-500" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
