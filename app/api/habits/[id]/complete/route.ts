import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const habit = await db.habit.findUnique({ where: { id } });
    if (!habit) {
      return NextResponse.json({ success: false, error: 'Habit not found' }, { status: 404 });
    }

    const xpEarned = habit.difficulty === 'Epic' ? 80 : habit.difficulty === 'Hard' ? 45 : habit.difficulty === 'Medium' ? 25 : 15;
    const coinsEarned = 5;
    const realmPointsEarned = Math.round(xpEarned * 0.8);

    // Create completion log
    const log = await db.habitLog.create({
      data: {
        habitId: habit.id,
        xpEarned,
        coinsEarned,
        realmPointsEarned,
        realm: habit.targetRealm,
      },
    });

    // Update habit streak and completions
    const updatedHabit = await db.habit.update({
      where: { id },
      data: {
        streak: habit.streak + 1,
        longestStreak: Math.max(habit.longestStreak, habit.streak + 1),
        totalCompletions: habit.totalCompletions + 1,
      },
    });

    return NextResponse.json({
      success: true,
      log,
      habit: updatedHabit,
      xpEarned,
      coinsEarned,
      realmPointsEarned,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to complete habit' }, { status: 500 });
  }
}
