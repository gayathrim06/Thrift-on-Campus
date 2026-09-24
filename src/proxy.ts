import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Protect /admin routes — must be ADMIN
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/admin", req.url));
    }
    if ((session.user as any)?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect /sell and /my-listings — must be logged in
  if (pathname.startsWith("/sell") || pathname.startsWith("/my-listings")) {
    if (!session) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${pathname}`, req.url)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/sell", "/my-listings", "/profile"],
};
