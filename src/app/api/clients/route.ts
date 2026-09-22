import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/clients (Public / Admin: fetch active clients sorted by sortOrder)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");

    const where: any = {};
    if (all === "true") {
      const { error } = await requireStaff(req); // admin view of hidden clients
      if (error) return error;
    } else {
      where.isActive = true; // public marquee
    }

    const clients = await db.client.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ clients });
  } catch (err) {
    console.error("Failed to fetch clients:", err);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

// POST /api/clients (Admin creates new client)
export async function POST(req: NextRequest) {
  const { error } = await requireStaff(req);
  if (error) return error;

  try {
    const body = await req.json();
    const { name, category, badge, logoUrl, sortOrder, isActive } = body;

    if (!name || !category || !badge) {
      return NextResponse.json(
        { error: "Client Name, Category and Badge are required" },
        { status: 400 }
      );
    }

    const client = await db.client.create({
      data: {
        name: String(name).trim().slice(0, 100),
        category: String(category).trim().slice(0, 50),
        badge: String(badge).trim().slice(0, 50),
        logoUrl: logoUrl ? String(logoUrl).slice(0, 300) : null,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ client }, { status: 201 });
  } catch (err) {
    console.error("Failed to create client:", err);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}