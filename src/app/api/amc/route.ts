import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";

// GET /api/amc
export async function GET(req: NextRequest) {
  const { error } = await requireStaff(req);
  if (error) return error;

  try {
    const contracts = await db.amcContract.findMany({
      orderBy: { endDate: "asc" },
      take: 500
    });
    return NextResponse.json({ contracts });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch AMC contracts" }, { status: 500 });
  }
}

// POST /api/amc
export async function POST(req: NextRequest) {
  const { error } = await requireStaff(req);
  if (error) return error;

  try {
    const body = await req.json();
    const { customerName, companyName, phone, email, address, planType, totalCameras, totalBiometrics, amount, startDate, endDate, notes } = body;

    const maxAttempts = 5;
    let contract;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const last = await db.amcContract.findFirst({
        orderBy: { id: "desc" }, select: { id: true }
      });
      const nextId = (last?.id ?? 0) + 1 + attempt;
      const contractNumber = `AMC-${new Date().getFullYear()}-${nextId.toString().padStart(3, "0")}`;

      try {
        contract = await db.amcContract.create({
          data: {
            contractNumber,
            customerName: String(customerName).trim().slice(0, 120),
            companyName: companyName ? String(companyName).trim().slice(0, 120) : null,
            phone: String(phone).trim().slice(0, 20),
            email: email ? String(email).trim().slice(0, 150) : null,
            address: String(address).trim().slice(0, 500),
            planType: planType ? String(planType).slice(0, 40) : "Standard",
            totalCameras: totalCameras ? parseInt(totalCameras, 10) : 0,
            totalBiometrics: totalBiometrics ? parseInt(totalBiometrics, 10) : 0,
            amount: amount ? parseFloat(amount) : null,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            notes: notes ? String(notes).slice(0, 2000) : null,
            status: "ACTIVE",
          },
        });
        break; // Success
      } catch (err: any) {
        if (err?.code === "P2002") continue; // Unique constraint violation, retry
        throw err;
      }
    }

    if (!contract) {
      throw new Error("Could not allocate a unique AMC contract number");
    }

    return NextResponse.json({ success: true, contract }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create AMC contract" }, { status: 500 });
  }
}
