"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { PenLine, LogOut, Menu, X, Waves } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const isOwner = (session?.user as { isOwner?: boolean })?.isOwner;

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-dashed border-aqua-300 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <Waves className="w-5 h-5 text-aqua-400 group-hover:text-coral-400 transition-colors" />
          <span className="font-heading text-2xl text-navy group-hover:text-coral-400 transition-colors">
            Coastal Journal
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5">
          <Link href="/" className="font-body text-sm text-navy-muted hover:text-navy transition-colors">Home</Link>
          <Link href="/archive" className="font-body text-sm text-navy-muted hover:text-navy transition-colors">Archive</Link>

          {session ? (
            <div className="flex items-center gap-3">
              {isOwner && (
                <Button asChild size="sm" variant="coral">
                  <Link href="/dashboard/new">
                    <PenLine className="w-3.5 h-3.5" />
                    Write
                  </Link>
                </Button>
              )}
              <Link href="/profile">
                <Avatar className="w-8 h-8 cursor-pointer hover:ring-coral-300 transition-all">
                  <AvatarImage src={session.user?.image ?? ""} />
                  <AvatarFallback>{getInitials(session.user?.name ?? session.user?.email ?? "?")}</AvatarFallback>
                </Avatar>
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-aqua-400 hover:text-coral-400 transition-colors" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Sign in 🌊</Link>
            </Button>
          )}
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden text-navy-muted hover:text-navy" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t-2 border-dashed border-aqua-200 bg-white/95 px-4 py-4 flex flex-col gap-3">
          <Link href="/" className="font-body text-sm text-navy py-1.5" onClick={() => setOpen(false)}>🏠 Home</Link>
          <Link href="/archive" className="font-body text-sm text-navy py-1.5" onClick={() => setOpen(false)}>📚 Archive</Link>
          {session ? (
            <>
              {isOwner && <Link href="/dashboard/new" className="font-body text-sm text-coral-500 py-1.5" onClick={() => setOpen(false)}>✏️ Write</Link>}
              {isOwner && <Link href="/dashboard" className="font-body text-sm text-navy py-1.5" onClick={() => setOpen(false)}>📋 Dashboard</Link>}
              <Link href="/profile" className="font-body text-sm text-navy py-1.5" onClick={() => setOpen(false)}>👤 Profile</Link>
              <button onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }} className="font-body text-sm text-navy-muted py-1.5 text-left">🚪 Sign out</button>
            </>
          ) : (
            <Link href="/login" className="font-body text-sm text-aqua-500 py-1.5" onClick={() => setOpen(false)}>🌊 Sign in</Link>
          )}
        </div>
      )}
    </header>
  );
}
