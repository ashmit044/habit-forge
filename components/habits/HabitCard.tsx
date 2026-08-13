'use client';

import React from 'react';
import { Habit } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { Check, Flame, MoreVertical, Edit2, Trash2, Clock, Sparkles } from 'lucide-react';
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
  const [showMenu, setShowMenu] = React.useState(false);

  const getDifficultyXP = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 15;
      case 'Medium':
        return 25;
      case 'Hard':
        return 45;
      case 'Epic':
        return 80;
      default:
        return 20;
    }
  };

  const xpReward = getDifficultyXP(habit.difficulty);
  const realmMeta = habit.targetRealm !== 'all' ? REALM_DEFINITIONS[habit.targetRealm] : null;

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!habit.completedToday) {
      soundManager.playCheck();
      // Trigger mini celebratory confetti burst
      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.75 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'],
        });
      } catch {
        // Fallback gracefully
      }
    } else {
      soundManager.playTap();
    }
    onToggleComplete(habit.id);
  };

  return (
    <div
      className={`group relative p-4 rounded-2xl border transition-all duration-300 select-none ${
        habit.completedToday
          ? 'bg-slate-900/40 border-emerald-500/30 opacity-75'
          : 'bg-slate-900/75 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 shadow-lg hover:shadow-xl'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Interactive Checkbox */}
        <button
          type="button"
          onClick={handleCheck}
          className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
            habit.completedToday
              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105'
              : 'border-2 border-slate-600 hover:border-emerald-400 bg-slate-800/80 hover:bg-slate-700/80 text-transparent hover:text-emerald-400/40'
          }`}
        >
          <Check className={`w-5 h-5 stroke-[3] transition-transform ${habit.completedToday ? 'scale-100' : 'scale-75'}`} />
        </button>

        {/* Habit Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`text-sm font-bold truncate transition-colors ${
                habit.completedToday ? 'line-through text-slate-400' : 'text-slate-100 group-hover:text-white'
              }`}
            >
              {habit.title}
            </h3>

            {/* Target Realm Badge */}
            {realmMeta ? (
              <span
                className="text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1"
                style={{
                  backgroundColor: `${realmMeta.accentColor}20`,
                  color: realmMeta.accentColor,
                  border: `1px solid ${realmMeta.accentColor}30`,
                }}
              >
                <span>{realmMeta.name.split(' ')[0]}</span>
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Universal
              </span>
            )}
          </div>

          {habit.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {habit.description}
            </p>
          )}

          {/* Meta Badges: Difficulty, Time of Day, Streaks, XP */}
          <div className="flex items-center gap-2.5 mt-2.5 flex-wrap text-xs">
            {/* Streak Counter */}
            <div className="flex items-center gap-1 font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
              <Flame className="w-3.5 h-3.5 fill-orange-400/40" />
              <span>{habit.streak}d streak</span>
            </div>

            {/* XP Gain */}
            <div className="flex items-center gap-1 text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>+{xpReward} XP</span>
            </div>

            {/* Time of Day */}
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{habit.targetTimeOfDay}</span>
            </div>

            {/* Category */}
            <span className="text-[11px] text-slate-400 font-medium">
              &bull; {habit.category}
            </span>
          </div>
        </div>

        {/* Options Menu Button */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 z-30 w-32 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1 animate-fadeIn">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onEdit(habit);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-left cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Habit</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onDelete(habit.id);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
