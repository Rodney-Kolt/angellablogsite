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
          border: "2px solid #a0e7e5",
          borderRadius: "16px",
          color: "#1E3A5F",
          fontFamily: "var(--font-quicksand)",
          fontSize: "14px",
          boxShadow: "0 4px 16px rgba(160,231,229,0.3)",
        },
        success: { iconTheme: { primary: "#a0e7e5", secondary: "#1E3A5F" } },
        error:   { iconTheme: { primary: "#ffaaa5", secondary: "#fff" } },
      }}
    />
  );
}
