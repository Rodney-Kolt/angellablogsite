import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect profile route
  if (pathname.startsWith("/profile")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
