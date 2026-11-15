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
    { key: 'habits' as MainTab, label: 'Habits', icon: <CheckSquare className="w-[18px] h-[18px]" /> },
    { key: 'realm' as MainTab, label: 'Realm', icon: <Globe2 className="w-[18px] h-[18px]" /> },
    { key: 'quests' as MainTab, label: 'Quests', icon: <Trophy className="w-[18px] h-[18px]" /> },
    { key: 'tech', label: 'Tech', icon: <Zap className="w-5 h-5" />, action: onOpenTechTree },
    { key: 'ai', label: 'AI Coach', icon: <Bot className="w-5 h-5" />, action: onOpenAICoach },
  ];

  return (
    <nav aria-label="Main navigation" className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#111713] border-t border-[#48513e] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] select-none shadow-[0_-10px_30px_rgba(4,9,5,0.32)]">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <button
              key={tab.key}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => {
                soundManager.playTap();
                if (tab.action) {
                  tab.action();
                } else if (tab.key) {
                  onSelectTab(tab.key as MainTab);
                }
              }}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-md transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#d7bd83] font-semibold bg-[#202a21]'
                  : 'text-[#929783] hover:text-[#eee9d9]'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
