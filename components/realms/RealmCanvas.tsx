'use client';

import React, { useState } from 'react';
import { PlacedStructure, RealmProgression, RealmType } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { GardenScene } from './GardenScene';
import { MilitaryBaseScene } from './MilitaryBaseScene';
import { TownScene } from './TownScene';
import { SpaceColonyScene } from './SpaceColonyScene';
import { WizardAcademyScene } from './WizardAcademyScene';
import { RealmInspectorModal } from './RealmInspectorModal';
import { Plus, Sparkles, TrendingUp, Target, Zap, Award } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface RealmCanvasProps {
  realmProg: RealmProgression;
  onUpgradeStructure: (structureId: string) => void;
  onAddStructure: (realmType: RealmType, itemKey: string) => void;
  onOpenCreateGoalModal?: () => void;
  onInteractHarvest?: (realmType: RealmType, gain: number) => void;
}

export const RealmCanvas: React.FC<RealmCanvasProps> = ({
  realmProg,
  onUpgradeStructure,
  onAddStructure,
  onOpenCreateGoalModal,
  onInteractHarvest,
}) => {
  const [selectedStructure, setSelectedStructure] = useState<PlacedStructure | null>(null);
  const [isBuildDrawerOpen, setIsBuildDrawerOpen] = useState(false);

  const meta = REALM_DEFINITIONS[realmProg.realmType];
  const progressPercent = Math.min(
    100,
    Math.round((realmProg.currentPoints / realmProg.pointsToNextStage) * 100)
  );

  const handleSceneInteract = (msg: string, gain: number = 5) => {
    if (onInteractHarvest) {
      onInteractHarvest(realmProg.realmType, gain);
    }
  };

  const renderScene = () => {
    switch (realmProg.realmType) {
      case 'garden':
        return <GardenScene growthStage={realmProg.growthStage} onInteract={handleSceneInteract} />;
      case 'military':
        return <MilitaryBaseScene growthStage={realmProg.growthStage} onInteract={handleSceneInteract} />;
      case 'town':
        return <TownScene growthStage={realmProg.growthStage} onInteract={handleSceneInteract} />;
      case 'space':
        return <SpaceColonyScene growthStage={realmProg.growthStage} onInteract={handleSceneInteract} />;
      case 'arcane':
        return <WizardAcademyScene growthStage={realmProg.growthStage} onInteract={handleSceneInteract} />;
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Visual Canvas Scene Container */}
      <div className="relative group">
        {renderScene()}

        {/* Floating Canvas Top Overlay info */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-xs font-semibold text-white shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.accentColor }} />
            <span>{realmProg.resourceAmount}</span>
            <span className="text-slate-400 font-normal">{realmProg.resourceName}</span>
          </div>
        </div>

        {/* Growth Progress Bar at Bottom of Canvas */}
        <div className="absolute bottom-3 inset-x-4 z-20">
          <div className="glass-panel px-4 py-2.5 rounded-xl border border-white/10 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-slate-200">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>{meta.stageNames[realmProg.growthStage - 1] || `Stage ${realmProg.growthStage}`}</span>
              </div>
              <span className="text-slate-400 font-medium">
                {realmProg.currentPoints} / {realmProg.pointsToNextStage} XP ({progressPercent}%)
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden relative">
              <div
                className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: meta.accentColor,
                  boxShadow: `0 0 12px ${meta.accentColor}`,
                }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REALM PRIMARY CAMPAIGN OBJECTIVE CARD */}
      <div
        className="glass-panel p-4 rounded-2xl border transition-all space-y-2.5"
        style={{ borderColor: `${meta.accentColor}40` }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-xl flex items-center justify-center shadow"
              style={{ backgroundColor: `${meta.accentColor}20`, color: meta.accentColor }}
            >
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                {meta.name} Campaign Goal
              </span>
              <h3 className="text-sm font-bold text-white leading-tight">
                {meta.primaryGoalTitle}
              </h3>
            </div>
          </div>

          {onOpenCreateGoalModal && (
            <button
              type="button"
              onClick={() => {
                soundManager.playTap();
                onOpenCreateGoalModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 shadow transition-all cursor-pointer hover:scale-105 active:scale-95"
              style={{ backgroundColor: meta.accentColor }}
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Goal For This Realm</span>
            </button>
          )}
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {meta.primaryGoalDescription}
        </p>

        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-semibold text-slate-400 mr-1">Recommended Habits:</span>
          {meta.goalFocusAreas.map((area, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-medium"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Placed Realm Structures & Flora Grid */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: meta.accentColor }} />
            <h3 className="text-sm font-bold text-white">Active Realm Assets</h3>
            <span className="text-xs text-slate-400">({realmProg.placedStructures.length} placed)</span>
          </div>

          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setIsBuildDrawerOpen(!isBuildDrawerOpen);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Deploy Asset</span>
          </button>
        </div>

        {/* Horizontal Card List of Placed Assets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {realmProg.placedStructures.map((structure) => (
            <button
              key={structure.id}
              type="button"
              onClick={() => {
                soundManager.playTap();
                setSelectedStructure(structure);
              }}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                  {structure.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-800 text-emerald-400">
                  Lvl {structure.level}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Tier {structure.tier}</span>
                <span className="text-slate-500 group-hover:text-slate-300 transition-colors">Inspect &rarr;</span>
              </div>
            </button>
          ))}

          {/* Quick Deploy Card */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setIsBuildDrawerOpen(true);
            }}
            className="p-3 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 bg-slate-900/30 hover:bg-slate-800/40 transition-all flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer min-h-[64px]"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs font-medium">+ New Structure</span>
          </button>
        </div>

        {/* Deploy Drawer / Picker */}
        {isBuildDrawerOpen && (
          <div className="mt-4 pt-4 border-t border-slate-800 animate-fadeIn">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Available Blueprints for {meta.name}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {meta.availableStructures.map((blueprint) => {
                const canAfford = realmProg.resourceAmount >= blueprint.cost;
                const isUnlocked = realmProg.growthStage >= blueprint.tierRequired;

                return (
                  <div
                    key={blueprint.itemKey}
                    className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                      isUnlocked
                        ? 'bg-slate-900/80 border-slate-700/80'
                        : 'bg-slate-950/50 border-slate-900 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-white">{blueprint.name}</div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-slate-800 text-slate-400">
                          Tier {blueprint.tierRequired}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">{blueprint.description}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">
                        {blueprint.cost} {realmProg.resourceName.split(' ')[0]}
                      </span>

                      <button
                        type="button"
                        disabled={!isUnlocked || !canAfford}
                        onClick={() => {
                          if (isUnlocked && canAfford) {
                            soundManager.playUnlock();
                            onAddStructure(realmProg.realmType, blueprint.itemKey);
                            setIsBuildDrawerOpen(false);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          isUnlocked && canAfford
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {!isUnlocked ? `Stage ${blueprint.tierRequired} Req` : !canAfford ? 'Need Resources' : 'Construct'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Selected Structure Inspect Modal */}
      <RealmInspectorModal
        structure={selectedStructure}
        realmProg={realmProg}
        onClose={() => setSelectedStructure(null)}
        onUpgrade={onUpgradeStructure}
      />
    </div>
  );
};
