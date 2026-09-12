import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/clients (Public / Admin: fetch active clients sorted by sortOrder)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");

    const where: any = {};
    if (all !== "true") {
      where.isActive = true;
    }

    const clients = await db.client.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

// POST /api/clients (Admin creates new client)
export async function POST(req: NextRequest) {
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
        name: name.trim(),
        category: category.trim(),
        badge: badge.trim(),
        logoUrl: logoUrl || null,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    console.error("Failed to create client:", error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}