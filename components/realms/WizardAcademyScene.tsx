'use client';

import React from 'react';

interface WizardAcademySceneProps {
  growthStage: number; // 1 to 5
}

export const WizardAcademyScene: React.FC<WizardAcademySceneProps> = ({ growthStage }) => {
  return (
    <div className="relative w-full h-[320px] md:h-[380px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#1b0a1d] via-[#150a21] to-[#0d0414] border border-pink-500/20 shadow-2xl flex items-center justify-center select-none">
      {/* Mystic Mana Mist & Ambient Runes */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-12 left-1/3 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        {/* Floating Sparks */}
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-pink-300 rounded-full animate-sparkle" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-fuchsia-200 rounded-full animate-sparkle" style={{ animationDelay: '0.7s' }} />
        <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 bg-rose-200 rounded-full animate-sparkle" style={{ animationDelay: '1.3s' }} />
      </div>

      {/* SVG Arcane Scene */}
      <svg
        viewBox="0 0 800 450"
        className="w-full h-full object-cover relative z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="arcaneStone" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a044e" />
            <stop offset="50%" stopColor="#2e1065" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          <linearGradient id="crystalGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#c026d3" />
          </linearGradient>

          <filter id="pinkGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Floating Levitation Rock Platforms */}
        <path d="M 100 370 Q 200 350 300 370 Q 200 410 100 370 Z" fill="#2e1065" stroke="#ec4899" strokeWidth="1" />
        <path d="M 500 370 Q 600 350 700 370 Q 600 410 500 370 Z" fill="#2e1065" stroke="#ec4899" strokeWidth="1" />

        {/* Center Grand Leyline Platform */}
        <ellipse cx="400" cy="380" rx="180" ry="40" fill="#1e1b4b" stroke="#ec4899" strokeWidth="2" />
        <ellipse cx="400" cy="380" rx="140" ry="26" fill="none" stroke="#f472b6" strokeWidth="1" strokeDasharray="8,6" />

        {/* STAGE 1: Philosopher’s Cauldron & Mystic Vapor */}
        {growthStage >= 1 && (
          <g transform="translate(180, 310)" className="animate-grow">
            {/* Cauldron Base */}
            <ellipse cx="25" cy="35" rx="25" ry="20" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />
            <ellipse cx="25" cy="20" rx="20" ry="8" fill="#f43f5e" filter="url(#pinkGlow)" />
            {/* Rising Bubbles / Smoke */}
            <circle cx="20" cy="5" r="4" fill="#fbcfe8" opacity="0.8" className="animate-float" />
            <circle cx="32" cy="-5" r="5" fill="#f472b6" opacity="0.6" className="animate-float" style={{ animationDelay: '0.4s' }} />
          </g>
        )}

        {/* STAGE 2: Levitating Mana Crystal Pillars */}
        {growthStage >= 2 && (
          <g transform="translate(590, 270)" className="animate-float-slow">
            {/* Floating Mana Crystal */}
            <polygon points="25,-20 45,25 25,70 5,25" fill="url(#crystalGlow)" stroke="#fbcfe8" strokeWidth="2" filter="url(#pinkGlow)" />
            {/* Energy Arcs */}
            <path d="M 0 25 Q 25 10 50 25" fill="none" stroke="#f472b6" strokeWidth="2" opacity="0.8" />
          </g>
        )}

        {/* STAGE 3: Astral Observatory Orrery */}
        {growthStage >= 3 && (
          <g transform="translate(260, 200)" className="animate-radar">
            {/* Orrery Golden Rings */}
            <circle cx="0" cy="0" r="30" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="10,5" />
            <ellipse cx="0" cy="0" rx="42" ry="16" fill="none" stroke="#f472b6" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="10" fill="#fde047" filter="url(#pinkGlow)" />
            <circle cx="30" cy="0" r="5" fill="#38bdf8" />
          </g>
        )}

        {/* STAGE 4: Ancient Forbidden Grimoire Vault */}
        {growthStage >= 4 && (
          <g transform="translate(510, 290)" className="animate-grow">
            {/* Open Levitating Book */}
            <polygon points="10,20 30,10 50,20 30,30" fill="#fdf4ff" stroke="#a21caf" strokeWidth="1" />
            <polygon points="0,22 10,20 30,30 20,32" fill="#86198f" />
            <polygon points="60,22 50,20 30,30 40,32" fill="#86198f" />
            <circle cx="30" cy="5" r="4" fill="#f472b6" filter="url(#pinkGlow)" />
          </g>
        )}

        {/* STAGE 5: Central Archmage Spire Nexus */}
        <g transform="translate(400, 180)" className="animate-sway">
          {/* Main Tower Spire */}
          <polygon
            points={
              growthStage >= 5
                ? '-35,200 35,200 20,-20 -20,-20'
                : '-25,200 25,200 15,20 -15,20'
            }
            fill="url(#arcaneStone)"
            stroke="#ec4899"
            strokeWidth="2"
          />

          {/* Tower Windows Glowing with Aether */}
          <rect x="-6" y="80" width="12" height="24" rx="4" fill="#f472b6" filter="url(#pinkGlow)" />
          <rect x="-6" y="130" width="12" height="24" rx="4" fill="#f472b6" filter="url(#pinkGlow)" />

          {/* Spire Pinnacle Floating Crystal Nexus */}
          <polygon points="0,-80 18,-40 0,0 -18,-40" fill="url(#crystalGlow)" stroke="#ffffff" strokeWidth="2" filter="url(#pinkGlow)" className="animate-pulse-subtle" />

          {/* Stage 5 Leyline Beam */}
          {growthStage >= 5 && (
            <line x1="0" y1="-80" x2="0" y2="-200" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" filter="url(#pinkGlow)" className="animate-pulse" />
          )}
        </g>
      </svg>

      {/* Dynamic Realm Stage Label Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-pink-500/30 text-pink-400 text-xs font-semibold shadow-lg">
        <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
        Eldritch Spire &bull; Stage {growthStage}/5
      </div>
    </div>
  );
};
