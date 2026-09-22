import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, destroySession, getTokenFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (token) await destroySession(token);
  return clearSessionCookie(
    NextResponse.json({ success: true, message: "Logged out" })
  );
}
