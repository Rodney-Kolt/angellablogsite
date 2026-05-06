import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout/navbar";
import { ToastProvider } from "@/components/ui/toast";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: {
    default: "kiro daily 🏀",
    template: "%s | kiro daily",
  },
  description:
    "a basketball player's personal digital court — raw thoughts, game recaps, and daily grind",
  keywords: ["blog", "basketball", "hoops", "journal", "personal"],
  authors: [{ name: "Kiro" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXTAUTH_URL ?? "https://kirodaily.vercel.app",
    siteName: "kiro daily",
    title: "kiro daily 🏀",
    description:
      "a basketball player's personal digital court — raw thoughts, game recaps, and daily grind",
  },
  twitter: {
    card: "summary_large_image",
    title: "kiro daily 🏀",
    description:
      "a basketball player's personal digital court — raw thoughts, game recaps, and daily grind",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased bg-[#050a0e] text-slate-100">
        <SessionProvider session={session}>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>

          {/* Footer */}
          <footer className="border-t border-slate-800 bg-[#0d0d0d] py-8 mt-16">
            <div className="container mx-auto px-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">🏀</span>
                <span className="font-heading text-xl text-hoop-orange tracking-widest">
                  KIRO DAILY
                </span>
              </div>
              <p className="font-body text-xs text-slate-500 mt-1">
                stay on the court · {new Date().getFullYear()}
              </p>
              <div className="mt-3 flex items-center justify-center gap-1">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-hoop-orange" />
                <span className="text-hoop-orange text-xs">●</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-hoop-orange" />
              </div>
            </div>
          </footer>

          <ToastProvider />
        </SessionProvider>
      </body>
    </html>
  );
}
