'use client';

import React from 'react';
import { Quest } from '@/lib/types';
import { Trophy, CheckCircle2, Gift } from 'lucide-react';
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
        particleCount: 25,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#3b82f6'],
        disableForReducedMotion: true,
      });
    } catch {
      // Fallback
    }
    onClaimQuest(quest.id);
  };

  return (
    <div className="p-3.5 rounded-xl studio-panel space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Daily Bounties & Quests
          </h3>
        </div>
        <span className="text-[11px] text-[#71717a]">Refreshes daily</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {quests.map((quest) => {
          const isComplete = quest.progress >= quest.target;
          const progressPercent = Math.min(100, Math.round((quest.progress / quest.target) * 100));

          return (
            <div
              key={quest.id}
              className={`p-3 rounded-lg border flex flex-col justify-between transition-colors ${
                quest.completed
                  ? 'bg-[#121215]/50 border-[#27272a] opacity-60'
                  : isComplete
                  ? 'bg-[#18181b] border-amber-500/40'
                  : 'bg-[#141418] border-[#27272a]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-semibold text-white">{quest.title}</h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-[#18181b] border border-[#27272a] text-amber-400">
                    +{quest.rewardXP} XP / +{quest.rewardCoins}g
                  </span>
                </div>
                <p className="text-[11px] text-[#71717a] leading-snug">{quest.description}</p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#27272a] space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-[#71717a] font-medium">
                  <span>Progress</span>
                  <span>{quest.progress}/{quest.target}</span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#27272a] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {quest.completed ? (
                  <div className="w-full py-1 text-center text-[10px] font-semibold text-emerald-400 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Completed</span>
                  </div>
                ) : isComplete ? (
                  <button
                    type="button"
                    onClick={() => handleClaim(quest)}
                    className="w-full py-1 rounded text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 cursor-pointer transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Gift className="w-3 h-3" />
                    <span>Claim Reward</span>
                  </button>
                ) : (
                  <div className="text-center text-[10px] text-[#71717a] py-0.5">In Progress</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
