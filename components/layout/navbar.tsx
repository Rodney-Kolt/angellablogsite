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
  const [open, setOpen] = useState(false);
  const isOwner = (session?.user as { isOwner?: boolean })?.isOwner;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl font-semibold text-blue-600 hover:text-blue-700 transition-colors" onClick={() => setOpen(false)}>
          Bako
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
          <Link href="/archive" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Archive</Link>

          {session ? (
            <div className="flex items-center gap-3">
              {isOwner && (
                <Button asChild size="sm">
                  <Link href="/dashboard/new">
                    <PenLine className="w-3.5 h-3.5" />
                    Write
                  </Link>
                </Button>
              )}
              <Link href="/profile">
                <Avatar className="w-8 h-8 cursor-pointer hover:ring-blue-300 transition-all">
                  <AvatarImage src={session.user?.image ?? ""} />
                  <AvatarFallback>{getInitials(session.user?.name ?? session.user?.email ?? "?")}</AvatarFallback>
                </Avatar>
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-slate-400 hover:text-slate-600 transition-colors" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden text-slate-500 hover:text-slate-700" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 flex flex-col gap-3">
          <Link href="/" className="text-sm text-slate-600 py-1.5" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/archive" className="text-sm text-slate-600 py-1.5" onClick={() => setOpen(false)}>Archive</Link>
          {session ? (
            <>
              {isOwner && <Link href="/dashboard/new" className="text-sm text-blue-600 py-1.5" onClick={() => setOpen(false)}>✏️ Write</Link>}
              <Link href="/profile" className="text-sm text-slate-600 py-1.5" onClick={() => setOpen(false)}>Profile</Link>
              <button onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }} className="text-sm text-slate-400 py-1.5 text-left">Sign out</button>
            </>
          ) : (
            <Link href="/login" className="text-sm text-blue-600 py-1.5" onClick={() => setOpen(false)}>Sign in</Link>
          )}
        </div>
      )}
    </header>
  );
}
