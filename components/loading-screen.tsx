"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track route changes via pathname + searchParams
  useEffect(() => {
    // Show with 150ms delay to avoid flicker on fast navigations
    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, 150);

    // Auto-hide after 1.2s max (in case complete fires before we show)
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
    }, 1200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      // Hide immediately when new route renders
      setVisible(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#A0E7E5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        animation: "ls-fade-in 0.15s ease-out",
      }}
    >
      {/* Rolling basketball */}
      <div style={{ position: "relative", width: 120, height: 80 }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            animation: "ls-roll 1.2s ease-in-out infinite",
          }}
        >
          {/* Ball */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #ffffff 0%, #f0f0f0 100%)",
              boxShadow: "0 4px 12px rgba(30,58,95,0.2)",
              animation: "ls-spin 1.2s linear infinite",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Seam lines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid rgba(160,231,229,0.6)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: 2,
                background: "rgba(160,231,229,0.6)",
                transform: "translateY(-50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: 2,
                background: "rgba(160,231,229,0.6)",
                transform: "translateX(-50%)",
              }}
            />
          </div>
          {/* Shadow */}
          <div
            style={{
              width: 40,
              height: 8,
              borderRadius: "50%",
              background: "rgba(30,58,95,0.15)",
              margin: "4px auto 0",
              animation: "ls-shadow 1.2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* Bouncing dots */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.85)",
              animation: `ls-dot 0.9s ease-in-out ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes ls-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes ls-roll {
          0%   { transform: translateX(0px); }
          50%  { transform: translateX(64px); }
          100% { transform: translateX(0px); }
        }

        @keyframes ls-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes ls-shadow {
          0%   { transform: scaleX(1);   opacity: 0.4; }
          50%  { transform: scaleX(0.7); opacity: 0.2; }
          100% { transform: scaleX(1);   opacity: 0.4; }
        }

        @keyframes ls-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40%            { transform: scale(1.2); opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
