"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#1e293b",
          border: "1px solid #F97316",
          borderRadius: "4px",
          color: "#F8FAFC",
          fontFamily: "var(--font-inter)",
          fontSize: "13px",
          fontWeight: "500",
          boxShadow: "0 0 20px rgba(249,115,22,0.2)",
        },
        success: {
          iconTheme: {
            primary: "#F97316",
            secondary: "#1e293b",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#1e293b",
          },
        },
      }}
    />
  );
}
