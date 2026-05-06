"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import {
  Sparkles,
  PenLine,
  LogOut,
  User,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isOwner = (session?.user as { isOwner?: boolean })?.isOwner;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-pink-100 bg-white/70 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center shadow-girly group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            kiro daily
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/"
            className="font-body text-sm text-pink-600 hover:text-pink-800 transition-colors"
          >
            home
          </Link>
          <Link
            href="/archive"
            className="font-body text-sm text-pink-600 hover:text-pink-800 transition-colors"
          >
            archive
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              {isOwner && (
                <Button asChild size="sm" variant="girly">
                  <Link href="/dashboard">
                    <PenLine className="w-3.5 h-3.5" />
                    write
                  </Link>
                </Button>
              )}
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Avatar className="w-8 h-8 cursor-pointer hover:ring-pink-400 transition-all">
                    <AvatarImage src={session.user?.image ?? ""} />
                    <AvatarFallback>
                      {getInitials(session.user?.name ?? session.user?.email ?? "?")}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-pink-400 hover:text-pink-600 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">
                <Sparkles className="w-3.5 h-3.5" />
                sign in
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-pink-500 hover:text-pink-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-pink-100 bg-white/95 backdrop-blur-md px-4 py-4 flex flex-col gap-3">
          <Link
            href="/"
            className="font-body text-sm text-pink-600 hover:text-pink-800 py-2"
            onClick={() => setMobileOpen(false)}
          >
            🏠 home
          </Link>
          <Link
            href="/archive"
            className="font-body text-sm text-pink-600 hover:text-pink-800 py-2"
            onClick={() => setMobileOpen(false)}
          >
            📚 archive
          </Link>
          {session ? (
            <>
              {isOwner && (
                <Link
                  href="/dashboard"
                  className="font-body text-sm text-pink-600 hover:text-pink-800 py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  ✏️ dashboard
                </Link>
              )}
              <Link
                href="/profile"
                className="font-body text-sm text-pink-600 hover:text-pink-800 py-2"
                onClick={() => setMobileOpen(false)}
              >
                👤 profile
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="font-body text-sm text-pink-400 hover:text-pink-600 py-2 text-left"
              >
                🚪 sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="font-body text-sm text-pink-600 hover:text-pink-800 py-2"
              onClick={() => setMobileOpen(false)}
            >
              ✨ sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
