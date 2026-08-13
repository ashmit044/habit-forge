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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
      {realmKeys.map((realmKey) => {
        const meta = REALM_DEFINITIONS[realmKey];
        const prog = realms[realmKey];
        const isActive = activeRealm === realmKey;

        return (
          <button
            key={realmKey}
            type="button"
            onClick={() => {
              soundManager.playTap();
              onSelectRealm(realmKey);
            }}
            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
              isActive
                ? 'bg-[#18181b] border-[#3f3f46] shadow-sm text-white'
                : 'bg-[#121215] hover:bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="p-1.5 rounded-md flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: isActive ? `${meta.accentColor}20` : '#27272a',
                  color: isActive ? meta.accentColor : '#a1a1aa',
                }}
              >
                {getRealmIcon(realmKey)}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold truncate leading-tight">
                  {meta.name}
                </div>
                <div className="text-[10px] text-[#71717a] truncate">
                  {meta.title.split(' ')[0]}
                </div>
              </div>
            </div>

            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                isActive
                  ? 'bg-white text-black'
                  : 'bg-[#27272a] text-[#a1a1aa]'
              }`}
            >
              S{prog.growthStage}
            </span>
          </button>
        );
      })}
    </div>
  );
};
