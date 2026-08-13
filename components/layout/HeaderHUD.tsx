'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/lib/types';
import { Trophy, Coins, Shield, Volume2, VolumeX, ShoppingBag, Sparkles, Download, Upload, Zap } from 'lucide-react';
import { soundManager } from '@/lib/sound';
import { storage } from '@/lib/storage';

interface HeaderHUDProps {
  user: UserProfile;
  onOpenShop: () => void;
  onOpenTechTree: () => void;
  onRefreshData: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  user,
  onOpenShop,
  onOpenTechTree,
  onRefreshData,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [importJson, setImportJson] = useState('');

  const xpPercent = Math.min(100, Math.round((user.xp / user.xpToNextLevel) * 100));

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playTap();
  };

  const handleExport = () => {
    soundManager.playTap();
    const dataStr = storage.exportBackup();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habitforge_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importJson.trim()) return;
    const success = storage.importBackup(importJson);
    if (success) {
      soundManager.playLevelUp();
      setShowBackupModal(false);
      onRefreshData();
      alert('Data restored successfully!');
    } else {
      alert('Invalid backup JSON data.');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel-elevated border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-emerald-500/20">
            ⚔️
          </div>
          <div>
            <h1 className="text-sm md:text-base font-black tracking-tight text-white flex items-center gap-1.5">
              <span>HabitForge</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider hidden sm:inline-block">
                Realms
              </span>
            </h1>
            <div className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Gamified Realm Expansion
            </div>
          </div>
        </div>

        {/* Level & XP Progress Bar */}
        <div className="flex-1 max-w-xs md:max-w-sm hidden sm:block">
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <div className="flex items-center gap-1.5 text-amber-300">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Level {user.level}</span>
            </div>
            <span className="text-slate-400 font-medium">
              {user.xp} / {user.xpToNextLevel} XP
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative border border-slate-700/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Action Controls & Resource Counters */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Coins Treasury Button */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenShop();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{user.coins}g</span>
          </button>

          {/* Streak Shields Pill */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold">
            <Shield className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
            <span>{user.streakShields}</span>
          </div>

          {/* Research / Tech Tree Trigger */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenTechTree();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer hidden md:flex"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tech Tree</span>
          </button>

          {/* Shop Trigger */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              onOpenShop();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bazaar</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Backup / Export Trigger */}
          <button
            type="button"
            onClick={() => {
              soundManager.playTap();
              setShowBackupModal(true);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Backup & Restore Data"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Backup / Restore Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Save & Restore Data</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowBackupModal(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Export your habits, streaks, and virtual realm progression as a JSON backup file or restore previously saved data.
            </p>

            <button
              type="button"
              onClick={handleExport}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Backup (JSON)</span>
            </button>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Restore from JSON Backup
              </label>
              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder="Paste backup JSON string here..."
                rows={3}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleImport}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Restore Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
