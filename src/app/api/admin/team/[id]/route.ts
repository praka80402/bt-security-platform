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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    const { id } = params;
    const targetId = parseInt(id);
    const body = await req.json();
    const { name, email, phone, role, staffType, salary, attendance, joiningDate, password } = body;

    const updateData: any = {};
    if (name) updateData.name = String(name).trim().slice(0, 100);
    if (email) updateData.email = String(email).trim().slice(0, 150);
    if (phone !== undefined) updateData.phone = phone || null;
    if (role) updateData.role = role;
    if (staffType) updateData.staffType = staffType;
    if (salary !== undefined) updateData.salary = salary || null;
    if (attendance !== undefined) updateData.attendance = attendance || null;
    if (joiningDate !== undefined) updateData.joiningDate = joiningDate ? new Date(joiningDate) : null;

    if (password && String(password).length >= 8) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
      await destroyAllSessionsForUser(targetId);
    }

    const updated = await db.adminUser.update({
      where: { id: targetId },
      data: updateData
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err?.code === 'P2002' ? 'Email already in use' : 'Failed to update staff' }, { status: 500 });
  }
}

