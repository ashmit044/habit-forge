'use client';

import React from 'react';
import { RealmType, UserProfile } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { X, Shield, Zap, Sparkles, Store, ShoppingBag } from 'lucide-react';
import { soundManager } from '@/lib/sound';

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

  const meta = REALM_DEFINITIONS[activeRealm];

  const shopItems = [
    {
      id: 'shield',
      name: 'Streak Aegis Shield',
      description: 'Protects your active habit streaks against a single missed day.',
      cost: 50,
      icon: <Shield className="w-5 h-5 text-blue-400" />,
      action: onBuyShield,
      owned: `x${user.streakShields} owned`,
    },
    {
      id: 'xp_boost',
      name: 'Elixir of Focus (XP Surge)',
      description: 'Instantly awards +100 XP and boosts your streak multiplier by +0.3x.',
      cost: 65,
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      action: onBuyXPBooster,
      owned: `Current multiplier: ${user.multiplier.toFixed(1)}x`,
    },
    {
      id: 'catalyst',
      name: `${meta.name} Catalyst`,
      description: `Instantly deposits +120 ${meta.resourceName} and +80 progression points into ${meta.name}.`,
      cost: 80,
      icon: <Sparkles className="w-5 h-5" style={{ color: meta.accentColor }} />,
      action: onBuyCatalyst,
      owned: 'Instant realm injection',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-[#121215] border border-[#27272a] rounded-xl p-5 shadow-2xl relative max-h-[88vh] overflow-y-auto">
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
          <div className="p-2 rounded-md bg-[#18181b] border border-[#27272a] text-amber-400">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">The Bazaar (Rewards Shop)</h3>
            <p className="text-xs text-[#71717a]">
              Spend your earned daily gold coins on streak protections and growth boosters.
            </p>
          </div>
        </div>

        {/* Treasury Balance */}
        <div className="p-2.5 rounded-md bg-[#09090b] border border-[#27272a] mb-4 flex items-center justify-between text-xs">
          <span className="text-[#a1a1aa] font-medium">Your Treasury Vault:</span>
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <span>🪙</span>
            <span className="text-white">{user.coins} Gold Coins</span>
          </div>
        </div>

        {/* Shop Items */}
        <div className="space-y-2.5">
          {shopItems.map((item) => {
            const canAfford = user.coins >= item.cost;

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-lg bg-[#141418] border border-[#27272a] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-md bg-[#18181b] border border-[#27272a] shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                      <span className="text-[10px] text-[#71717a]">&bull; {item.owned}</span>
                    </div>
                    <p className="text-[11px] text-[#71717a] leading-tight mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!canAfford}
                  onClick={() => {
                    if (canAfford) {
                      soundManager.playUnlock();
                      item.action();
                    }
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold shrink-0 transition-colors flex items-center gap-1 ${
                    canAfford
                      ? 'bg-white hover:bg-neutral-200 text-black cursor-pointer shadow-sm'
                      : 'bg-[#18181b] border border-[#27272a] text-[#71717a] cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>{item.cost}g</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
