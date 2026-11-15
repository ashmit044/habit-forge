'use client';

import React, { useState } from 'react';
import { Habit, RealmType, TimeOfDay } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { HabitCard } from './HabitCard';
import { Plus, Search, CheckCircle2, Bot, Target } from 'lucide-react';
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
    <div className="space-y-3.5">
      {/* Header & Quick Action Buttons */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="journal-kicker mb-1">Today’s practice</p>
          <h2 className="journal-heading text-xl sm:text-2xl flex items-center gap-2">
            <span>Daily habits</span>
            <span className="text-xs px-2 py-1 rounded-sm bg-[#202a21] border border-[#48513e] text-[#c0c0a9] font-medium font-sans">
              {completedCount}/{totalCount}
            </span>
          </h2>
          <p className="text-sm text-[#929783] mt-1">
            A little progress in {meta.name} goes a long way.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenAICoach();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold bg-[#202a21] hover:bg-[#2b352b] border border-[#48513e] text-[#c0c0a9] hover:text-[#eee9d9] transition-colors cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-[#c8a96c]" />
            <span className="hidden sm:inline">AI Coach</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenCreateModal();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold bg-[#c8a96c] hover:bg-[#d7bd83] text-[#171b14] transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Set Goal</span>
          </button>
        </div>
      </div>

      {/* Active Realm Objective Summary Bar */}
      <div className="p-3 rounded-md studio-panel flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Target className="w-3.5 h-3.5 shrink-0" style={{ color: meta.accentColor }} />
          <div className="text-xs truncate">
            <span className="font-semibold text-[#eee9d9]">{meta.name}:</span>{' '}
            <span className="text-[#b9bba5]">{meta.primaryGoalTitle}</span>
          </div>
        </div>

        <span className="text-[11px] px-2 py-1 rounded-sm bg-[#202a21] border border-[#48513e] text-[#c0c0a9] font-medium shrink-0">
          {realmCompletedCount}/{realmHabits.length} Realm Done
        </span>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search goals..."
            aria-label="Search habits"
            className="w-full pl-9 pr-3 py-2.5 rounded-md bg-[#141b15] border border-[#354033] text-sm text-[#eee9d9] placeholder-[#929783] focus:outline-none focus:border-[#9a8358]"
          />
        </div>

        {/* Filter Pills */}
        <div className="w-full sm:w-auto flex items-center gap-1 overflow-x-auto no-scrollbar">
          {(['All', 'Morning', 'Afternoon', 'Evening'] as const).map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => {
                soundManager.playTap();
                setSelectedTimeOfDay(time);
              }}
              className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                selectedTimeOfDay === time
                  ? 'bg-[#d7bd83] text-[#171b14] border-[#d7bd83]'
                  : 'bg-[#141b15] text-[#b9bba5] hover:text-[#eee9d9] border-[#354033]'
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
              aria-pressed={filterRealmOnly}
              className={`px-2.5 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
              filterRealmOnly
                ? 'bg-[#d7bd83] text-[#171b14] border-[#d7bd83]'
                : 'bg-[#141b15] text-[#b9bba5] hover:text-[#eee9d9] border-[#354033]'
            }`}
          >
            {meta.name.split(' ')[0]} Only
          </button>
        </div>
      </div>

      {/* Habit List Display */}
      {filteredHabits.length === 0 ? (
        <div className="p-8 rounded-lg studio-panel text-center space-y-2">
          <p className="text-xs text-[#71717a]">
            No goals match your active filters.
          </p>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-white cursor-pointer transition-colors"
          >
            + Set Goal for {meta.name}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Active Goals */}
          {activeHabits.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-[#929783] uppercase tracking-[0.12em] block px-1">
                To Complete ({activeHabits.length})
              </span>
              <div className="space-y-1.5">
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

          {/* Completed Goals */}
          {completedHabits.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-semibold text-[#9db28c] uppercase tracking-[0.12em] block px-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed ({completedHabits.length})
              </span>
              <div className="space-y-1.5">
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
