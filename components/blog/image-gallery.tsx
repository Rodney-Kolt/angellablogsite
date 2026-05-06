"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-3 my-8">
        {images.map((url, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            className="group relative overflow-hidden rounded-sm border border-slate-700 hover:border-hoop-orange/60 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-hoop-orange"
            aria-label={`View image ${i + 1}`}
          >
            <div className="relative w-36 h-36 sm:w-44 sm:h-44">
              <Image
                src={url}
                alt={`${title} - photo ${i + 1}`}
                fill
                className="object-cover brightness-90 group-hover:brightness-100 transition-all duration-300"
              />
              {/* Orange overlay on hover */}
              <div className="absolute inset-0 bg-hoop-orange/0 group-hover:bg-hoop-orange/10 transition-all duration-300" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute -top-10 right-0 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="border border-slate-700 rounded-sm overflow-hidden">
              <div className="relative w-full aspect-video">
                <Image
                  src={images[lightboxIndex]}
                  alt={`${title} - photo ${lightboxIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="bg-slate-900 px-4 py-2 flex items-center justify-between">
                <span className="font-body text-xs text-slate-600 uppercase tracking-wider">
                  {lightboxIndex + 1} / {images.length}
                </span>
                <div className="h-0.5 w-16 bg-gradient-to-r from-hoop-orange to-transparent" />
              </div>
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-900/90 border border-slate-700 rounded-sm p-2 hover:border-hoop-orange/60 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-300" />
                </button>
                <button
                  onClick={() =>
                    setLightboxIndex((lightboxIndex + 1) % images.length)
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900/90 border border-slate-700 rounded-sm p-2 hover:border-hoop-orange/60 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
