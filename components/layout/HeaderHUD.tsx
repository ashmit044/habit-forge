'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/lib/types';
import { soundManager } from '@/lib/sound';
import { storage } from '@/lib/storage';
import { Volume2, VolumeX, Store, GitFork, Download, Upload, Shield, Award, Sparkles } from 'lucide-react';

interface HeaderHUDProps {
  user: UserProfile;
  onOpenShop: () => void;
  onOpenTechTree: () => void;
  onRefreshData?: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  user,
  onOpenShop,
  onOpenTechTree,
  onRefreshData,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playTap();
  };

  const handleExportBackup = () => {
    soundManager.playTap();
    const backupJson = storage.exportBackup();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitforge-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = storage.importBackup(content);
        if (success) {
          soundManager.playLevelUp();
          if (onRefreshData) onRefreshData();
        }
      }
    };
    reader.readAsText(file);
  };

  const xpProgressPercent = Math.min(
    100,
    Math.round((user.xp / user.xpToNextLevel) * 100)
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#27272a] bg-[#09090b]/90 backdrop-blur-md px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Player Level */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-sm">
              HF
            </div>
            <span className="font-bold text-sm tracking-tight text-white hidden sm:inline">
              HabitForge
            </span>
          </div>

          <div className="h-4 w-[1px] bg-[#27272a] hidden sm:block" />

          {/* Player Level & XP Gauge */}
          <div className="flex items-center gap-2.5">
            <div className="px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-xs font-semibold text-white">
              Lvl {user.level}
            </div>

            <div className="hidden sm:flex flex-col gap-1 w-28">
              <div className="flex justify-between text-[10px] text-[#a1a1aa] font-medium leading-none">
                <span>XP</span>
                <span>{user.xp}/{user.xpToNextLevel}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#27272a] overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Treasury Coins, Multiplier, and Actions */}
        <div className="flex items-center gap-2">
          {/* Gold Treasury */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#121215] border border-[#27272a] text-xs font-medium text-amber-400">
            <span>🪙</span>
            <span className="font-semibold text-white">{user.coins}</span>
          </div>

          {/* Research Tech Tree Button */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenTechTree();
            }}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-xs font-medium text-[#f4f4f5] transition-colors cursor-pointer"
          >
            <GitFork className="w-3.5 h-3.5 text-blue-400" />
            <span>Research</span>
          </button>

          {/* Rewards Bazaar Shop Button */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenShop();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-xs font-medium text-[#f4f4f5] transition-colors cursor-pointer"
          >
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Shop</span>
          </button>

          {/* Audio Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-1.5 rounded-md text-[#a1a1aa] hover:text-white bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* Backup Export */}
          <button
            type="button"
            onClick={handleExportBackup}
            className="p-1.5 rounded-md text-[#a1a1aa] hover:text-white bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] transition-colors cursor-pointer hidden sm:block"
            title="Export JSON Backup"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Backup Import */}
          <label className="p-1.5 rounded-md text-[#a1a1aa] hover:text-white bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] transition-colors cursor-pointer hidden sm:block">
            <Upload className="w-3.5 h-3.5" />
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>
        </div>
      </div>
    </header>
  );
};
