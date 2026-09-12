import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/leads (Admin lead list)
export async function GET(req: NextRequest) {
  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ leads });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

// POST /api/leads (Customer quote / inquiry form or mobile app)
export async function POST(req: NextRequest) {
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
        name,
        phone,
        email: email || null,
        serviceType: serviceType || "General Inquiry",
        message: message || null,
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json({ error: "Failed to submit lead" }, { status: 500 });
  }
}

// PATCH /api/leads (Admin updates lead status)
export async function PATCH(req: NextRequest) {
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
  } catch (error) {
    console.error("Update lead error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}