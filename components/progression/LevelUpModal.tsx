'use client';

import React, { useEffect } from 'react';
import { Sparkles, Trophy, Flame } from 'lucide-react';
import { soundManager } from '@/lib/sound';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
  isOpen: boolean;
  newLevel: number;
  unlockedPerks?: string[];
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  newLevel,
  unlockedPerks = ['+50 Bonus Gold Coins Awarded', 'Streak Multiplier Boosted', 'New Realm Tech Tiers Unlocked'],
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundManager.playLevelUp();
      try {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'],
        });
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/60 border border-amber-500/50 rounded-3xl p-6 md:p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.25)] relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />

        {/* Level Icon Trophy */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-xl transform rotate-3 animate-float">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          Level Ascension!
        </div>

        <h2 className="text-3xl font-black text-white tracking-tight">
          Reached Level {newLevel}!
        </h2>
        <p className="text-xs text-slate-300 mt-2 max-w-xs mx-auto leading-relaxed">
          Your unwavering consistency is forging legendary realms. New power and rewards are now at your command!
        </p>

        {/* Perks Box */}
        <div className="my-5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Ascension Rewards
          </div>
          {unlockedPerks.map((perk, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{perk}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            soundManager.playTap();
            onClose();
          }}
          className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-lg cursor-pointer hover:scale-102 active:scale-98 transition-all"
        >
          Claim Glory & Continue
        </button>
      </div>
    </div>
  );
};
