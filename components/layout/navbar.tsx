"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { PenLine, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isOwner = (session?.user as { isOwner?: boolean })?.isOwner;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0d0d0d]/90 backdrop-blur-md">
      {/* Top orange accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-hoop-orange to-transparent" />

      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          onClick={() => setMobileOpen(false)}
        >
          <span className="text-xl group-hover:animate-bounce-ball transition-transform">
            🏀
          </span>
          <span className="font-heading text-2xl tracking-widest text-white group-hover:text-hoop-orange transition-colors">
            KIRO
            <span className="text-hoop-orange">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="font-body text-xs text-slate-400 hover:text-hoop-orange transition-colors uppercase tracking-widest"
          >
            Home
          </Link>
          <Link
            href="/archive"
            className="font-body text-xs text-slate-400 hover:text-hoop-orange transition-colors uppercase tracking-widest"
          >
            Archive
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              {isOwner && (
                <Button asChild size="sm" variant="neon">
                  <Link href="/dashboard">
                    <PenLine className="w-3.5 h-3.5" />
                    Write
                  </Link>
                </Button>
              )}
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Avatar className="w-8 h-8 cursor-pointer hover:ring-hoop-orange transition-all">
                    <AvatarImage src={session.user?.image ?? ""} />
                    <AvatarFallback>
                      {getInitials(session.user?.name ?? session.user?.email ?? "?")}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-slate-600 hover:text-hoop-orange transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-slate-400 hover:text-hoop-orange transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0d0d0d] px-4 py-4 flex flex-col gap-3">
          <Link
            href="/"
            className="font-body text-xs text-slate-400 hover:text-hoop-orange py-2 uppercase tracking-widest"
            onClick={() => setMobileOpen(false)}
          >
            🏠 Home
          </Link>
          <Link
            href="/archive"
            className="font-body text-xs text-slate-400 hover:text-hoop-orange py-2 uppercase tracking-widest"
            onClick={() => setMobileOpen(false)}
          >
            📋 Archive
          </Link>
          {session ? (
            <>
              {isOwner && (
                <Link
                  href="/dashboard"
                  className="font-body text-xs text-slate-400 hover:text-hoop-orange py-2 uppercase tracking-widest"
                  onClick={() => setMobileOpen(false)}
                >
                  ✏️ Dashboard
                </Link>
              )}
              <Link
                href="/profile"
                className="font-body text-xs text-slate-400 hover:text-hoop-orange py-2 uppercase tracking-widest"
                onClick={() => setMobileOpen(false)}
              >
                👤 Profile
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="font-body text-xs text-slate-600 hover:text-hoop-orange py-2 text-left uppercase tracking-widest"
              >
                🚪 Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="font-body text-xs text-hoop-orange py-2 uppercase tracking-widest"
              onClick={() => setMobileOpen(false)}
            >
              🏀 Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
