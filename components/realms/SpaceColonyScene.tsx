'use client';

import React, { useState } from 'react';
import { soundManager } from '@/lib/sound';
import { Rocket, Sparkles, Orbit } from 'lucide-react';

interface SpaceColonySceneProps {
  growthStage: number; // 1 to 5
  onInteract?: (msg: string, resourceGain?: number) => void;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
}

export const SpaceColonyScene: React.FC<SpaceColonySceneProps> = ({ growthStage, onInteract }) => {
  const [warpPulse, setWarpPulse] = useState(false);
  const [shuttleFly, setShuttleFly] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  const spawnFloatingText = (x: number, y: number, text: string) => {
    const newId = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev, { id: newId, x, y, text }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== newId));
    }, 1200);
  };

  const handleWarpCoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playMagic();
    setWarpPulse(true);
    setTimeout(() => setWarpPulse(false), 800);
    spawnFloatingText(e.clientX || 350, (e.clientY || 180) - 40, '🚀 +5 Antimatter Cells!');
    if (onInteract) onInteract('Singularity Quantum Core output energized!', 5);
  };

  const handleShuttleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playLaser();
    setShuttleFly(true);
    setTimeout(() => setShuttleFly(false), 900);
    spawnFloatingText(e.clientX || 220, (e.clientY || 120) - 30, '🌌 Shuttle Mission Launched!');
  };

  return (
    <div className="relative w-full h-[320px] md:h-[380px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#0b091a] via-[#110f2e] to-[#080718] border border-violet-500/20 shadow-2xl flex items-center justify-center select-none">
      {/* Hyper-Drive Speed Trigger */}
      <button
        type="button"
        onClick={() => {
          soundManager.playUnlock();
          setWarpPulse(true);
          setTimeout(() => setWarpPulse(false), 1000);
        }}
        className="absolute top-4 left-4 z-30 p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-violet-500/30 text-violet-400 hover:text-white transition-all cursor-pointer shadow-lg hover:scale-105"
        title="Pulse Hyper-Warp Resonance"
      >
        <Orbit className={`w-4 h-4 ${warpPulse ? 'animate-spin text-purple-300' : 'text-violet-400'}`} />
      </button>

      {/* Floating Animated Text Particles */}
      {floatingTexts.map((ft) => (
        <div
          key={ft.id}
          className="fixed z-50 pointer-events-none text-xs font-bold px-2 py-1 rounded-full bg-violet-500 text-slate-950 shadow-lg animate-bounce"
          style={{
            left: `${ft.x}px`,
            top: `${ft.y}px`,
            transition: 'all 0.8s ease-out',
          }}
        >
          {ft.text}
        </div>
      ))}

      {/* Starfield and Nebula Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute -top-12 left-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute top-10 left-10 w-1.5 h-1.5 bg-white rounded-full animate-sparkle" />
        <div className="absolute top-20 right-20 w-1 h-1 bg-cyan-200 rounded-full animate-sparkle" style={{ animationDelay: '0.6s' }} />
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-violet-200 rounded-full animate-sparkle" style={{ animationDelay: '1.2s' }} />
        <div className="absolute bottom-20 left-20 w-1 h-1 bg-white rounded-full animate-sparkle" style={{ animationDelay: '1.8s' }} />
      </div>

      {/* SVG Space Colony Scene */}
      <svg
        viewBox="0 0 800 450"
        className="w-full h-full object-cover relative z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="stationHull" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="solarBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          <radialGradient id="warpGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b0764" stopOpacity="0" />
          </radialGradient>

          <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle cx="400" cy="750" r="450" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" opacity="0.7" />
        <ellipse cx="400" cy="300" rx="350" ry="12" fill="#818cf8" opacity="0.2" />

        {/* STAGE 1: Helios Solar Arrays */}
        {growthStage >= 1 && (
          <g transform="translate(130, 240)" className="animate-grow cursor-pointer" onClick={handleWarpCoreClick}>
            <rect x="35" y="0" width="8" height="120" fill="#334155" />
            <rect x="0" y="20" width="35" height="70" fill="url(#solarBlue)" stroke="#38bdf8" strokeWidth="1" />
            <rect x="43" y="20" width="35" height="70" fill="url(#solarBlue)" stroke="#38bdf8" strokeWidth="1" />
            <line x1="0" y1="43" x2="35" y2="43" stroke="#93c5fd" />
            <line x1="0" y1="66" x2="35" y2="66" stroke="#93c5fd" />
            <line x1="43" y1="43" x2="78" y2="43" stroke="#93c5fd" />
            <line x1="43" y1="66" x2="78" y2="66" stroke="#93c5fd" />
          </g>
        )}

        {/* STAGE 2: Lunar Hydroponic Bio-Dome */}
        {growthStage >= 2 && (
          <g transform="translate(600, 260)" className="animate-grow cursor-pointer" onClick={handleWarpCoreClick}>
            <ellipse cx="40" cy="50" rx="55" ry="16" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1.5" />
            <path d="M -10 50 A 50 50 0 0 1 90 50 Z" fill="#10b981" opacity="0.3" stroke="#6ee7b7" strokeWidth="2" filter="url(#purpleGlow)" />
            <circle cx="25" cy="40" r="10" fill="#34d399" opacity="0.8" />
            <circle cx="45" cy="35" r="14" fill="#059669" opacity="0.8" />
            <circle cx="60" cy="42" r="8" fill="#a7f3d0" opacity="0.9" />
          </g>
        )}

        {/* STAGE 3: Orbital Explorer Starship (Clickable Flying) */}
        {growthStage >= 3 && (
          <g
            transform="translate(260, 150)"
            className={`cursor-pointer transition-transform duration-500 ${shuttleFly ? 'scale-125 -translate-y-4' : 'animate-float'}`}
            onClick={handleShuttleClick}
          >
            <polygon points="0,20 60,0 120,20 60,35" fill="url(#stationHull)" stroke="#a855f7" strokeWidth="1.5" />
            <polygon points="65,4 85,10 75,18 60,12" fill="#38bdf8" filter="url(#purpleGlow)" />
            <ellipse cx="0" cy="20" rx={shuttleFly ? '16' : '8'} ry="4" fill="#c084fc" filter="url(#purpleGlow)" />
          </g>
        )}

        {/* STAGE 4: Singularity Quantum Core */}
        {growthStage >= 4 && (
          <g transform="translate(540, 150)" className="animate-pulse-subtle cursor-pointer" onClick={handleWarpCoreClick}>
            <circle cx="0" cy="0" r="28" fill="url(#warpGlow)" />
            <circle cx="0" cy="0" r="12" fill="#ffffff" filter="url(#purpleGlow)" />
            <ellipse cx="0" cy="0" rx="40" ry="12" fill="none" stroke="#a855f7" strokeWidth="2" transform="rotate(30)" />
            <ellipse cx="0" cy="0" rx="40" ry="12" fill="none" stroke="#38bdf8" strokeWidth="2" transform="rotate(-30)" />
          </g>
        )}

        {/* STAGE 5: Central Orbital Mega-Station & Hyper-Warp Gateway */}
        <g
          transform="translate(400, 220)"
          className={`cursor-pointer transition-all duration-300 ${warpPulse ? 'scale-110' : 'animate-sway'}`}
          onClick={handleWarpCoreClick}
        >
          {growthStage >= 5 && (
            <g className="animate-radar">
              <circle cx="0" cy="0" r="100" fill="none" stroke="#c084fc" strokeWidth="6" strokeDasharray="25,15" filter="url(#purpleGlow)" />
              <circle cx="0" cy="0" r="85" fill="url(#warpGlow)" opacity="0.6" />
            </g>
          )}

          <circle cx="0" cy="0" r={growthStage >= 5 ? 55 : 40} fill="url(#stationHull)" stroke="#8b5cf6" strokeWidth="3" />
          <circle cx="0" cy="0" r={growthStage >= 5 ? 24 : 16} fill="#a855f7" filter="url(#purpleGlow)" className="animate-pulse-subtle" />

          <line x1="-120" y1="0" x2="120" y2="0" stroke="#475569" strokeWidth="8" />
          <circle cx="-120" cy="0" r="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="120" cy="0" r="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />

          <line x1="0" y1="-80" x2="0" y2="80" stroke="#475569" strokeWidth="8" />
          <circle cx="0" cy="-80" r="16" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
          <circle cx="0" cy="80" r="16" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
        </g>
      </svg>

      {/* Dynamic Realm Stage Label Badge */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-violet-500/30 text-violet-400 text-xs font-semibold shadow-lg">
        <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
        Astra Zenith &bull; Stage {growthStage}/5 (Tap to Energize)
      </div>
    </div>
  );
};
