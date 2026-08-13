'use client';

import React from 'react';
import { Habit } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { Check, Flame, MoreVertical, Trash2, Edit2, Clock } from 'lucide-react';
import { soundManager } from '@/lib/sound';
import confetti from 'canvas-confetti';

interface HabitCardProps {
  habit: Habit;
  onToggleComplete: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const meta = habit.targetRealm !== 'all' ? REALM_DEFINITIONS[habit.targetRealm] : null;

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!habit.completedToday) {
      soundManager.playCheck();
      confetti({
        particleCount: 20,
        spread: 45,
        origin: {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        },
        colors: [meta?.accentColor || '#10b981', '#ffffff', '#fbbf24'],
        disableForReducedMotion: true,
      });
    } else {
      soundManager.playTap();
    }
    onToggleComplete(habit.id);
  };

  const difficultyColors = {
    Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Medium: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    Hard: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Epic: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div
      className={`group p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
        habit.completedToday
          ? 'bg-[#121215]/60 border-[#27272a] opacity-75'
          : 'bg-[#141418] hover:bg-[#18181d] border-[#27272a] hover:border-[#3f3f46]'
      }`}
    >
      {/* Checkbox & Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={handleCheck}
          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer shrink-0 border ${
            habit.completedToday
              ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-sm'
              : 'border-[#3f3f46] bg-[#18181b] hover:border-emerald-500 text-transparent'
          }`}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold truncate ${
                habit.completedToday ? 'line-through text-[#71717a]' : 'text-[#f4f4f5]'
              }`}
            >
              {habit.title}
            </span>

            {/* Target Realm Badge */}
            {meta && (
              <span
                className="text-[9px] px-1.5 py-0.2 rounded font-medium shrink-0 border"
                style={{
                  color: meta.accentColor,
                  borderColor: `${meta.accentColor}30`,
                  backgroundColor: `${meta.accentColor}10`,
                }}
              >
                {meta.name.split(' ')[0]}
              </span>
            )}
          </div>

          {habit.description && (
            <p className="text-[11px] text-[#71717a] truncate mt-0.5">
              {habit.description}
            </p>
          )}
        </div>
      </div>

      {/* Metadata Tags & Streak */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Difficulty Badge */}
        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium hidden sm:inline ${difficultyColors[habit.difficulty]}`}>
          {habit.difficulty}
        </span>

        {/* Streak Counter */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-xs font-medium text-[#f4f4f5]">
          <Flame className={`w-3 h-3 ${habit.streak > 0 ? 'text-amber-400 fill-amber-400' : 'text-[#71717a]'}`} />
          <span>{habit.streak}d</span>
        </div>

        {/* Actions (Edit / Delete) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playTap();
              onEdit(habit);
            }}
            className="p-1 rounded text-[#a1a1aa] hover:text-white hover:bg-[#27272a] transition-colors cursor-pointer"
            title="Edit Goal"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(habit.id);
            }}
            className="p-1 rounded text-[#a1a1aa] hover:text-red-400 hover:bg-[#27272a] transition-colors cursor-pointer"
            title="Delete Goal"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
