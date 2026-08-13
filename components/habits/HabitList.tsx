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
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Daily Missions & Goals</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa] font-medium">
              {completedCount}/{totalCount}
            </span>
          </h3>
          <p className="text-xs text-[#71717a]">
            Complete goals to cultivate and expand your selected realms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenAICoach();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden sm:inline">AI Coach</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenCreateModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-neutral-200 text-black transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Set Goal</span>
          </button>
        </div>
      </div>

      {/* Active Realm Objective Summary Bar */}
      <div className="p-3 rounded-lg studio-panel border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Target className="w-3.5 h-3.5 shrink-0" style={{ color: meta.accentColor }} />
          <div className="text-xs truncate">
            <span className="font-semibold text-white">{meta.name}:</span>{' '}
            <span className="text-[#a1a1aa]">{meta.primaryGoalTitle}</span>
          </div>
        </div>

        <span className="text-[11px] px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa] font-medium shrink-0">
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
            className="w-full pl-8 pr-3 py-1.5 rounded-md bg-[#121215] border border-[#27272a] text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#3f3f46]"
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
                  ? 'bg-[#27272a] text-white border-[#3f3f46]'
                  : 'bg-[#121215] text-[#a1a1aa] hover:text-white border-[#27272a]'
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
            className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
              filterRealmOnly
                ? 'bg-[#27272a] text-white border-[#3f3f46]'
                : 'bg-[#121215] text-[#a1a1aa] hover:text-white border-[#27272a]'
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
              <span className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wider block px-1">
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
              <span className="text-[11px] font-semibold text-emerald-400/80 uppercase tracking-wider block px-1 flex items-center gap-1.5">
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
