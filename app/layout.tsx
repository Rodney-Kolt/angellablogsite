import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout/navbar";
import { ToastProvider } from "@/components/ui/toast";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: { default: "Coastal Journal ✦", template: "%s · Coastal Journal" },
  description: "A personal digital scrapbook — memories, thoughts, and little joys by the sea.",
  keywords: ["blog", "journal", "scrapbook", "personal", "coastal"],
  openGraph: {
    type: "website",
    siteName: "Coastal Journal",
    title: "Coastal Journal ✦",
    description: "A personal digital scrapbook — memories, thoughts, and little joys by the sea.",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-aqua-100 text-navy antialiased">
        <SessionProvider session={session}>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>

          {/* Footer */}
          <footer className="mt-20 py-10 border-t border-dashed border-aqua-300 bg-white/50">
            <div className="container mx-auto px-4 text-center">
              <p className="font-heading text-2xl text-coral-400 mb-1">xoxo ✦</p>
              <p className="font-body text-sm text-navy-muted">
                made with love & sea breeze · {new Date().getFullYear()}
              </p>
            </div>
          </footer>

          <ToastProvider />
        </SessionProvider>
      </body>
    </html>
  );
}
