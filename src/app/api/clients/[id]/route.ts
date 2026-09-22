import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireStaff, requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// PUT /api/clients/[id] (Admin edits client)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireStaff(req);
  if (error) return error;

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

    const body = await req.json();
    const { name, category, badge, logoUrl, sortOrder, isActive } = body;

    const updated = await db.client.update({
      where: { id },
      data: {
        ...(name && { name: String(name).trim().slice(0, 100) }),
        ...(category && { category: String(category).trim().slice(0, 50) }),
        ...(badge && { badge: String(badge).trim().slice(0, 50) }),
        ...(logoUrl !== undefined && { logoUrl: logoUrl ? String(logoUrl).slice(0, 300) : null }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ client: updated });
  } catch (err) {
    console.error("Failed to update client:", err);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}

// DELETE /api/clients/[id] (Admin deletes client)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

    await db.client.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Client removed successfully" });
  } catch (err) {
    console.error("Failed to delete client:", err);
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}