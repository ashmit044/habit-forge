import { NextResponse } from 'next/server';
import db from '@/lib/db';

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
  try {
    const body = await req.json();
    const habit = await db.habit.create({
      data: {
        title: body.title,
        description: body.description || '',
        category: body.category || 'Health',
        difficulty: body.difficulty || 'Medium',
        targetTimeOfDay: body.targetTimeOfDay || 'Morning',
        targetRealm: body.targetRealm || 'all',
        frequency: body.frequency || 'daily',
        scheduledDays: JSON.stringify(body.scheduledDays || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
        color: body.color || '#10b981',
        icon: body.icon || 'Flame',
      },
    });
    return NextResponse.json({ success: true, habit });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create habit' }, { status: 500 });
  }
}
