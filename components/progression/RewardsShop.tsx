'use client';

import React from 'react';
import { UserProfile, RealmType } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { X, ShoppingBag, Shield, Zap, Sparkles, Crown } from 'lucide-react';
import { soundManager } from '@/lib/sound';
import confetti from 'canvas-confetti';

interface RewardsShopProps {
  isOpen: boolean;
  user: UserProfile;
  activeRealm: RealmType;
  onClose: () => void;
  onBuyShield: () => void;
  onBuyCatalyst: () => void;
  onBuyXPBooster: () => void;
}

export const RewardsShop: React.FC<RewardsShopProps> = ({
  isOpen,
  user,
  activeRealm,
  onClose,
  onBuyShield,
  onBuyCatalyst,
  onBuyXPBooster,
}) => {
  if (!isOpen) return null;

  const realmMeta = REALM_DEFINITIONS[activeRealm];

  const shopItems = [
    {
      id: 'shield',
      name: 'Streak Aegis Shield',
      description: 'Automatically saves your habit streak if you miss a scheduled day.',
      cost: 50,
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      color: 'border-blue-500/40 bg-blue-950/30',
      action: () => {
        onBuyShield();
        soundManager.playShield();
      },
    },
    {
      id: 'booster',
      name: 'Elixir of Hyper-Focus',
      description: 'Awards an instant burst of +100 Player XP and boosts streak combo.',
      cost: 65,
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      color: 'border-amber-500/40 bg-amber-950/30',
      action: () => {
        onBuyXPBooster();
        soundManager.playUnlock();
      },
    },
    {
      id: 'catalyst',
      name: `${realmMeta.name} Catalyst`,
      description: `Injects +120 ${realmMeta.resourceName} directly into your active realm.`,
      cost: 80,
      icon: <Sparkles className="w-6 h-6" style={{ color: realmMeta.accentColor }} />,
      color: 'border-emerald-500/40 bg-emerald-950/30',
      action: () => {
        onBuyCatalyst();
        soundManager.playUnlock();
      },
    },
    {
      id: 'crest',
      name: 'High Monarch Banner',
      description: 'Legendary cosmetic avatar crest signaling master discipline.',
      cost: 150,
      icon: <Crown className="w-6 h-6 text-yellow-400" />,
      color: 'border-yellow-500/40 bg-yellow-950/30',
      action: () => {
        soundManager.playLevelUp();
        try {
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
        } catch {}
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
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
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-2xl shadow-lg">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">The Bazaar of Triumphs</h2>
            <p className="text-xs text-slate-400">
              Spend your earned gold coins on streak shields, XP boosters, and realm catalysts.
            </p>
          </div>
        </div>

        {/* Coin Balance */}
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 flex items-center justify-between mb-6 text-xs">
          <span className="text-slate-300">Your Coin Treasury</span>
          <div className="flex items-center gap-1.5 font-bold text-amber-300 text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{user.coins} Gold Coins</span>
          </div>
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shopItems.map((item) => {
            const canAfford = user.coins >= item.cost;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${item.color} shadow`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 shadow">
                      {item.icon}
                    </div>
                    <span className="text-xs font-bold text-amber-300 bg-slate-900/80 px-2 py-1 rounded-md border border-amber-500/30">
                      {item.cost} Coins
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{item.name}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-snug">{item.description}</p>
                </div>

                <button
                  type="button"
                  disabled={!canAfford}
                  onClick={item.action}
                  className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${
                    canAfford
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 cursor-pointer hover:scale-102 active:scale-98'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Purchase Item' : 'Insufficient Coins'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
