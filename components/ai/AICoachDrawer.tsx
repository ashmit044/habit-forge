'use client';

import React, { useState } from 'react';
import { Habit, RealmType } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { AIAssistant, AIRecommendation, GoalBreakdown } from '@/lib/ai-assistant';
import { X, Bot, Sparkles, Plus, ArrowRight } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface AICoachDrawerProps {
  isOpen: boolean;
  activeRealm: RealmType;
  currentStreak: number;
  onClose: () => void;
  onAddHabit: (habitData: Partial<Habit>) => void;
}

export const AICoachDrawer: React.FC<AICoachDrawerProps> = ({
  isOpen,
  activeRealm,
  currentStreak,
  onClose,
  onAddHabit,
}) => {
  const [goalInput, setGoalInput] = useState('');
  const [breakdownRoadmap, setBreakdownRoadmap] = useState<GoalBreakdown | null>(null);

  if (!isOpen) return null;

  const meta = REALM_DEFINITIONS[activeRealm];
  const hour = new Date().getHours();
  const briefing = AIAssistant.getMotivationalBrief(hour, currentStreak, activeRealm);
  const suggestedHabits = AIAssistant.generateSmartSuggestions(activeRealm);

  const handleGenerateRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    soundManager.playTap();
    const roadmap = AIAssistant.breakdownGoal(goalInput.trim());
    setBreakdownRoadmap(roadmap);
  };

  const handleAddSuggestedHabit = (suggestion: AIRecommendation) => {
    soundManager.playUnlock();
    onAddHabit({
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.category,
      difficulty: suggestion.difficulty,
      targetTimeOfDay: suggestion.targetTimeOfDay,
      targetRealm: suggestion.targetRealm || activeRealm,
      frequency: 'daily',
      scheduledDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md h-full bg-[#121215] border-l border-[#27272a] p-5 shadow-2xl overflow-y-auto space-y-5 animate-slideInRight flex flex-col justify-between">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[#18181b] border border-[#27272a] text-violet-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Habit Strategist</h3>
                <span className="text-[11px] text-[#71717a]">Goal breakdown & optimization</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundManager.playTap();
                onClose();
              }}
              className="p-1.5 rounded-md text-[#a1a1aa] hover:text-white bg-[#18181b] hover:bg-[#27272a] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Daily Strategic Briefing */}
          <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#27272a] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: meta.accentColor }}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{meta.name} Daily Briefing</span>
            </div>
            <p className="text-xs text-[#f4f4f5] italic leading-relaxed">
              {briefing.quote}
            </p>
            <p className="text-[11px] text-[#71717a] pt-1 leading-normal">
              {briefing.message}
            </p>
          </div>

          {/* Goal Breakdown Assistant */}
          <div className="space-y-2.5">
            <label className="block text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider">
              Goal Breakdown Assistant
            </label>
            <form onSubmit={handleGenerateRoadmap} className="flex gap-1.5">
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="e.g. Master Full-Stack TypeScript..."
                className="flex-1 px-3 py-1.5 rounded-md bg-[#09090b] border border-[#27272a] text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#3f3f46]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-neutral-200 text-black transition-colors cursor-pointer shrink-0"
              >
                Break Down
              </button>
            </form>

            {/* Generated 4-Week Roadmap */}
            {breakdownRoadmap && (
              <div className="p-3 rounded-lg bg-[#141418] border border-[#27272a] space-y-2 mt-2">
                <span className="text-[11px] font-bold text-white block">
                  Roadmap for: &ldquo;{breakdownRoadmap.goal}&rdquo;
                </span>
                <div className="space-y-1.5 text-xs">
                  {breakdownRoadmap.milestones.map((m, idx) => (
                    <div key={idx} className="p-2 rounded bg-[#09090b] border border-[#27272a]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-emerald-400 block">Week {m.week}: {m.title}</span>
                        <span className="text-[9px] text-amber-400 font-bold">+{m.xpBonus} XP</span>
                      </div>
                      <p className="text-[11px] text-[#a1a1aa] mt-0.5">{m.actionableHabit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 1-Click Smart Habit Presets */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider block">
              Suggested Daily Habits for {meta.name}
            </span>
            <div className="space-y-1.5">
              {suggestedHabits.map((sh, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-md bg-[#141418] border border-[#27272a] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-white truncate block">{sh.title}</span>
                    <span className="text-[10px] text-[#71717a] truncate block">{sh.description}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddSuggestedHabit(sh)}
                    className="p-1.5 rounded-md bg-[#18181b] hover:bg-white hover:text-black border border-[#27272a] text-[#a1a1aa] transition-colors cursor-pointer shrink-0"
                    title="Add Habit"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#27272a] text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-md text-xs font-semibold bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
          >
            Close Strategist
          </button>
        </div>
      </div>
    </div>
  );
};
