import { NextResponse } from 'next/server';
import { AIAssistant } from '@/lib/ai-assistant';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, query, streak, activeRealm } = body;

    if (action === 'brief') {
      const hour = new Date().getHours();
      const brief = AIAssistant.getMotivationalBrief(hour, streak || 0, activeRealm || 'garden');
      return NextResponse.json({ success: true, brief });
    }

    if (action === 'breakdown') {
      const breakdown = AIAssistant.breakdownGoal(query || 'Productivity habit');
      return NextResponse.json({ success: true, breakdown });
    }

    if (action === 'generate') {
      const suggestions = AIAssistant.generateSmartSuggestions(query || 'fitness');
      return NextResponse.json({ success: true, suggestions });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'AI processing failed' }, { status: 500 });
  }
}
