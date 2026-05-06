import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout/navbar";
import { ToastProvider } from "@/components/ui/toast";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: {
    default: "kiro daily ✨",
    template: "%s | kiro daily",
  },
  description:
    "a dreamy digital scrapbook — daily thoughts, tiny joys, and soft moments",
  keywords: ["blog", "diary", "journal", "lifestyle", "personal"],
  authors: [{ name: "Kiro" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXTAUTH_URL ?? "https://kirodaily.vercel.app",
    siteName: "kiro daily",
    title: "kiro daily ✨",
    description:
      "a dreamy digital scrapbook — daily thoughts, tiny joys, and soft moments",
  },
  twitter: {
    card: "summary_large_image",
    title: "kiro daily ✨",
    description:
      "a dreamy digital scrapbook — daily thoughts, tiny joys, and soft moments",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Quicksand:wght@300;400;500;600;700&family=Caveat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <SessionProvider session={session}>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <footer className="border-t border-pink-100 bg-white/50 backdrop-blur-sm py-8 mt-16">
            <div className="container mx-auto px-4 text-center">
              <p className="font-handwriting text-pink-400 text-sm">
                made with 💕 by kiro · {new Date().getFullYear()}
              </p>
              <p className="font-body text-xs text-pink-300 mt-1">
                every day is a little story worth telling 🌸
              </p>
            </div>
          </footer>
          <ToastProvider />
        </SessionProvider>
      </body>
    </html>
  );
}
