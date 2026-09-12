import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/amc
export async function GET(req: NextRequest) {
  try {
    const contracts = await db.amcContract.findMany({
      orderBy: { endDate: "asc" },
    });
    return NextResponse.json({ contracts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch AMC contracts" }, { status: 500 });
  }
}

// POST /api/amc
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, companyName, phone, email, address, planType, totalCameras, totalBiometrics, amount, startDate, endDate, notes } = body;

    const count = await db.amcContract.count();
    const contractNumber = `AMC-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, "0")}`;

    const contract = await db.amcContract.create({
      data: {
        contractNumber,
        customerName,
        companyName: companyName || null,
        phone,
        email: email || null,
        address,
        planType: planType || "Standard",
        totalCameras: totalCameras ? parseInt(totalCameras, 10) : 0,
        totalBiometrics: totalBiometrics ? parseInt(totalBiometrics, 10) : 0,
        amount: amount ? parseFloat(amount) : null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        notes: notes || null,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, contract }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create AMC contract" }, { status: 500 });
  }
}
