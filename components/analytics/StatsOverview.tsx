'use client';

import React from 'react';
import { UserProfile, RealmProgression, RealmType } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { Trophy, Flame, Zap, ShieldCheck, Target, Sparkles } from 'lucide-react';

interface StatsOverviewProps {
  user: UserProfile;
  realms: Record<RealmType, RealmProgression>;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ user, realms }) => {
  const activeMeta = REALM_DEFINITIONS[user.activeRealm];
  const activeProg = realms[user.activeRealm];

  const statCards = [
    {
      title: 'Master Level',
      value: `Level ${user.level}`,
      subtitle: `${user.xp} / ${user.xpToNextLevel} Total XP`,
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      borderColor: 'border-amber-500/30',
    },
    {
      title: 'Current Streak',
      value: `${user.longestStreakEver} Days`,
      subtitle: `${user.multiplier.toFixed(1)}x XP Multiplier`,
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      borderColor: 'border-orange-500/30',
    },
    {
      title: 'Habits Conquered',
      value: `${user.totalHabitsCompleted}`,
      subtitle: 'Across all 5 virtual realms',
      icon: <Target className="w-5 h-5 text-emerald-400" />,
      borderColor: 'border-emerald-500/30',
    },
    {
      title: 'Active Realm Stage',
      value: `Stage ${activeProg.growthStage}/5`,
      subtitle: activeMeta.name,
      icon: <Zap className="w-5 h-5" style={{ color: activeMeta.accentColor }} />,
      borderColor: 'border-blue-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {statCards.map((stat, idx) => (
        <div
          key={idx}
          className={`glass-panel p-4 rounded-2xl border ${stat.borderColor} flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">{stat.title}</span>
            <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              {stat.icon}
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-white tracking-tight">{stat.value}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{stat.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
