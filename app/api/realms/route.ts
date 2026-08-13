import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const realmStates = await db.realmState.findMany();
    return NextResponse.json({ success: true, realmStates });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { realmType, pointsToAdd, structureToAdd } = body;

    const existing = await db.realmState.findFirst({
      where: { realmType },
    });

    if (existing) {
      const updated = await db.realmState.update({
        where: { id: existing.id },
        data: {
          totalPoints: existing.totalPoints + (pointsToAdd || 0),
          resourceAmount: existing.resourceAmount + (pointsToAdd || 0),
          growthStage: Math.min(5, Math.floor((existing.totalPoints + (pointsToAdd || 0)) / 250) + 1),
        },
      });
      return NextResponse.json({ success: true, realmState: updated });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update realm' }, { status: 500 });
  }
}
