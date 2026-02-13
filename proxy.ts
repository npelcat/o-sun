import { auth } from "@/lib/auth/auth";
import type { Session } from "next-auth";
import { NextResponse } from "next/server";

type RequestWithAuth = {
  auth: Session | null;
  nextUrl: URL;
};

export default auth((req: RequestWithAuth) => {
  const isLoggedIn = !!req.auth;

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api-docs/:path*",
    "/api/swagger",
  ],
};
