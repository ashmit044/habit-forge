'use client';

import React from 'react';
import { Award, Check, Coins, LockKeyhole, Zap } from 'lucide-react';
import { AchievementProgress } from '@/lib/achievements';

interface AchievementBoardProps {
  achievements: AchievementProgress[];
  onClaim: (achievementId: string) => void;
}

export const AchievementBoard: React.FC<AchievementBoardProps> = ({ achievements, onClaim }) => {
  const readyToClaim = achievements.filter((achievement) => achievement.unlocked && !achievement.claimed).length;

  return (
    <section className="studio-panel space-y-4 rounded-md p-4 sm:p-5" aria-labelledby="achievement-heading">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#59624b] bg-[#202a21] text-[#d7bd83]">
            <Award className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="journal-kicker">Campaign record</p>
            <h2 id="achievement-heading" className="journal-heading text-lg">Milestones</h2>
          </div>
        </div>
        <span className="rounded-sm border border-[#48513e] bg-[#202a21] px-2.5 py-1.5 text-xs text-[#c0c0a9]">
          {readyToClaim > 0 ? `${readyToClaim} reward${readyToClaim === 1 ? '' : 's'} ready` : 'Keep building'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {achievements.map((achievement) => {
          const progressPercent = Math.round((achievement.progress / achievement.target) * 100);

          return (
            <article key={achievement.id} className={`flex min-h-40 flex-col justify-between rounded-sm border p-3.5 ${achievement.claimed ? 'border-[#354033] bg-[#141b15] opacity-70' : achievement.unlocked ? 'border-[#9a8358] bg-[#222b20]' : 'border-[#354033] bg-[#1c261e]'}`}>
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#eee9d9]">{achievement.title}</h3>
                  {achievement.claimed ? (
                    <Check className="h-4 w-4 shrink-0 text-[#9db28c]" aria-label="Claimed" />
                  ) : achievement.unlocked ? (
                    <Award className="h-4 w-4 shrink-0 text-[#d7bd83]" aria-label="Reward available" />
                  ) : (
                    <LockKeyhole className="h-3.5 w-3.5 shrink-0 text-[#929783]" aria-label="Locked" />
                  )}
                </div>
                <p className="mt-1.5 min-h-9 text-xs leading-relaxed text-[#929783]">{achievement.description}</p>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#b9bba5]">
                  <span>{achievement.progress} / {achievement.target}</span>
                  <span className="inline-flex items-center gap-2 text-[#d7bd83]">
                    <span className="inline-flex items-center gap-0.5"><Zap className="h-3 w-3" aria-hidden="true" />{achievement.rewardXP}</span>
                    <span className="inline-flex items-center gap-0.5"><Coins className="h-3 w-3" aria-hidden="true" />{achievement.rewardCoins}</span>
                  </span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-[#30392d]" role="progressbar" aria-label={`${achievement.title} progress`} aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
                  <div className={`h-full rounded-full transition-[width] duration-500 ${achievement.unlocked ? 'bg-[#c8a96c]' : 'bg-[#7fa57a]'}`} style={{ width: `${progressPercent}%` }} />
                </div>
                {achievement.unlocked && !achievement.claimed ? (
                  <button type="button" onClick={() => onClaim(achievement.id)} className="w-full rounded-sm bg-[#c8a96c] py-2 text-xs font-semibold text-[#171b14] transition-colors hover:bg-[#d7bd83]">
                    Claim reward
                  </button>
                ) : (
                  <div className="py-1 text-center text-[11px] font-medium text-[#929783]">
                    {achievement.claimed ? 'Reward collected' : 'In progress'}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
