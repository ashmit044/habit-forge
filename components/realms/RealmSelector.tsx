'use client';

import React from 'react';
import { RealmProgression, RealmType } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { Flower2, ShieldAlert, Castle, Rocket, Wand2 } from 'lucide-react';
import { soundManager } from '@/lib/sound';

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
  const realmList: RealmType[] = ['garden', 'military', 'town', 'space', 'arcane'];

  const getIcon = (type: RealmType) => {
    switch (type) {
      case 'garden':
        return <Flower2 className="w-4 h-4 md:w-5 md:h-5" />;
      case 'military':
        return <ShieldAlert className="w-4 h-4 md:w-5 md:h-5" />;
      case 'town':
        return <Castle className="w-4 h-4 md:w-5 md:h-5" />;
      case 'space':
        return <Rocket className="w-4 h-4 md:w-5 md:h-5" />;
      case 'arcane':
        return <Wand2 className="w-4 h-4 md:w-5 md:h-5" />;
    }
  };

  return (
    <div className="w-full flex items-center justify-start md:justify-center overflow-x-auto py-2 px-1 gap-2.5 no-scrollbar">
      {realmList.map((realmKey) => {
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
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap text-left cursor-pointer border select-none ${
              isActive
                ? 'bg-slate-800/90 text-white shadow-lg scale-105'
                : 'bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-white/5'
            }`}
            style={{
              borderColor: isActive ? meta.accentColor : undefined,
              boxShadow: isActive ? `0 0 20px -3px ${meta.glowColor}` : undefined,
            }}
          >
            <div
              className="p-1.5 rounded-lg flex items-center justify-center transition-transform duration-300"
              style={{
                backgroundColor: isActive ? `${meta.accentColor}25` : 'rgba(255,255,255,0.05)',
                color: meta.accentColor,
              }}
            >
              {getIcon(realmKey)}
            </div>

            <div>
              <div className="text-xs font-semibold leading-tight flex items-center gap-1.5">
                <span>{meta.name}</span>
                {isActive && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${meta.accentColor}20`,
                      color: meta.accentColor,
                    }}
                  >
                    Stage {prog.growthStage}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <span>{prog.resourceAmount}</span>
                <span className="opacity-80">{prog.resourceName.split(' ')[0]}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
