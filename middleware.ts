import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

// encode secret
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

interface AdminTokenPayload extends JWTPayload {
  role: string;
}

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const token = req.cookies.get("token")?.value;

    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const adminPayload = payload as AdminTokenPayload;

      if (adminPayload.role !== "admin") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
