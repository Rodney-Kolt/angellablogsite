import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight middleware — does NOT import auth (avoids Edge runtime issues
// with Auth.js database sessions). Route protection is handled server-side
// inside each page via the auth() helper.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for session cookie (Auth.js v5 uses authjs.session-token)
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  const protectedRoutes = ["/dashboard", "/profile"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
