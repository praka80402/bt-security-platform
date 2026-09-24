import jwt from "jsonwebtoken";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export type Role = "ADMIN" | "STAFF" | "TECHNICIAN";

export const SESSION_COOKIE = "ye_session";
const SESSION_DAYS = 7;

export interface TokenPayload {
  userId: number; email: string; role: Role; name: string;
}
export interface AuthUser {
  id: number; name: string; email: string; role: Role;
}

// Read lazily so a missing secret fails at request time, not at import time.
function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET is missing or shorter than 16 characters.");
  }
  return secret;
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/* ---------------- session lifecycle ---------------- */

export async function createSession(user: AuthUser, req?: NextRequest) {
  const payload: TokenPayload = {
    userId: user.id, email: user.email, role: user.role, name: user.name,
  };

  const token = jwt.sign(payload, getSecret(), {
    expiresIn: `${SESSION_DAYS}d`,
    jwtid: crypto.randomUUID(),
  });

  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await db.session.create({
    data: {
      tokenHash: hashToken(token),
      userId: user.id,
      userAgent: req?.headers.get("user-agent")?.slice(0, 500) ?? null,
      ipAddress: getClientIp(req) ?? null,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function destroySession(token: string) {
  await db.session.deleteMany({ where: { tokenHash: hashToken(token) } })
    .catch(() => undefined);
}

export async function destroyAllSessionsForUser(userId: number) {
  await db.session.deleteMany({ where: { userId } }).catch(() => undefined);
}

/* ---------------- reading the token ---------------- */

export function extractTokenFromHeader(header: string | null): string | null {
  if (!header) return null;
  const parts = header.split(" ");
  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") return parts[1];
  return null;
}

// Browser sends the httpOnly cookie; the mobile app sends a Bearer header.
export function getTokenFromRequest(req: NextRequest): string | null {
  const cookieToken = req.cookies.get(SESSION_COOKIE)?.value;
  if (cookieToken) return cookieToken;
  return extractTokenFromHeader(req.headers.get("authorization"));
}

export function getClientIp(req?: NextRequest): string | null {
  if (!req) return null;
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim().slice(0, 64);
  return req.headers.get("x-real-ip")?.slice(0, 64) ?? null;
}

/* ---------------- verification ---------------- */

export function verifyToken(token: string): TokenPayload | null {
  try { return jwt.verify(token, getSecret()) as TokenPayload; }
  catch { return null; }
}

// Valid signature AND a live session row AND the user still exists.
// The role comes from the database, so a role change takes effect at once.
export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  if (!verifyToken(token)) return null;

  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      id: true, expiresAt: true,
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  });

  if (!session) return null;

  if (session.expiresAt.getTime() < Date.now()) {
    await db.session.delete({ where: { id: session.id } }).catch(() => undefined);
    return null;
  }

  return session.user as AuthUser;
}

/* ---------------- the route guard ---------------- */

type GuardResult =
  | { user: AuthUser; error: null }
  | { user: null; error: NextResponse };

export async function requireAuth(
  req: NextRequest,
  roles?: Role[]
): Promise<GuardResult> {
  let user: AuthUser | null = null;
  try {
    user = await getAuthUser(req);
  } catch (err) {
    console.error("Auth check failed:", err);
    return { user: null, error: NextResponse.json(
      { error: "Authentication is not configured correctly" }, { status: 500 }) };
  }

  if (!user) {
    return { user: null, error: NextResponse.json(
      { error: "Unauthorized. Please log in." }, { status: 401 }) };
  }

  if (roles && !roles.includes(user.role)) {
    return { user: null, error: NextResponse.json(
      { error: "Forbidden. You do not have permission for this action." },
      { status: 403 }) };
  }

  return { user, error: null };
}

export const requireStaff = (req: NextRequest) => requireAuth(req, ["ADMIN", "STAFF"]);
export const requireAdmin = (req: NextRequest) => requireAuth(req, ["ADMIN"]);

/* ---------------- cookie helpers ---------------- */

export function setSessionCookie(res: NextResponse, token: string, expiresAt: Date) {
  res.cookies.set({
    name: SESSION_COOKIE, value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", expires: expiresAt,
  });
  return res;
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set({
    name: SESSION_COOKIE, value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: 0,
  });
  return res;
}

import { cookies } from 'next/headers';
export async function getAuthUserServer(): Promise<AuthUser | null> {
  const cookieToken = cookies().get(SESSION_COOKIE)?.value;
  if (!cookieToken) return null;
  if (!verifyToken(cookieToken)) return null;
  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(cookieToken) },
    select: { user: { select: { id: true, name: true, email: true, role: true } } }
  });
  if (!session?.user) return null;
  return session.user as AuthUser;
}
