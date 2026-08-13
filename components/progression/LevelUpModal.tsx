'use client';

import React from 'react';
import { Award, ArrowRight, Sparkles } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface LevelUpModalProps {
  isOpen: boolean;
  newLevel: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  newLevel,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-[#121215] border border-[#3f3f46] rounded-xl p-6 shadow-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
          <Award className="w-6 h-6" />
        </div>

        <div>
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
            Ascension Achieved
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Player Level {newLevel} Reached
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Your uninterrupted discipline has elevated your global multiplier and unlocked +50 bonus gold coins.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] flex items-center justify-around text-xs font-semibold text-white">
          <div className="text-center">
            <span className="text-[10px] text-[#71717a] block">Bonus Reward</span>
            <span className="text-amber-400">+50 Gold</span>
          </div>
          <div className="w-[1px] h-6 bg-[#27272a]" />
          <div className="text-center">
            <span className="text-[10px] text-[#71717a] block">Multiplier Boost</span>
            <span className="text-emerald-400">+0.1x XP</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            soundManager.playTap();
            onClose();
          }}
          className="w-full py-2 rounded-md text-xs font-semibold bg-white hover:bg-neutral-200 text-black transition-colors cursor-pointer shadow-sm"
        >
          Claim & Return to Realm
        </button>
      </div>
    </div>
  );
};
