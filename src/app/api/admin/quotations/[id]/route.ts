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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireStaff(req);
  if (error) return error;

  try {
    await db.quotation.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireStaff(req);
  if (error) return error;

  try {
    const body = await req.json();
    const { type, customerName, companyName, phone, email, address, subTotal, discount, taxAmount, totalAmount, notes, terms, items } = body;
    const qid = parseInt(params.id);

    await db.quotationItem.deleteMany({ where: { quotationId: qid } });
    
    const updated = await db.quotation.update({
      where: { id: qid },
      data: {
        type,
        customerName: String(customerName || 'Unknown Client').slice(0, 120),
        companyName: companyName ? String(companyName).slice(0, 120) : null,
        phone: String(phone || '').slice(0, 20),
        email: email ? String(email).slice(0, 120) : null,
        address: address ? String(address).slice(0, 500) : null,
        subTotal: subTotal || 0,
        discount: discount || 0,
        taxAmount: taxAmount || 0,
        totalAmount: totalAmount || 0,
        notes: notes ? String(notes).slice(0, 2000) : null,
        terms: terms ? String(terms).slice(0, 2000) : null,
        items: {
          create: items.map((item: any) => ({
            name: String(item.name).slice(0, 120),
            description: item.description ? String(item.description).slice(0, 500) : '',
            quantity: item.qty || 1,
            unitPrice: item.price || 0,
            totalPrice: (item.qty || 1) * (item.price || 0)
          }))
        }
      }
    });

    return NextResponse.json({ success: true, quotation: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
  }
}
