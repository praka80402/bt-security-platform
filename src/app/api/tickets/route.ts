import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

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
      // Fix B1: Ticket tracking leaks the whole customer table
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 10) {
        return NextResponse.json(
          { error: "Please enter your full 10-digit phone number" }, { status: 400 });
      }
      const tickets = await db.serviceTicket.findMany({
        where: { phone: phone.trim() },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
      return NextResponse.json({ tickets });
    }

    // Default: return all tickets for admin
    const { error } = await requireAuth(req, ["ADMIN", "STAFF", "TECHNICIAN"]);
    if (error) return error;

    const tickets = await db.serviceTicket.findMany({
      orderBy: { createdAt: "desc" },
      take: 500, // Fix B3: Unbounded query
    });
    return NextResponse.json({ tickets });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

// POST /api/tickets (Book Service / Repair from customer or admin)
export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth(req, ["ADMIN", "STAFF", "TECHNICIAN"]);
    const isStaff = Boolean(user); // anonymous is allowed

    const body = await req.json();
    const { 
      customerName, phone, address, city, serviceType, issueDescription,
      priority, technicianName, technicianPhone, status 
    } = body;

    if (!customerName || !phone || !address || !issueDescription) {
      return NextResponse.json(
        { error: "Customer name, phone, address, and issue description are required" },
        { status: 400 }
      );
    }

    // Fix B2: Duplicate ticket numbers & B4: Input Validation
    const maxAttempts = 5;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const last = await db.serviceTicket.findFirst({
        orderBy: { id: "desc" }, select: { id: true },
      });
      const ticketNumber = `TKT-${1001 + (last?.id ?? 0) + attempt}`;

      try {
        const ticket = await db.serviceTicket.create({
          data: {
            ticketNumber,
            customerName: String(customerName).trim().slice(0, 120),
            phone: String(phone).trim().slice(0, 20),
            address: String(address).trim().slice(0, 500),
            city: city ? String(city).trim().slice(0, 80) : "Local",
            serviceType: serviceType ? String(serviceType).slice(0, 40) : "REPAIR",
            issueDescription: String(issueDescription).slice(0, 2000),
            // these must never be settable by an anonymous caller:
            priority: isStaff && priority ? priority : "Normal",
            status: isStaff && status ? status : "PENDING",
            technicianName: isStaff && technicianName ? technicianName : null,
            technicianPhone: isStaff && technicianPhone ? technicianPhone : null,
          },
        });
        return NextResponse.json({ success: true, ticket }, { status: 201 });
      } catch (err: any) {
        if (err?.code === "P2002") continue; // taken, try the next number
        throw err;
      }
    }
    
    throw new Error("Could not allocate a unique ticket number");
  } catch (error) {
    console.error("Create ticket error:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
