'use client';

import React from 'react';
import { RealmProgression, RealmType, TechUnlock } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { X, Lock, Check, Zap, Sparkles, GitFork } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface TechTreeModalProps {
  isOpen: boolean;
  activeRealm: RealmType;
  realmProg: RealmProgression;
  techTree: TechUnlock[];
  userCoins: number;
  onClose: () => void;
  onUnlockTech: (techId: string, cost: number, resourceCost: number) => void;
}

export const TechTreeModal: React.FC<TechTreeModalProps> = ({
  isOpen,
  activeRealm,
  realmProg,
  techTree,
  userCoins,
  onClose,
  onUnlockTech,
}) => {
  if (!isOpen) return null;

  const meta = REALM_DEFINITIONS[activeRealm];
  const realmTech = techTree.filter((t) => t.realm === activeRealm);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#121215] border border-[#27272a] rounded-xl p-5 shadow-2xl relative max-h-[88vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-md text-[#a1a1aa] hover:text-white bg-[#18181b] hover:bg-[#27272a] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-md bg-[#18181b] border border-[#27272a] text-blue-400">
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {meta.name} Research & Tech Tree
            </h3>
            <p className="text-xs text-[#71717a]">
              Unlock persistent passive bonuses and realm modifiers with earned coins and resources.
            </p>
          </div>
        </div>

        {/* Available Balances */}
        <div className="flex items-center gap-3 p-2.5 rounded-md bg-[#09090b] border border-[#27272a] mb-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-amber-400">
            <span>🪙</span>
            <span className="text-white font-semibold">{userCoins} Coins</span>
          </div>
          <div className="w-[1px] h-3 bg-[#27272a]" />
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.accentColor }} />
            <span className="text-white font-semibold">{realmProg.resourceAmount} {realmProg.resourceName}</span>
          </div>
        </div>

        {/* Tech Tree Nodes */}
        <div className="space-y-2">
          {realmTech.map((tech) => {
            const canAfford = userCoins >= tech.cost && realmProg.resourceAmount >= tech.resourceCost;

            return (
              <div
                key={tech.id}
                className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  tech.unlocked
                    ? 'bg-[#18181b] border-[#3f3f46]'
                    : 'bg-[#141418] border-[#27272a]'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-[#18181b] border border-[#27272a] text-[#a1a1aa]">
                      Tier {tech.tier}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">{tech.name}</h4>
                    {tech.bonusEffect && (
                      <span className="text-[10px] text-emerald-400 font-medium">
                        &bull; {tech.bonusEffect}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#71717a] leading-relaxed">
                    {tech.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {tech.unlocked ? (
                    <div className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Unlocked</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => {
                        if (canAfford) {
                          soundManager.playUnlock();
                          onUnlockTech(tech.id, tech.cost, tech.resourceCost);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        canAfford
                          ? 'bg-white hover:bg-neutral-200 text-black cursor-pointer shadow-sm'
                          : 'bg-[#18181b] border border-[#27272a] text-[#71717a] cursor-not-allowed'
                      }`}
                    >
                      <Lock className="w-3 h-3" />
                      <span>{tech.cost}g + {tech.resourceCost} {meta.resourceName.split(' ')[0]}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
