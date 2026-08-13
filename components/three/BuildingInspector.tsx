'use client';

import React from 'react';
import { Interactive3DObject } from './scenes/Garden3D';
import { RealmProgression } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { X, ArrowUpRight, Zap, Info } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface BuildingInspectorProps {
  structure: Interactive3DObject | null;
  realmProg: RealmProgression;
  onClose: () => void;
  onUpgrade?: (structureId: string) => void;
}

export const BuildingInspector: React.FC<BuildingInspectorProps> = ({
  structure,
  realmProg,
  onClose,
  onUpgrade,
}) => {
  if (!structure) return null;

  const meta = REALM_DEFINITIONS[realmProg.realmType];
  const upgradeCost = (structure.level + 1) * 35;
  const canAfford = realmProg.resourceAmount >= upgradeCost;

  return (
    <div className="p-4 rounded-xl studio-panel-raised border border-[#3f3f46] shadow-xl space-y-3 animate-slideInRight">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.accentColor }} />
            <span className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider">
              {structure.type} &bull; Tier {structure.tier}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mt-0.5">{structure.name}</h4>
        </div>

        <button
          type="button"
          onClick={() => {
            soundManager.playTap();
            onClose();
          }}
          className="p-1 rounded-md text-[#a1a1aa] hover:text-white bg-[#27272a] hover:bg-[#3f3f46] transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-[#a1a1aa] leading-relaxed">
        {structure.description}
      </p>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#27272a]">
        <div className="p-2 rounded-lg bg-[#121215] border border-[#27272a]">
          <span className="text-[10px] text-[#71717a] uppercase font-semibold block">Structure Level</span>
          <span className="text-xs font-bold text-white">Level {structure.level}</span>
        </div>

        <div className="p-2 rounded-lg bg-[#121215] border border-[#27272a]">
          <span className="text-[10px] text-[#71717a] uppercase font-semibold block">Daily Yield</span>
          <span className="text-xs font-bold text-emerald-400">+{structure.level * 5} {meta.resourceName.split(' ')[0]}</span>
        </div>
      </div>

      {/* Upgrade Action */}
      {onUpgrade && (
        <div className="pt-2 flex items-center justify-between gap-2">
          <div className="text-xs text-[#a1a1aa]">
            <span>Cost: </span>
            <span className="font-semibold text-white">{upgradeCost} {meta.resourceName.split(' ')[0]}</span>
          </div>

          <button
            type="button"
            disabled={!canAfford}
            onClick={() => {
              if (canAfford) {
                soundManager.playUnlock();
                onUpgrade(structure.id);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              canAfford
                ? 'bg-white text-black hover:bg-neutral-200 cursor-pointer shadow'
                : 'bg-[#27272a] text-[#71717a] cursor-not-allowed'
            }`}
          >
            <span>Upgrade to Lvl {structure.level + 1}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
