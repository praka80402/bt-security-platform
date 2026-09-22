import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireStaff } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { error } = await requireStaff(req);
  if (error) return error;

  try {
    const body = await req.json();
    const { type, customerName, companyName, phone, email, address, subTotal, discount, taxAmount, totalAmount, notes, terms, items } = body;

    const maxAttempts = 5;
    let newQuotation;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const last = await db.quotation.findFirst({
        orderBy: { id: "desc" }, select: { id: true },
      });
      const nextId = (last?.id ?? 0) + 1 + attempt;
      const quotationNo = `YE-QT-${new Date().getFullYear()}-${String(nextId).padStart(3, '0')}`;

      try {
        newQuotation = await db.quotation.create({
          data: {
            quotationNo,
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
        break; // Success
      } catch (err: any) {
        if (err?.code === "P2002") continue; // taken, try next
        throw err;
      }
    }

    if (!newQuotation) {
      throw new Error("Could not allocate a unique quotation number");
    }

    return NextResponse.json({ success: true, quotation: newQuotation });
  } catch (err) {
    console.error('Error creating quotation:', err);
    return NextResponse.json({ success: false, error: 'Failed to save quotation' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { error } = await requireStaff(req);
  if (error) return error;

  try {
    const quotations = await db.quotation.findMany({ 
      orderBy: { createdAt: 'desc' },
      take: 500
    });
    return NextResponse.json({ success: true, quotations });
  } catch (err) {
    console.error('Error fetching quotations:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch quotations' }, { status: 500 });
  }
}
