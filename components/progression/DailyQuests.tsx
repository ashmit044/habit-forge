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
        colors: ['#c8a96c', '#9db28c', '#eee9d9'],
        disableForReducedMotion: true,
      });
    } catch {
      // Fallback
    }
    onClaimQuest(quest.id);
  };

  return (
    <section className="p-4 sm:p-5 rounded-md studio-panel space-y-4" aria-labelledby="quests-heading">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-[#c8a96c]" />
          <div>
            <p className="journal-kicker">A little extra</p>
            <h2 id="quests-heading" className="journal-heading text-lg">Daily quests</h2>
          </div>
        </div>
        <span className="text-xs text-[#929783]">Daily reset · streak trial every 3 days</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {quests.map((quest) => {
          const isComplete = quest.progress >= quest.target;
          const progressPercent = Math.min(100, Math.round((quest.progress / quest.target) * 100));

          return (
            <div
              key={quest.id}
              className={`p-4 rounded-md border flex flex-col justify-between transition-colors ${
                quest.completed
                  ? 'bg-[#141b15] border-[#354033] opacity-65'
                  : isComplete
                  ? 'bg-[#222b20] border-[#9a8358]'
                  : 'bg-[#1c261e] border-[#354033]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-[#eee9d9]">{quest.title}</h3>
                  <span className="text-[10px] px-1.5 py-1 rounded-sm font-medium bg-[#202a21] border border-[#48513e] text-[#d7bd83]">
                    +{quest.rewardXP} XP / +{quest.rewardCoins}g
                  </span>
                </div>
                <p className="text-xs text-[#929783] leading-relaxed mt-1">{quest.description}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-[#354033] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#929783] font-medium">
                  <span>Progress</span>
                  <span>{quest.progress}/{quest.target}</span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#30392d] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#c8a96c] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {quest.completed ? (
                  <div className="w-full py-1 text-center text-[11px] font-semibold text-[#9db28c] flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Completed</span>
                  </div>
                ) : isComplete ? (
                  <button
                    type="button"
                    onClick={() => handleClaim(quest)}
                    className="w-full py-2 rounded-sm text-xs font-semibold text-[#171b14] bg-[#c8a96c] hover:bg-[#d7bd83] cursor-pointer transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Gift className="w-3 h-3" />
                    <span>Claim Reward</span>
                  </button>
                ) : (
                  <div className="text-center text-[11px] text-[#929783] py-1">In progress</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
