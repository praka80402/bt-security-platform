import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// PUT /api/clients/[id] (Admin edits client)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
        ...(name && { name: name.trim() }),
        ...(category && { category: category.trim() }),
        ...(badge && { badge: badge.trim() }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ client: updated });
  } catch (error) {
    console.error("Failed to update client:", error);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}

// DELETE /api/clients/[id] (Admin deletes client)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

    await db.client.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Client removed successfully" });
  } catch (error) {
    console.error("Failed to delete client:", error);
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}