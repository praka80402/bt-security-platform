import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSession, getClientIp, setSessionCookie, type AuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

type Attempt = { count: number; firstAt: number };
const attempts = new Map<string, Attempt>();

function isRateLimited(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (Date.now() - entry.firstAt > WINDOW_MS) { attempts.delete(key); return false; }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(key: string): void {
  const entry = attempts.get(key);
  if (!entry || Date.now() - entry.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: Date.now() });
    return;
  }
  entry.count += 1;
}

// Memory cleanup for rate limit map
setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS;
  attempts.forEach((entry, key) => {
    if (entry.firstAt < cutoff) attempts.delete(key);
  });
}, WINDOW_MS).unref?.();

// Dummy hash to burn equal CPU time on invalid email
const DUMMY_HASH = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" }, { status: 400 });
    }

    const rateKey = `${getClientIp(req) ?? "unknown"}:${String(email).toLowerCase()}`;
    if (isRateLimited(rateKey)) {
      return NextResponse.json(
        { error: "Too many failed attempts. Please try again in 15 minutes." },
        { status: 429 });
    }

    const user = await db.adminUser.findUnique({
      where: { email: String(email).trim() },
    });

    if (!user) {
      await bcrypt.compare(password, DUMMY_HASH);
      recordFailure(rateKey);
      return NextResponse.json(
        { error: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      recordFailure(rateKey);
      return NextResponse.json(
        { error: "Invalid email or password" }, { status: 401 });
    }

    attempts.delete(rateKey);

    const authUser: AuthUser = {
      id: user.id, name: user.name, email: user.email,
      role: user.role as AuthUser["role"],
    };

    const { token, expiresAt } = await createSession(authUser, req);

    const res = NextResponse.json({ success: true, token, user: authUser });
    return setSessionCookie(res, token, expiresAt);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
