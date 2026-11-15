'use client';

import React from 'react';
import { RealmProgression, RealmType } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { soundManager } from '@/lib/sound';
import { Flower2, ShieldAlert, Castle, Rocket, Wand2 } from 'lucide-react';

interface RealmSelectorProps {
  activeRealm: RealmType;
  realms: Record<RealmType, RealmProgression>;
  onSelectRealm: (realm: RealmType) => void;
}

export const RealmSelector: React.FC<RealmSelectorProps> = ({
  activeRealm,
  realms,
  onSelectRealm,
}) => {
  const realmKeys: RealmType[] = ['garden', 'military', 'town', 'space', 'arcane'];

  const getRealmIcon = (type: RealmType) => {
    switch (type) {
      case 'garden':
        return <Flower2 className="w-3.5 h-3.5" />;
      case 'military':
        return <ShieldAlert className="w-3.5 h-3.5" />;
      case 'town':
        return <Castle className="w-3.5 h-3.5" />;
      case 'space':
        return <Rocket className="w-3.5 h-3.5" />;
      case 'arcane':
        return <Wand2 className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section aria-label="Choose a realm" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
      {realmKeys.map((realmKey) => {
        const meta = REALM_DEFINITIONS[realmKey];
        const prog = realms[realmKey];
        const isActive = activeRealm === realmKey;
        const progressPercent = prog.pointsToNextStage > 0
          ? Math.min(100, Math.round((prog.currentPoints / prog.pointsToNextStage) * 100))
          : 100;

        return (
          <button
            key={realmKey}
            type="button"
            aria-pressed={isActive}
            onClick={() => {
              soundManager.playTap();
              onSelectRealm(realmKey);
            }}
            className={`group relative p-3 rounded-md border text-left transition-colors cursor-pointer flex items-center justify-between gap-2 min-h-[76px] ${
              isActive
                ? 'bg-[#202a21] border-[#9a8358] text-[#eee9d9] shadow-[inset_0_0_0_1px_rgba(200,169,108,0.12)]'
                : 'bg-[#19221b] hover:bg-[#202a21] border-[#354033] text-[#c0c0a9] hover:text-[#eee9d9]'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="p-2 rounded-md flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: isActive ? `${meta.accentColor}20` : '#2b352b',
                  color: isActive ? meta.accentColor : '#b9bba5',
                }}
              >
                {getRealmIcon(realmKey)}
              </div>
              <div className="truncate">
                <div className="text-sm font-semibold truncate leading-tight">
                  {meta.name}
                </div>
                <div className="text-[11px] text-[#929783] truncate mt-0.5">
                  {meta.title.split(' ')[0]}
                </div>
              </div>
            </div>

            <span
              className={`text-[10px] font-bold px-1.5 py-1 rounded-sm shrink-0 ${
                isActive
                  ? 'bg-[#c8a96c] text-[#171b14]'
                  : 'bg-[#2b352b] text-[#b9bba5]'
              }`}
            >
              S{prog.growthStage}
            </span>
            <span className="sr-only">, {prog.currentPoints} of {prog.pointsToNextStage} progress</span>
            <span className="absolute inset-x-3 bottom-2 h-0.5 overflow-hidden rounded-full bg-[#30392d]">
              <span className="block h-full bg-[#c8a96c] transition-[width]" style={{ width: `${progressPercent}%` }} />
            </span>
          </button>
        );
      })}
    </section>
  );
};
