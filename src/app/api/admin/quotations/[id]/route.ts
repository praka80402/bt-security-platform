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
