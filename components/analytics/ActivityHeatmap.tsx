'use client';

import React from 'react';
import { DailyActivityLog } from '@/lib/types';
import { Calendar, Flame, Sparkles } from 'lucide-react';

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
  // Sort logs by date ascending
  const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));

  const getColorClass = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-emerald-950 border-emerald-800/80 text-emerald-300';
      case 2:
        return 'bg-emerald-800 border-emerald-600 text-emerald-200';
      case 3:
        return 'bg-emerald-600 border-emerald-400 text-emerald-100';
      case 4:
        return 'bg-emerald-400 border-emerald-200 text-slate-950 shadow-[0_0_8px_rgba(52,211,153,0.6)]';
      default:
        return 'bg-slate-900/60 border-slate-800 text-slate-600';
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Momentum Heatmap</h3>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Streak: <strong className="text-white">{currentStreak} Days</strong></span>
          </div>
          <span>&bull;</span>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total: <strong className="text-white">{totalCompletions} Habits</strong></span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2 no-scrollbar">
        <div className="flex items-end gap-1.5 min-w-[400px]">
          {sortedLogs.map((log) => {
            const dateObj = new Date(log.date);
            const dateLabel = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

            return (
              <div
                key={log.date}
                className="group relative flex-1 flex flex-col items-center gap-1"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all z-30 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] text-white whitespace-nowrap pointer-events-none shadow-xl">
                  {dateLabel}: {log.count} {log.count === 1 ? 'habit' : 'habits'} (+{log.xpGained} XP)
                </div>

                <div
                  className={`w-full aspect-square rounded-md border transition-transform hover:scale-125 cursor-pointer ${getColorClass(
                    log.level
                  )}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>Past 45 Days of Action</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-800" />
          <div className="w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-800" />
          <div className="w-2.5 h-2.5 rounded bg-emerald-800 border border-emerald-600" />
          <div className="w-2.5 h-2.5 rounded bg-emerald-600 border border-emerald-400" />
          <div className="w-2.5 h-2.5 rounded bg-emerald-400 border border-emerald-200" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
