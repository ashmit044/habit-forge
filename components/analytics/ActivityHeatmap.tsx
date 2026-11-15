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
    if (count === 0) return 'bg-[#141b15] border-[#30392d] text-[#929783]';
    if (count === 1) return 'bg-[#354b38] border-[#52684d] text-[#c0c0a9]';
    if (count === 2) return 'bg-[#506b4d] border-[#718565] text-[#eee9d9]';
    if (count === 3) return 'bg-[#789269] border-[#96a882] text-[#171b14]';
    return 'bg-[#c8a96c] border-[#d7bd83] text-[#171b14] font-bold';
  };

  return (
    <section className="p-4 sm:p-5 rounded-md studio-panel space-y-4" aria-labelledby="consistency-heading">
      {/* Header & Metrics */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-[#9db28c]" />
          <div>
            <p className="journal-kicker">Your rhythm</p>
            <h2 id="consistency-heading" className="journal-heading text-lg">Six-week record</h2>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1 text-[#c0c0a9]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#9db28c]" />
            <span>{totalCompletions} Total Done</span>
          </div>
          <div className="flex items-center gap-1 text-[#f4f4f5]">
            <Flame className="w-3.5 h-3.5 text-[#c8a96c]" />
            <span>{currentStreak}d Streak</span>
          </div>
        </div>
      </div>

      {/* Grid of 42 Days */}
      <div className="grid grid-cols-7 gap-1.5 pt-1">
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`h-8 rounded-sm border flex flex-col items-center justify-center text-[10px] transition-colors cursor-default group relative ${getIntensityClass(
              day.count
            )}`}
          >
            <span>{day.dayNum}</span>

            {/* Subtle Hover Tooltip */}
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 px-2 py-1 rounded-sm bg-[#202a21] border border-[#59624b] text-[10px] whitespace-nowrap text-[#eee9d9] shadow-lg">
              {day.dateStr}: {day.count} habits ({day.xp} XP)
            </div>
          </div>
        ))}
      </div>

      {/* Intensity Legend */}
      <div className="flex items-center justify-between text-[11px] text-[#929783] pt-1">
        <span>Less consistent</span>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#141b15] border border-[#30392d]" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#354b38] border border-[#52684d]" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#506b4d] border border-[#718565]" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#789269] border border-[#96a882]" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#c8a96c] border border-[#d7bd83]" />
        </div>
        <span>More consistent</span>
      </div>
    </section>
  );
};
