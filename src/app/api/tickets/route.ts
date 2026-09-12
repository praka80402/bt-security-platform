import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/tickets?phone=... OR ?ticketNumber=... OR (no query = admin list)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");
    const ticketNumber = searchParams.get("ticketNumber");

    if (ticketNumber) {
      const ticket = await db.serviceTicket.findUnique({
        where: { ticketNumber: ticketNumber.trim().toUpperCase() },
      });
      if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
      return NextResponse.json({ ticket });
    }

    if (phone) {
      const tickets = await db.serviceTicket.findMany({
        where: { phone: { contains: phone.trim() } },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ tickets });
    }

    // Default: return all tickets for admin
    const tickets = await db.serviceTicket.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ tickets });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

// POST /api/tickets (Book Service / Repair from customer or mobile app)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phone, address, city, serviceType, issueDescription } = body;

    if (!customerName || !phone || !address || !issueDescription) {
      return NextResponse.json(
        { error: "Customer name, phone, address, and issue description are required" },
        { status: 400 }
      );
    }

    // Generate unique ticket number: TKT-XXXX
    const count = await db.serviceTicket.count();
    const ticketNumber = `TKT-${1001 + count}`;

    const ticket = await db.serviceTicket.create({
      data: {
        ticketNumber,
        customerName,
        phone,
        address,
        city: city || "Local",
        serviceType: serviceType || "REPAIR",
        issueDescription,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, ticket }, { status: 201 });
  } catch (error) {
    console.error("Create ticket error:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
