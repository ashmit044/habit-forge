'use client';

import React from 'react';
import { PlacedStructure, RealmProgression } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { X, Sparkles, ArrowUpCircle, Info } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface RealmInspectorModalProps {
  structure: PlacedStructure | null;
  realmProg: RealmProgression;
  onClose: () => void;
  onUpgrade: (structureId: string) => void;
}

export const RealmInspectorModal: React.FC<RealmInspectorModalProps> = ({
  structure,
  realmProg,
  onClose,
  onUpgrade,
}) => {
  if (!structure) return null;

  const realmMeta = REALM_DEFINITIONS[realmProg.realmType];
  const matchedDef = realmMeta.availableStructures.find((s) => s.itemKey === structure.itemKey);
  const upgradeCost = (structure.level + 1) * 35;
  const canAfford = realmProg.resourceAmount >= upgradeCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md bg-slate-900 border rounded-2xl p-6 shadow-2xl relative overflow-hidden"
        style={{
          borderColor: `${realmMeta.accentColor}60`,
          boxShadow: `0 0 35px -5px ${realmMeta.glowColor}`,
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md"
            style={{
              backgroundColor: `${realmMeta.accentColor}25`,
              color: realmMeta.accentColor,
              border: `1px solid ${realmMeta.accentColor}40`,
            }}
          >
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{structure.name}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="px-2 py-0.5 rounded-full bg-slate-800 font-semibold text-slate-300">
                Tier {structure.tier}
              </span>
              <span>&bull;</span>
              <span className="text-emerald-400 font-semibold">Level {structure.level}</span>
            </div>
          </div>
        </div>

        {/* Description & Lore */}
        <div className="space-y-3 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-sm text-slate-300">
            <p className="leading-relaxed">{matchedDef?.description || 'A vital component of your virtual realm.'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <p className="italic leading-normal">&ldquo;{matchedDef?.lore || 'Grows through daily consistency and discipline.'}&rdquo;</p>
          </div>
        </div>

        {/* Stats & Upgrade */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Daily Resource Output</div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span>+{structure.resourcePerDay || 5} {realmProg.resourceName.split(' ')[0]}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={!canAfford}
            onClick={() => {
              if (canAfford) {
                soundManager.playUnlock();
                onUpgrade(structure.id);
                onClose();
              }
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
              canAfford
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white cursor-pointer hover:scale-105 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            Upgrade ({upgradeCost} {realmProg.resourceName.split(' ')[0]})
          </button>
        </div>
      </div>
    </div>
  );
};
