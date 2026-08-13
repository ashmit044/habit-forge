'use client';

import React from 'react';
import { CheckSquare, Globe2, Trophy, Zap, Bot } from 'lucide-react';
import { soundManager } from '@/lib/sound';

export type MainTab = 'habits' | 'realm' | 'quests' | 'analytics' | 'ai';

interface MobileNavProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  onOpenAICoach: () => void;
  onOpenTechTree: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAICoach,
  onOpenTechTree,
}) => {
  const tabs = [
    { key: 'habits' as MainTab, label: 'Habits', icon: <CheckSquare className="w-5 h-5" /> },
    { key: 'realm' as MainTab, label: 'Realm', icon: <Globe2 className="w-5 h-5" /> },
    { key: 'quests' as MainTab, label: 'Quests', icon: <Trophy className="w-5 h-5" /> },
    { key: 'tech', label: 'Tech', icon: <Zap className="w-5 h-5" />, action: onOpenTechTree },
    { key: 'ai', label: 'AI Coach', icon: <Bot className="w-5 h-5" />, action: onOpenAICoach },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-panel-elevated border-t border-slate-800/80 px-2 py-2 select-none">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                soundManager.playTap();
                if (tab.action) {
                  tab.action();
                } else if (tab.key) {
                  onSelectTab(tab.key as MainTab);
                }
              }}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-emerald-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
