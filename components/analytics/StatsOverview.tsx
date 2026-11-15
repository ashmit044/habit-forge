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
    <section className="p-4 sm:p-5 rounded-md studio-panel space-y-4" aria-labelledby="realm-stats-heading">
      <div className="flex items-center justify-between">
        <div>
          <p className="journal-kicker">Long view</p>
          <h2 id="realm-stats-heading" className="journal-heading text-lg flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#9db28c]" />
            Realm ledger
          </h2>
        </div>
        <span className="text-xs text-[#929783]">
          Multiplier <strong className="text-[#d7bd83]">{user.multiplier.toFixed(1)}×</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {realmKeys.map((realmKey) => {
          const meta = REALM_DEFINITIONS[realmKey];
          const prog = realms[realmKey];

          return (
            <div
              key={realmKey}
              className="p-3 rounded-sm bg-[#1c261e] border border-[#354033] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#eee9d9] truncate">
                  {meta.name.split(' ')[0]}
                </span>
                <span
                  className="text-[10px] px-1.5 py-1 rounded-sm font-bold"
                  style={{
                    backgroundColor: `${meta.accentColor}20`,
                    color: meta.accentColor,
                  }}
                >
                  Stage {prog.growthStage}
                </span>
              </div>

              <div className="text-xs text-[#929783]">
                <span>{prog.resourceAmount} </span>
                <span>{prog.resourceName.split(' ')[0]}</span>
              </div>

              <div className="w-full h-1 rounded-full bg-[#30392d] overflow-hidden">
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
    </section>
  );
};
