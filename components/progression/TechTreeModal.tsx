'use client';

import React from 'react';
import { RealmProgression, RealmType, TechUnlock } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { X, Lock, CheckCircle2, Zap, Sparkles } from 'lucide-react';
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

  const realmMeta = REALM_DEFINITIONS[activeRealm];
  const realmTech = techTree.filter((t) => t.realm === activeRealm);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-slate-900 border rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        style={{
          borderColor: `${realmMeta.accentColor}50`,
          boxShadow: `0 0 40px -10px ${realmMeta.glowColor}`,
        }}
      >
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
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              backgroundColor: `${realmMeta.accentColor}25`,
              color: realmMeta.accentColor,
              border: `1px solid ${realmMeta.accentColor}40`,
            }}
          >
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{realmMeta.name} &bull; Research & Tech Tree</span>
            </h2>
            <p className="text-xs text-slate-400">
              Unlock passive bonuses, streak multipliers, and specialized realm perks.
            </p>
          </div>
        </div>

        {/* User Balance Bar */}
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 flex items-center justify-between mb-6 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Available Coins: <strong className="text-amber-300 font-bold">{userCoins}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: realmMeta.accentColor }} />
            <span>
              {realmMeta.resourceName}: <strong className="text-white font-bold">{realmProg.resourceAmount}</strong>
            </span>
          </div>
        </div>

        {/* Tech Tree Nodes */}
        <div className="space-y-3.5">
          {realmTech.map((tech) => {
            const canAfford = userCoins >= tech.cost && realmProg.resourceAmount >= tech.resourceCost;
            const stageAllowed = realmProg.growthStage >= tech.tier;

            return (
              <div
                key={tech.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  tech.unlocked
                    ? 'bg-slate-900/40 border-emerald-500/30'
                    : stageAllowed
                    ? 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600 shadow'
                    : 'bg-slate-950/60 border-slate-900 opacity-60'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      Tier {tech.tier}
                    </span>
                    <h3 className="text-sm font-bold text-white">{tech.name}</h3>
                    {tech.unlocked && (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300">{tech.description}</p>
                  <div className="text-[11px] font-semibold text-emerald-400/90 pt-0.5">
                    Effect: {tech.bonusEffect}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {!tech.unlocked && (
                    <div className="text-right text-xs">
                      <div className="font-semibold text-amber-300">{tech.cost} Coins</div>
                      <div className="text-[11px] text-slate-400">
                        +{tech.resourceCost} {realmMeta.resourceName.split(' ')[0]}
                      </div>
                    </div>
                  )}

                  {tech.unlocked ? (
                    <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                      Mastered
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={!stageAllowed || !canAfford}
                      onClick={() => {
                        if (stageAllowed && canAfford) {
                          soundManager.playUnlock();
                          onUnlockTech(tech.id, tech.cost, tech.resourceCost);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                        stageAllowed && canAfford
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white cursor-pointer hover:scale-105 active:scale-95'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      {!stageAllowed ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Req. Stage {tech.tier}</span>
                        </>
                      ) : !canAfford ? (
                        <span>Insufficient Funds</span>
                      ) : (
                        <span>Research Perk</span>
                      )}
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
