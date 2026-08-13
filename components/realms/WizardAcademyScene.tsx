'use client';

import React, { useState } from 'react';
import { soundManager } from '@/lib/sound';
import { Wand2, Sparkles, Flame } from 'lucide-react';

interface WizardAcademySceneProps {
  growthStage: number; // 1 to 5
  onInteract?: (msg: string, resourceGain?: number) => void;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
}

export const WizardAcademyScene: React.FC<WizardAcademySceneProps> = ({ growthStage, onInteract }) => {
  const [spellCast, setSpellCast] = useState(false);
  const [cauldronBubbles, setCauldronBubbles] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  const spawnFloatingText = (x: number, y: number, text: string) => {
    const newId = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev, { id: newId, x, y, text }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== newId));
    }, 1200);
  };

  const handleNexusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playMagic();
    setSpellCast(true);
    setTimeout(() => setSpellCast(false), 900);
    spawnFloatingText(e.clientX || 350, (e.clientY || 160) - 40, '🔮 +5 Aether Shards!');
    if (onInteract) onInteract('The Grand Archmage Nexus channeled ancient ley energies!', 5);
  };

  const handleCauldronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playMagic();
    setCauldronBubbles(true);
    setTimeout(() => setCauldronBubbles(false), 800);
    spawnFloatingText(e.clientX || 180, (e.clientY || 260) - 30, '🧪 Elixir Brewed!');
  };

  const handleCrystalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playHarvest();
    spawnFloatingText(e.clientX || 540, (e.clientY || 220) - 30, '💎 Mana Crystal Charged!');
  };

  return (
    <div className="relative w-full h-[320px] md:h-[380px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#1a0524] via-[#240a33] to-[#0d0114] border border-pink-500/20 shadow-2xl flex items-center justify-center select-none">
      {/* Spell Surge Button */}
      <button
        type="button"
        onClick={() => {
          soundManager.playMagic();
          setSpellCast(true);
          setTimeout(() => setSpellCast(false), 1000);
        }}
        className="absolute top-4 left-4 z-30 p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-pink-500/30 text-pink-400 hover:text-white transition-all cursor-pointer shadow-lg hover:scale-105"
        title="Cast Astral Resonance Spell"
      >
        <Wand2 className={`w-4 h-4 ${spellCast ? 'animate-spin text-pink-300' : 'text-pink-400'}`} />
      </button>

      {/* Floating Animated Text Particles */}
      {floatingTexts.map((ft) => (
        <div
          key={ft.id}
          className="fixed z-50 pointer-events-none text-xs font-bold px-2 py-1 rounded-full bg-pink-500 text-slate-950 shadow-lg animate-bounce"
          style={{
            left: `${ft.x}px`,
            top: `${ft.y}px`,
            transition: 'all 0.8s ease-out',
          }}
        >
          {ft.text}
        </div>
      ))}

      {/* Ethereal Arcane Fog & Glowing Runes */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-10 left-1/3 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/3 w-70 h-70 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-300 rounded-full animate-sparkle" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-fuchsia-300 rounded-full animate-sparkle" style={{ animationDelay: '0.7s' }} />
      </div>

      {/* SVG Arcane Scene */}
      <svg
        viewBox="0 0 800 450"
        className="w-full h-full object-cover relative z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="crystalGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          <linearGradient id="spireStone" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          <filter id="pinkGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <polygon points="0,380 400,320 800,380 800,450 0,450" fill="#1e1b4b" opacity="0.8" />
        <ellipse cx="400" cy="380" rx="280" ry="24" fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray="14,8" />

        {/* STAGE 1: Philosopher's Cauldron (Interactive) */}
        {growthStage >= 1 && (
          <g transform="translate(180, 310)" className="animate-grow cursor-pointer" onClick={handleCauldronClick}>
            <ellipse cx="25" cy="50" rx="30" ry="10" fill="#3b0764" />
            <path d="M -5 50 Q 25 90 55 50 Z" fill="#1e1b4b" stroke="#6b21a8" strokeWidth="2" />
            <ellipse cx="25" cy="50" rx="28" ry="8" fill="#ec4899" filter="url(#pinkGlow)" />
            <circle cx="20" cy="40" r="4" fill="#fbcfe8" className={cauldronBubbles ? 'animate-bounce' : 'animate-float'} />
            <circle cx="32" cy="35" r="5" fill="#f472b6" className={cauldronBubbles ? 'animate-bounce' : 'animate-float'} style={{ animationDelay: '0.4s' }} />
          </g>
        )}

        {/* STAGE 2: Levitating Mana Crystal (Interactive) */}
        {growthStage >= 2 && (
          <g transform="translate(600, 260)" className="animate-float cursor-pointer" onClick={handleCrystalClick}>
            <polygon points="20,0 35,30 20,60 5,30" fill="url(#crystalGlow)" stroke="#fbcfe8" strokeWidth="1.5" filter="url(#pinkGlow)" />
            <polygon points="20,10 30,30 20,50 10,30" fill="#ffffff" opacity="0.7" />
            <ellipse cx="20" cy="80" rx="18" ry="6" fill="#3b0764" opacity="0.5" />
          </g>
        )}

        {/* STAGE 3: Astral Orrery Telescope */}
        {growthStage >= 3 && (
          <g transform="translate(250, 220)" className="animate-grow cursor-pointer" onClick={handleNexusClick}>
            <line x1="20" y1="80" x2="40" y2="20" stroke="#78716c" strokeWidth="4" />
            <line x1="60" y1="80" x2="40" y2="20" stroke="#78716c" strokeWidth="4" />
            <line x1="10" y1="10" x2="80" y2="40" stroke="#a855f7" strokeWidth="6" strokeLinecap="round" />
            <circle cx="80" cy="40" r="8" fill="#ec4899" filter="url(#pinkGlow)" />
          </g>
        )}

        {/* STAGE 4: Forbidden Grimoire Vault */}
        {growthStage >= 4 && (
          <g transform="translate(520, 200)" className="animate-grow cursor-pointer" onClick={handleNexusClick}>
            <polygon points="10,60 40,30 70,60 40,70" fill="#831843" stroke="#f472b6" strokeWidth="1.5" />
            <polygon points="10,60 40,70 40,85 10,75" fill="#4c0519" />
            <polygon points="70,60 40,70 40,85 70,75" fill="#4c0519" />
            <circle cx="40" cy="50" r="4" fill="#fef08a" filter="url(#pinkGlow)" />
          </g>
        )}

        {/* STAGE 5: Grand Archmage Spire Nexus (Interactive Tap) */}
        <g
          transform="translate(400, 160)"
          className={`cursor-pointer transition-all duration-300 ${spellCast ? 'scale-110' : 'animate-sway'}`}
          onClick={handleNexusClick}
        >
          {growthStage >= 5 && (
            <g className="animate-radar">
              <polygon points="0,-70 50,20 -50,20" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="8,6" filter="url(#pinkGlow)" />
            </g>
          )}

          <polygon
            points="-35,160 0,0 35,160"
            fill="url(#spireStone)"
            stroke="#a855f7"
            strokeWidth="2"
          />

          <polygon points="-45,70 -70,20 -25,50" fill="#4c0519" stroke="#ec4899" />
          <polygon points="45,70 70,20 25,50" fill="#4c0519" stroke="#ec4899" />

          <circle cx="0" cy={growthStage >= 5 ? -15 : 10} r={growthStage >= 5 ? 20 : 12} fill="#ec4899" filter="url(#pinkGlow)" className="animate-pulse-subtle" />
          <circle cx="0" cy={growthStage >= 5 ? -15 : 10} r={growthStage >= 5 ? 10 : 6} fill="#ffffff" />
        </g>
      </svg>

      {/* Dynamic Realm Stage Label Badge */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-pink-500/30 text-pink-400 text-xs font-semibold shadow-lg">
        <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
        Eldritch Spire &bull; Stage {growthStage}/5 (Tap to Channel Magic)
      </div>
    </div>
  );
};
