import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Proxy (Next.js 16, anciennement middleware) — Edge Runtime compatible
const { auth } = NextAuth(authConfig);

export const proxy = auth;

export const config = {
  matcher: ["/admin/:path*"],
};
