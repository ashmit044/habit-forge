import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { validateNewHabit } from '@/lib/habit-validation';

export async function GET() {
  try {
    const habits = await db.habit.findMany({
      where: { archived: false },
      orderBy: { createdAt: 'desc' },
      include: { logs: true },
    });
    return NextResponse.json({ success: true, habits });
  } catch (error) {
    // If Postgres is not connected or during offline fallback, return empty list or handle gracefully
    return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 200 });
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Request body must be valid JSON' }, { status: 400 });
  }

  const validation = validateNewHabit(body);
  if (!validation.success) {
    return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
  }

  try {
    const habit = await db.habit.create({
      data: {
        ...validation.data,
        scheduledDays: JSON.stringify(validation.data.scheduledDays),
      },
    });
    return NextResponse.json({ success: true, habit }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create habit' }, { status: 500 });
  }
}
