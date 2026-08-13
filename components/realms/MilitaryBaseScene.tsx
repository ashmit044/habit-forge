'use client';

import React from 'react';

interface MilitaryBaseSceneProps {
  growthStage: number; // 1 to 5
}

export const MilitaryBaseScene: React.FC<MilitaryBaseSceneProps> = ({ growthStage }) => {
  return (
    <div className="relative w-full h-[320px] md:h-[380px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950/90 border border-blue-500/20 shadow-2xl flex items-center justify-center select-none">
      {/* Background Tactical Grid & Radar Scan Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-10 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-60 h-60 bg-cyan-400/15 rounded-full blur-2xl" />
        {/* Holographic Wireframe Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* SVG Military Base Scene */}
      <svg
        viewBox="0 0 800 450"
        className="w-full h-full object-cover relative z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="armorMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <filter id="blueGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Tactical Ground Platform */}
        <path
          d="M 0 350 L 150 330 L 650 330 L 800 350 L 800 450 L 0 450 Z"
          fill="#1e293b"
          stroke="#3b82f6"
          strokeWidth="1.5"
          opacity="0.9"
        />

        {/* Hazard Stripes Along Perimeter */}
        <line x1="150" y1="334" x2="650" y2="334" stroke="#eab308" strokeWidth="4" strokeDasharray="16,10" />

        {/* STAGE 1: Sentry Post & Sandbags */}
        {growthStage >= 1 && (
          <g transform="translate(180, 290)" className="animate-grow">
            {/* Sandbags */}
            <rect x="0" y="25" width="60" height="20" rx="6" fill="#78716c" />
            <rect x="10" y="10" width="40" height="18" rx="5" fill="#a8a29e" />
            {/* Sentry Turret */}
            <rect x="25" y="-10" width="10" height="22" fill="#334155" />
            <circle cx="30" cy="-10" r="10" fill="#475569" />
            <line x1="30" y1="-10" x2="55" y2="-10" stroke="#0284c7" strokeWidth="4" />
            <circle cx="55" cy="-10" r="3" fill="#38bdf8" filter="url(#blueGlow)" />
            {/* Aiming Laser Line */}
            <line x1="58" y1="-10" x2="160" y2="-10" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" opacity="0.8" />
          </g>
        )}

        {/* STAGE 2: Phased Array Radar Station */}
        {growthStage >= 2 && (
          <g transform="translate(620, 240)" className="animate-grow">
            {/* Radar Tower */}
            <polygon points="10,90 25,10 35,10 50,90" fill="url(#armorMetal)" stroke="#64748b" />
            {/* Rotating Dish */}
            <g transform="translate(30, 0)">
              <ellipse cx="0" cy="0" rx="35" ry="14" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <line x1="0" y1="0" x2="0" y2="-20" stroke="#38bdf8" strokeWidth="3" />
              <circle cx="0" cy="-20" r="4" fill="#38bdf8" filter="url(#blueGlow)" />
            </g>
          </g>
        )}

        {/* STAGE 3: Autonomous Hover Recon Drone */}
        {growthStage >= 3 && (
          <g transform="translate(320, 160)" className="animate-float">
            {/* Drone Body */}
            <ellipse cx="0" cy="0" rx="30" ry="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="0" cy="0" r="6" fill="#38bdf8" filter="url(#blueGlow)" />
            {/* Drone Rotors */}
            <line x1="-40" y1="-5" x2="-20" y2="-5" stroke="#94a3b8" strokeWidth="3" />
            <ellipse cx="-30" cy="-5" rx="14" ry="3" fill="#38bdf8" opacity="0.6" />
            <line x1="20" y1="-5" x2="40" y2="-5" stroke="#94a3b8" strokeWidth="3" />
            <ellipse cx="30" cy="-5" rx="14" ry="3" fill="#38bdf8" opacity="0.6" />
            {/* Thruster Glow Underneath */}
            <ellipse cx="0" cy="14" rx="10" ry="4" fill="#0284c7" filter="url(#blueGlow)" />
          </g>
        )}

        {/* STAGE 4: Armored Combat Tank / Cyber Vehicle */}
        {growthStage >= 4 && (
          <g transform="translate(260, 310)" className="animate-grow">
            {/* Tank Treads */}
            <rect x="0" y="20" width="130" height="25" rx="12" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <circle cx="20" cy="32" r="8" fill="#334155" />
            <circle cx="45" cy="32" r="8" fill="#334155" />
            <circle cx="70" cy="32" r="8" fill="#334155" />
            <circle cx="95" cy="32" r="8" fill="#334155" />
            <circle cx="115" cy="32" r="6" fill="#334155" />

            {/* Tank Hull */}
            <polygon points="15,20 30,0 105,0 120,20" fill="url(#armorMetal)" stroke="#64748b" />
            {/* Turret */}
            <rect x="45" y="-14" width="45" height="16" rx="4" fill="#1e293b" stroke="#0284c7" />
            <rect x="90" y="-10" width="55" height="8" fill="#334155" />
            <circle cx="145" cy="-6" r="4" fill="#38bdf8" filter="url(#blueGlow)" />
          </g>
        )}

        {/* STAGE 5: Aegis Heavy Titan War Mech & Orbital Defense Battery */}
        <g transform="translate(480, 230)" className="animate-sway">
          {/* Mech Torso */}
          <polygon
            points={
              growthStage >= 5
                ? '-45,0 45,0 35,70 -35,70'
                : '-30,20 30,20 20,70 -20,70'
            }
            fill="url(#armorMetal)"
            stroke="#38bdf8"
            strokeWidth="2"
          />

          {/* Mech Core Reactor */}
          <circle
            cx="0"
            cy="35"
            r={growthStage >= 5 ? 16 : 10}
            fill="#38bdf8"
            filter="url(#blueGlow)"
            className="animate-pulse-subtle"
          />

          {/* Heavy Shoulder Armor */}
          <polygon points="-75,-15 -45,0 -45,30 -70,20" fill="#1e293b" stroke="#64748b" />
          <polygon points="75,-15 45,0 45,30 70,20" fill="#1e293b" stroke="#64748b" />

          {/* Mech Legs */}
          <rect x="-30" y="70" width="18" height="60" fill="#334155" stroke="#1e293b" />
          <polygon points="-38,130 -10,130 -14,140 -42,140" fill="#0f172a" />

          <rect x="12" y="70" width="18" height="60" fill="#334155" stroke="#1e293b" />
          <polygon points="10,130 38,130 42,140 14,140" fill="#0f172a" />

          {/* Stage 5 Plasma Cannon Arm */}
          {growthStage >= 5 && (
            <g transform="translate(65, 10)">
              <rect x="0" y="0" width="60" height="14" rx="3" fill="#0f172a" stroke="#38bdf8" />
              <line x1="5" y1="7" x2="55" y2="7" stroke="#38bdf8" strokeWidth="4" filter="url(#blueGlow)" />
            </g>
          )}
        </g>
      </svg>

      {/* Dynamic Realm Stage Label Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-lg">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
        Aegis Vanguard &bull; Stage {growthStage}/5
      </div>
    </div>
  );
};
