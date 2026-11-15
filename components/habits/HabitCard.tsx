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
    Easy: 'text-[#a9c49b] bg-[#7fa57a]/10 border-[#7fa57a]/25',
    Medium: 'text-[#b9bba5] bg-[#929783]/10 border-[#929783]/25',
    Hard: 'text-[#d7bd83] bg-[#c8a96c]/10 border-[#c8a96c]/25',
    Epic: 'text-[#d6b8a7] bg-[#b8876d]/10 border-[#b8876d]/25',
  };

  return (
    <div
      className={`group p-3.5 rounded-md border transition-colors flex items-center justify-between gap-3 ${
        habit.completedToday
          ? 'bg-[#19221b] border-[#354033] opacity-75'
          : 'bg-[#1c261e] hover:bg-[#222d23] border-[#354033] hover:border-[#59624b]'
      }`}
    >
      {/* Checkbox & Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={handleCheck}
          aria-label={`${habit.completedToday ? 'Mark incomplete' : 'Complete'}: ${habit.title}`}
          aria-pressed={habit.completedToday}
          className={`w-6 h-6 rounded-sm flex items-center justify-center transition-colors cursor-pointer shrink-0 border ${
            habit.completedToday
              ? 'bg-[#9db28c] border-[#b6c6a2] text-[#171b14] shadow-sm'
              : 'border-[#59624b] bg-[#19221b] hover:border-[#c8a96c] text-transparent'
          }`}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold truncate ${
                habit.completedToday ? 'line-through text-[#929783]' : 'text-[#eee9d9]'
              }`}
            >
              {habit.title}
            </span>

            {/* Target Realm Badge */}
            {meta && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-sm font-medium shrink-0 border"
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
            <p className="text-xs text-[#929783] truncate mt-1">
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
        <div className="flex items-center gap-1 px-2 py-1 rounded-sm bg-[#202a21] border border-[#354033] text-xs font-medium text-[#c0c0a9]">
          <Flame className={`w-3 h-3 ${habit.streak > 0 ? 'text-[#c8a96c] fill-[#c8a96c]' : 'text-[#929783]'}`} />
          <span>{habit.streak}d</span>
        </div>

        {/* Actions (Edit / Delete) */}
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playTap();
              onEdit(habit);
            }}
            aria-label={`Edit ${habit.title}`}
            className="p-1.5 rounded text-[#b9bba5] hover:text-[#eee9d9] hover:bg-[#30392d] focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c8a96c] transition-colors cursor-pointer"
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
            aria-label={`Delete ${habit.title}`}
            className="p-1.5 rounded text-[#b9bba5] hover:text-[#e7a394] hover:bg-[#30392d] focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c8a96c] transition-colors cursor-pointer"
            title="Delete Goal"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
