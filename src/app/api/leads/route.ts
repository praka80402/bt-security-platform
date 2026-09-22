import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";

// GET /api/leads (Admin lead list)
export async function GET(req: NextRequest) {
  const { error } = await requireStaff(req);
  if (error) return error;

  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 500, // B3 pagination interim
    });
    return NextResponse.json({ leads });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

// POST /api/leads (Customer quote / inquiry form or mobile app)
export async function POST(req: NextRequest) {
  // Public Endpoint
  try {
    const body = await req.json();
    const { name, phone, email, serviceType, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone number are required" },
        { status: 400 }
      );
    }

    const lead = await db.lead.create({
      data: {
        name: String(name).trim().slice(0, 100),
        phone: String(phone).trim().slice(0, 20),
        email: email ? String(email).trim().slice(0, 150) : null,
        serviceType: serviceType ? String(serviceType).slice(0, 50) : "General Inquiry",
        message: message ? String(message).slice(0, 2000) : null,
        status: "NEW", // Always hardcoded to NEW for public caller
      },
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (err) {
    console.error("Create lead error:", err);
    return NextResponse.json({ error: "Failed to submit lead" }, { status: 500 });
  }
}

// PATCH /api/leads (Admin updates lead status)
export async function PATCH(req: NextRequest) {
  const { error } = await requireStaff(req);
  if (error) return error;

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    const updated = await db.lead.update({
      where: { id: parseInt(id, 10) },
      data: { status },
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (err) {
    console.error("Update lead error:", err);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}