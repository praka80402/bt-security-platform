import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { requireAdmin, destroyAllSessionsForUser } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await requireAdmin(req);
  if (error) return error;

  try {
    const { id } = params;
    const targetId = parseInt(id);
    
    if (targetId === 1) {
       return NextResponse.json({ success: false, error: 'Cannot delete the primary Super Admin' }, { status: 403 });
    }
    if (targetId === user.id) {
       return NextResponse.json({ success: false, error: 'Cannot delete your own account' }, { status: 403 });
    }

    await db.adminUser.delete({
      where: { id: targetId }
    });
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    const { id } = params;
    const targetId = parseInt(id);
    const body = await req.json();
    const { password } = body;

    if (!password || String(password).length < 8) {
       return NextResponse.json({ success: false, error: 'New password must be at least 8 characters long' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.adminUser.update({
      where: { id: targetId },
      data: { passwordHash: hashedPassword }
    });

    await destroyAllSessionsForUser(targetId);
    
    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
