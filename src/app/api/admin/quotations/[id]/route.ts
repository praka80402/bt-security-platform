import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireStaff } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireStaff(req);
  if (error) return error;

  try {
    const { id } = params;
    const body = await req.json();
    const { status } = body;
    const updated = await db.quotation.update({ 
      where: { id: parseInt(id) }, 
      data: { status } 
    });

    if (status === 'ACCEPTED') {
      // Check if project ticket already exists
      const existingTicket = await db.serviceTicket.findFirst({
        where: { issueDescription: { startsWith: `[PROJECT-${updated.quotationNo}]` } }
      });

      if (!existingTicket) {
        // Auto-create Service Ticket for the project
        const last = await db.serviceTicket.findFirst({
          orderBy: { id: "desc" }, select: { id: true },
        });
        const ticketNumber = `PRJ-${1001 + (last?.id ?? 0)}`;

        await db.serviceTicket.create({
          data: {
            ticketNumber,
            customerName: updated.customerName,
            phone: updated.phone,
            address: updated.address || 'Address not provided',
            serviceType: 'PROJECT_QUOTATION',
            issueDescription: `[PROJECT-${updated.quotationNo}] Approved Quotation Execution. Total: ₹${updated.totalAmount}`,
            priority: 'Normal',
            status: 'PENDING'
          }
        });
      }
    }

    return NextResponse.json({ success: true, quotation: updated });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireStaff(req);
  if (error) return error;

  try {
    const { id } = params;
    const quotation = await db.quotation.findUnique({
      where: { id: parseInt(id) },
      include: { items: true }
    });
    if (!quotation) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, quotation });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
