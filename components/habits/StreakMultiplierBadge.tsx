'use client';

import React from 'react';
import { Flame, Shield, Zap } from 'lucide-react';

interface StreakMultiplierBadgeProps {
  multiplier: number;
  streakShields: number;
  longestStreak: number;
}

export const StreakMultiplierBadge: React.FC<StreakMultiplierBadgeProps> = ({
  multiplier,
  streakShields,
  longestStreak,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Multiplier Combo Meter */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-md animate-pulse-subtle">
        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        <span>{multiplier.toFixed(1)}x XP Multiplier</span>
      </div>

      {/* Streak Shields Item */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold shadow-sm">
        <Shield className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
        <span>{streakShields} Streak {streakShields === 1 ? 'Shield' : 'Shields'}</span>
      </div>

      {/* Record Streak Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
        <Flame className="w-3.5 h-3.5 text-orange-400" />
        <span>Record: <strong className="text-white">{longestStreak}d</strong></span>
      </div>
    </div>
  );
};
