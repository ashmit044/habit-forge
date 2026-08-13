'use client';

import React, { useState } from 'react';
import { Habit, RealmType } from '@/lib/types';
import { AIAssistant, AIRecommendation, GoalBreakdown } from '@/lib/ai-assistant';
import { X, Bot, Sparkles, Wand2, Plus, Target, CheckCircle2, ArrowRight } from 'lucide-react';
import { soundManager } from '@/lib/sound';
import confetti from 'canvas-confetti';

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
  const [activeTab, setActiveTab] = useState<'coach' | 'breakdown' | 'generator'>('coach');
  const [goalQuery, setGoalQuery] = useState('');
  const [breakdownResult, setBreakdownResult] = useState<GoalBreakdown | null>(null);
  const [generatorQuery, setGeneratorQuery] = useState('');
  const [generatedHabits, setGeneratedHabits] = useState<AIRecommendation[]>([]);

  if (!isOpen) return null;

  const currentHour = new Date().getHours();
  const brief = AIAssistant.getMotivationalBrief(currentHour, currentStreak, activeRealm);

  const handleGoalBreakdown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalQuery.trim()) return;
    soundManager.playUnlock();
    const result = AIAssistant.breakdownGoal(goalQuery.trim());
    setBreakdownResult(result);
  };

  const handleGenerateHabits = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playTap();
    const results = AIAssistant.generateSmartSuggestions(generatorQuery.trim() || 'productivity');
    setGeneratedHabits(results);
  };

  const handleAdoptHabit = (rec: AIRecommendation) => {
    soundManager.playUnlock();
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } catch {}
    onAddHabit({
      title: rec.title,
      description: `${rec.description} (AI Coach: ${rec.motivation})`,
      category: rec.category,
      difficulty: rec.difficulty,
      targetTimeOfDay: rec.targetTimeOfDay,
      targetRealm: rec.targetRealm,
      scheduledDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      frequency: 'daily',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-violet-500/40 rounded-3xl p-6 shadow-[0_0_40px_rgba(139,92,246,0.2)] relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-violet-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>AI Quest Master & Habit Coach</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase">
                Active
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Personalized goal strategy, habit optimization, and realm empowerment.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950/80 border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setActiveTab('coach');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'coach'
                ? 'bg-violet-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daily Briefing
          </button>
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setActiveTab('breakdown');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'breakdown'
                ? 'bg-violet-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Goal Breakdown
          </button>
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setActiveTab('generator');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'generator'
                ? 'bg-violet-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Smart Generator
          </button>
        </div>

        {/* TAB 1: Daily Briefing */}
        {activeTab === 'coach' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="glass-panel p-5 rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-950/30 to-slate-900 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span>{brief.title}</span>
                </h3>
                <span className="text-xs text-violet-300 font-semibold px-2 py-0.5 rounded-full bg-violet-500/20">
                  {currentStreak} Day Streak
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{brief.message}</p>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-violet-500/20 text-xs text-violet-200 italic">
                {brief.quote}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Coach Pro-Tips
              </h4>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Stack new habits directly onto existing morning coffee or evening routines.</li>
                <li>Never allow two missed days in a row; use your Streak Aegis Shield on rough days.</li>
                <li>Allocate high-difficulty habits to your favorite realm for massive growth spurts.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: Goal Breakdown */}
        {activeTab === 'breakdown' && (
          <div className="space-y-4 animate-fadeIn">
            <form onSubmit={handleGoalBreakdown} className="flex gap-2">
              <input
                type="text"
                value={goalQuery}
                onChange={(e) => setGoalQuery(e.target.value)}
                placeholder="e.g. Run a 10km marathon, Learn Full-Stack React, Meditate daily"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer shadow"
              >
                Break Down
              </button>
            </form>

            {breakdownResult && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  4-Week Progressive Roadmap: &quot;{breakdownResult.goal}&quot;
                </div>

                <div className="space-y-2.5">
                  {breakdownResult.milestones.map((m) => (
                    <div
                      key={m.week}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs font-bold text-violet-400">
                          Week {m.week}: {m.title}
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{m.actionableHabit}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleAdoptHabit({
                            title: m.actionableHabit,
                            category: 'Routine',
                            difficulty: 'Medium',
                            targetTimeOfDay: 'Morning',
                            targetRealm: activeRealm,
                            description: `Milestone Week ${m.week} for ${breakdownResult.goal}`,
                            motivation: `+${m.xpBonus} XP Bonus Milestone`,
                          })
                        }
                        className="shrink-0 p-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Habit</span>
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-400 italic pt-1">{breakdownResult.advice}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Smart Generator */}
        {activeTab === 'generator' && (
          <div className="space-y-4 animate-fadeIn">
            <form onSubmit={handleGenerateHabits} className="flex gap-2">
              <input
                type="text"
                value={generatorQuery}
                onChange={(e) => setGeneratorQuery(e.target.value)}
                placeholder="What area do you want to optimize? (e.g. Fitness, Coding, Mindfulness)"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer shadow"
              >
                Generate
              </button>
            </form>

            <div className="space-y-2.5">
              {generatedHabits.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  Type a topic above to generate tailored daily habits with realm synergies!
                </div>
              ) : (
                generatedHabits.map((rec, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{rec.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-slate-800 text-slate-300">
                          {rec.category}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-amber-500/20 text-amber-300">
                          {rec.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{rec.description}</p>
                      <p className="text-[11px] text-violet-400 font-medium">{rec.motivation}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdoptHabit(rec)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow hover:scale-105 active:scale-95 transition-all shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adopt Habit</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
