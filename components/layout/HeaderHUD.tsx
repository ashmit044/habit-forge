'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/lib/types';
import { soundManager } from '@/lib/sound';
import { storage } from '@/lib/storage';
import { toLocalDateKey } from '@/lib/date-utils';
import { Volume2, VolumeX, Store, GitFork, Download, Upload } from 'lucide-react';

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
    a.download = `habitforge-backup-${toLocalDateKey()}.json`;
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
    <header className="sticky top-0 z-40 w-full border-b border-[#354033] bg-[#111713]/95 px-4 py-2.5 shadow-[0_8px_24px_rgba(4,9,5,0.22)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        {/* Brand & Player Level */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md border border-[#c8a96c]/60 bg-[#202a21] flex items-center justify-center text-[#d7bd83] font-serif font-bold text-xs shadow-inner">
              H<span className="text-[#eee9d9]">F</span>
            </div>
            <span className="font-serif font-semibold text-base tracking-tight text-[#eee9d9] hidden sm:inline">
              HabitForge
            </span>
          </div>

          <div className="h-4 w-[1px] bg-[#27272a] hidden sm:block" />

          {/* Player Level & XP Gauge */}
          <div className="flex items-center gap-2.5">
            <div className="px-2 py-1 rounded-md bg-[#202a21] border border-[#48513e] text-xs font-semibold text-[#eee9d9]">
              Lvl {user.level}
            </div>

            <div className="flex flex-col gap-1 w-20 sm:w-28">
              <div className="flex justify-between text-[10px] text-[#b9bba5] font-medium leading-none">
                <span>XP</span>
                <span>{user.xp}/{user.xpToNextLevel}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#30392d] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#c8a96c] transition-all duration-300"
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Treasury Coins, Multiplier, and Actions */}
        <div className="flex items-center gap-2">
          {/* Gold Treasury */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#202a21] border border-[#48513e] text-xs font-medium text-[#d7bd83]">
            <span className="font-serif text-[10px] uppercase tracking-wider">Gold</span>
            <span className="font-semibold text-[#eee9d9]">{user.coins}</span>
          </div>

          {/* Research Tech Tree Button */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenTechTree();
            }}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#202a21] hover:bg-[#2b352b] border border-[#48513e] text-xs font-medium text-[#eee9d9] transition-colors cursor-pointer"
          >
            <GitFork className="w-3.5 h-3.5 text-[#9db28c]" />
            <span>Research</span>
          </button>

          {/* Rewards Bazaar Shop Button */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenShop();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#202a21] hover:bg-[#2b352b] border border-[#48513e] text-xs font-medium text-[#eee9d9] transition-colors cursor-pointer"
          >
            <Store className="w-3.5 h-3.5 text-[#d7bd83]" />
            <span className="hidden sm:inline">Shop</span>
          </button>

          {/* Audio Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-1.5 rounded-md text-[#b9bba5] hover:text-[#eee9d9] bg-[#202a21] hover:bg-[#2b352b] border border-[#48513e] transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#d88e7c]" /> : <Volume2 className="w-3.5 h-3.5 text-[#9db28c]" />}
          </button>

          {/* Backup Export */}
          <button
            type="button"
            onClick={handleExportBackup}
            className="p-1.5 rounded-md text-[#b9bba5] hover:text-[#eee9d9] bg-[#202a21] hover:bg-[#2b352b] border border-[#48513e] transition-colors cursor-pointer hidden sm:block"
            title="Export JSON Backup"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Backup Import */}
          <label className="p-1.5 rounded-md text-[#b9bba5] hover:text-[#eee9d9] bg-[#202a21] hover:bg-[#2b352b] border border-[#48513e] transition-colors cursor-pointer hidden sm:block">
            <Upload className="w-3.5 h-3.5" />
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>
        </div>
      </div>
    </header>
  );
};
