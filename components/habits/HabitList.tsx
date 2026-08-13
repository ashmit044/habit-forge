'use client';

import React, { useState } from 'react';
import { Habit, HabitCategory, RealmType, TimeOfDay } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { HabitCard } from './HabitCard';
import { Plus, Search, Filter, CheckCircle2, Sparkles, Bot, Target, Zap } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface HabitListProps {
  habits: Habit[];
  activeRealm: RealmType;
  onToggleComplete: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onOpenCreateModal: () => void;
  onOpenAICoach: () => void;
}

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  activeRealm,
  onToggleComplete,
  onEdit,
  onDelete,
  onOpenCreateModal,
  onOpenAICoach,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<TimeOfDay | 'All'>('All');
  const [filterRealmOnly, setFilterRealmOnly] = useState(false);

  const meta = REALM_DEFINITIONS[activeRealm];

  const realmHabits = habits.filter((h) => h.targetRealm === activeRealm || h.targetRealm === 'all');
  const realmCompletedCount = realmHabits.filter((h) => h.completedToday).length;

  const completedCount = habits.filter((h) => h.completedToday).length;
  const totalCount = habits.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter habits
  const filteredHabits = habits.filter((habit) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = habit.title.toLowerCase().includes(q);
      const matchDesc = habit.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    if (selectedTimeOfDay !== 'All' && habit.targetTimeOfDay !== selectedTimeOfDay && habit.targetTimeOfDay !== 'Anytime') {
      return false;
    }

    if (filterRealmOnly && habit.targetRealm !== 'all' && habit.targetRealm !== activeRealm) {
      return false;
    }

    return true;
  });

  const activeHabits = filteredHabits.filter((h) => !h.completedToday);
  const completedHabits = filteredHabits.filter((h) => h.completedToday);

  return (
    <div className="space-y-4">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Daily Missions & Realm Goals</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
              {completedCount}/{totalCount} Done
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Check off daily goals to harvest resources and evolve your selected worlds.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenAICoach();
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition-all cursor-pointer shadow-md"
          >
            <Bot className="w-4 h-4 text-violet-400" />
            <span>AI Coach</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenCreateModal();
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Set New Goal</span>
          </button>
        </div>
      </div>

      {/* Active Realm Objective Summary Bar */}
      <div
        className="p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
        style={{
          backgroundColor: `${meta.accentColor}10`,
          borderColor: `${meta.accentColor}30`,
        }}
      >
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 shrink-0" style={{ color: meta.accentColor }} />
          <div className="text-xs text-slate-200">
            <span className="font-bold text-white">{meta.name} Campaign:</span>{' '}
            <span className="text-slate-300">{meta.primaryGoalTitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 shrink-0">
          <span className="px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-800 text-[11px]">
            {realmCompletedCount}/{realmHabits.length} Realm Goals Done
          </span>
        </div>
      </div>

      {/* Daily Completion Progress Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Today&apos;s Conquered Goals</span>
          </div>
          <span className="text-emerald-400 font-bold">{completionPercentage}% Completed</span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-slate-800/90 overflow-hidden relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 relative overflow-hidden"
            style={{ width: `${completionPercentage}%` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search goals..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="w-full md:w-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {(['All', 'Morning', 'Afternoon', 'Evening'] as const).map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => {
                soundManager.playTap();
                setSelectedTimeOfDay(time);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                selectedTimeOfDay === time
                  ? 'bg-slate-800 text-white border-slate-600 shadow'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-900'
              }`}
            >
              {time}
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setFilterRealmOnly(!filterRealmOnly);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              filterRealmOnly
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-900'
            }`}
          >
            {meta.name} Only
          </button>
        </div>
      </div>

      {/* Habit List Display */}
      {filteredHabits.length === 0 ? (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-emerald-400 mx-auto opacity-60" />
          <h3 className="text-sm font-bold text-white">No goals match your filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new goal to empower {meta.name}.
          </p>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer transition-colors inline-block"
          >
            + Set Goal for {meta.name}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active / Incomplete Habits */}
          {activeHabits.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                To Complete Today ({activeHabits.length})
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {activeHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Habits */}
          {completedHabits.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <h3 className="text-xs font-bold text-emerald-400/80 uppercase tracking-wider px-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed ({completedHabits.length})
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {completedHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
