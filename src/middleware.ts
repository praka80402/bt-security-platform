import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "ye_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  if (pathname === "/admin/login") return NextResponse.next();
  
  const hasCookie = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
  
  if (!hasCookie) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
