'use client';

import React from 'react';
import { RealmProgression, RealmType, UserProfile } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { Zap, Shield, Trophy, Target, Globe } from 'lucide-react';

interface StatsOverviewProps {
  user: UserProfile;
  realms: Record<RealmType, RealmProgression>;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ user, realms }) => {
  const realmKeys: RealmType[] = ['garden', 'military', 'town', 'space', 'arcane'];

  return (
    <div className="p-4 rounded-xl studio-panel space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          Realm Overview & Empire Stats
        </h3>
        <span className="text-[11px] text-[#71717a]">
          Combo Multiplier: <strong className="text-white">{user.multiplier.toFixed(1)}x</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {realmKeys.map((realmKey) => {
          const meta = REALM_DEFINITIONS[realmKey];
          const prog = realms[realmKey];

          return (
            <div
              key={realmKey}
              className="p-2.5 rounded-lg bg-[#141418] border border-[#27272a] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate">
                  {meta.name.split(' ')[0]}
                </span>
                <span
                  className="text-[9px] px-1 py-0.2 rounded font-bold"
                  style={{
                    backgroundColor: `${meta.accentColor}20`,
                    color: meta.accentColor,
                  }}
                >
                  Stage {prog.growthStage}
                </span>
              </div>

              <div className="text-[11px] text-[#71717a]">
                <span>{prog.resourceAmount} </span>
                <span>{prog.resourceName.split(' ')[0]}</span>
              </div>

              <div className="w-full h-1 rounded-full bg-[#27272a] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, Math.round((prog.currentPoints / prog.pointsToNextStage) * 100))}%`,
                    backgroundColor: meta.accentColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
