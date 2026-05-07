"use client";
import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          color: "#1a202c",
          fontFamily: "var(--font-inter)",
          fontSize: "14px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        },
        success: { iconTheme: { primary: "#2563eb", secondary: "#fff" } },
        error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
      }}
    />
  );
}
