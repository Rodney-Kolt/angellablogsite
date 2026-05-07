import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout/navbar";
import { ToastProvider } from "@/components/ui/toast";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: { default: "Bako", template: "%s · Bako" },
  description: "A thoughtful personal blog — ideas, stories, and reflections.",
  keywords: ["blog", "writing", "journal", "personal"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXTAUTH_URL ?? "https://bako.vercel.app",
    siteName: "Bako",
    title: "Bako",
    description: "A thoughtful personal blog — ideas, stories, and reflections.",
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
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] text-ink antialiased">
        <SessionProvider session={session}>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>

          <footer className="border-t border-slate-200 bg-white py-10 mt-20">
            <div className="container mx-auto px-4 text-center">
              <p className="font-serif text-lg text-blue-600 mb-1">Bako</p>
              <p className="text-sm text-slate-400">
                A place for thoughts worth keeping · {new Date().getFullYear()}
              </p>
            </div>
          </footer>

          <ToastProvider />
        </SessionProvider>
      </body>
    </html>
  );
}
