import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAuth(req, ["ADMIN", "STAFF", "TECHNICIAN"]);
  if (error) return error;

  try {
    const ticketId = parseInt(params.id, 10);
    if (isNaN(ticketId)) {
      return NextResponse.json({ error: "Invalid ticket ID" }, { status: 400 });
    }

    const body = await req.json();
    const { status, technicianName, technicianPhone, scheduledDate, resolutionNotes } = body;

    const updatedTicket = await db.serviceTicket.update({
      where: { id: ticketId },
      data: {
        ...(status && { status }),
        ...(technicianName !== undefined && { technicianName }),
        ...(technicianPhone !== undefined && { technicianPhone }),
        ...(scheduledDate !== undefined && { scheduledDate: scheduledDate ? new Date(scheduledDate) : null }),
        ...(resolutionNotes !== undefined && { resolutionNotes }),
      },
    });

    return NextResponse.json({ success: true, ticket: updatedTicket });
  } catch (err) {
    console.error("Update ticket error:", err);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}