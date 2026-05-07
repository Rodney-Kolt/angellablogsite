"use client";

import { Suspense } from "react";
import { LoadingScreen } from "./loading-screen";

// Suspense boundary required because LoadingScreen uses useSearchParams
export function LoadingScreenWrapper() {
  return (
    <Suspense fallback={null}>
      <LoadingScreen />
    </Suspense>
  );
}
