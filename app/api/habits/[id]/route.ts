import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const habit = await db.habit.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        difficulty: body.difficulty,
        targetTimeOfDay: body.targetTimeOfDay,
        targetRealm: body.targetRealm,
        scheduledDays: body.scheduledDays ? JSON.stringify(body.scheduledDays) : undefined,
      },
    });
    return NextResponse.json({ success: true, habit });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update habit' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.habit.update({
      where: { id },
      data: { archived: true },
    });
    return NextResponse.json({ success: true, message: 'Habit archived' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete habit' }, { status: 500 });
  }
}
