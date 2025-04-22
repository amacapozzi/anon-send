import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { routes } from "@/consts/routes";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL(routes.authRoutes.signIn, request.url)
    );
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (e) {
    return NextResponse.redirect(
      new URL(routes.authRoutes.signIn, request.url)
    );
  }
}

export const config = {
  matcher: ["/mail/:path*", "/account/:path*"],
};
