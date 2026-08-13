'use client';

import React from 'react';
import { DailyActivityLog } from '@/lib/types';
import { Calendar, Flame, CheckCircle2 } from 'lucide-react';

interface ActivityHeatmapProps {
  logs: DailyActivityLog[];
  totalCompletions: number;
  currentStreak: number;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  logs,
  totalCompletions,
  currentStreak,
}) => {
  // Generate last 42 days (6 weeks)
  const days: { dateStr: string; dayNum: number; count: number; xp: number }[] = [];
  const today = new Date();

  // Index logs by date
  const logsMap: Record<string, DailyActivityLog> = {};
  if (Array.isArray(logs)) {
    logs.forEach((l) => {
      logsMap[l.date] = l;
    });
  }

  for (let i = 41; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const log = logsMap[dateStr];
    days.push({
      dateStr,
      dayNum: d.getDate(),
      count: log ? log.count : 0,
      xp: log ? log.xpGained : 0,
    });
  }

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-[#18181b] border-[#27272a] text-[#71717a]';
    if (count === 1) return 'bg-emerald-950 border-emerald-800 text-emerald-300';
    if (count === 2) return 'bg-emerald-800 border-emerald-700 text-emerald-200';
    if (count === 3) return 'bg-emerald-600 border-emerald-500 text-white';
    return 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold';
  };

  return (
    <div className="p-4 rounded-xl studio-panel space-y-3">
      {/* Header & Metrics */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Consistency Heatmap (Last 6 Weeks)
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1 text-[#f4f4f5]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{totalCompletions} Total Done</span>
          </div>
          <div className="flex items-center gap-1 text-[#f4f4f5]">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentStreak}d Streak</span>
          </div>
        </div>
      </div>

      {/* Grid of 42 Days */}
      <div className="grid grid-cols-7 gap-1.5 pt-1">
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`h-8 rounded-md border flex flex-col items-center justify-center text-[10px] transition-all cursor-default group relative ${getIntensityClass(
              day.count
            )}`}
          >
            <span>{day.dayNum}</span>

            {/* Subtle Hover Tooltip */}
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 px-2 py-1 rounded bg-black border border-[#3f3f46] text-[10px] whitespace-nowrap text-white shadow">
              {day.dateStr}: {day.count} habits ({day.xp} XP)
            </div>
          </div>
        ))}
      </div>

      {/* Intensity Legend */}
      <div className="flex items-center justify-between text-[11px] text-[#71717a] pt-1">
        <span>Less consistent</span>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-[#18181b] border border-[#27272a]" />
          <div className="w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-800" />
          <div className="w-2.5 h-2.5 rounded bg-emerald-800 border border-emerald-700" />
          <div className="w-2.5 h-2.5 rounded bg-emerald-600 border border-emerald-500" />
          <div className="w-2.5 h-2.5 rounded bg-emerald-500 border border-emerald-400" />
        </div>
        <span>More consistent</span>
      </div>
    </div>
  );
};
