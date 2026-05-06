"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid #fce7f3",
          borderRadius: "16px",
          color: "#be185d",
          fontFamily: "var(--font-quicksand)",
          fontSize: "14px",
          boxShadow:
            "0 4px 20px rgba(255, 182, 193, 0.3), 0 2px 8px rgba(216, 180, 254, 0.2)",
        },
        success: {
          iconTheme: {
            primary: "#ec4899",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#f87171",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
