'use client';

import React from 'react';
import { Quest } from '@/lib/types';
import { Sparkles, Trophy, CheckCircle2, Gift } from 'lucide-react';
import { soundManager } from '@/lib/sound';
import confetti from 'canvas-confetti';

interface DailyQuestsProps {
  quests: Quest[];
  onClaimQuest: (questId: string) => void;
}

export const DailyQuests: React.FC<DailyQuestsProps> = ({ quests, onClaimQuest }) => {
  const handleClaim = (quest: Quest) => {
    soundManager.playStreak();
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6'],
      });
    } catch {
      // Fallback
    }
    onClaimQuest(quest.id);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold text-white">Daily Quests & Bounties</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">Resets in 24h</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {quests.map((quest) => {
          const isComplete = quest.progress >= quest.target;
          const progressPercent = Math.min(100, Math.round((quest.progress / quest.target) * 100));

          return (
            <div
              key={quest.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                quest.completed
                  ? 'bg-slate-900/40 border-slate-800 opacity-60'
                  : isComplete
                  ? 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-500/40 shadow-lg'
                  : 'bg-slate-900/70 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-bold text-white">{quest.title}</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-slate-800 text-amber-300">
                    +{quest.rewardXP} XP / +{quest.rewardCoins}g
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-snug">{quest.description}</p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>Progress</span>
                  <span>{quest.progress}/{quest.target}</span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {quest.completed ? (
                  <div className="w-full py-1.5 rounded-lg text-center text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Claimed
                  </div>
                ) : isComplete ? (
                  <button
                    type="button"
                    onClick={() => handleClaim(quest)}
                    className="w-full py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5 hover:scale-102 active:scale-98"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    Claim Rewards
                  </button>
                ) : (
                  <div className="text-center text-[11px] text-slate-500 py-1">In Progress</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
