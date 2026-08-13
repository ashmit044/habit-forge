'use client';

import React from 'react';

interface GardenSceneProps {
  growthStage: number; // 1 to 5
  particleCount?: number;
}

export const GardenScene: React.FC<GardenSceneProps> = ({ growthStage }) => {
  return (
    <div className="relative w-full h-[320px] md:h-[380px] rounded-2xl overflow-hidden bg-gradient-to-b from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/20 shadow-2xl flex items-center justify-center select-none">
      {/* Ambient background sky & sun rays */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-12 left-1/4 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-subtle" />
        <div className="absolute top-10 right-1/4 w-60 h-60 bg-amber-400/15 rounded-full blur-2xl" />
        {/* Floating Sunlit Pollen Particles */}
        <div className="absolute top-1/4 left-1/5 w-2 h-2 bg-emerald-300 rounded-full blur-[1px] animate-sparkle" />
        <div className="absolute top-1/3 right-1/3 w-2.5 h-2.5 bg-amber-200 rounded-full blur-[1px] animate-sparkle" style={{ animationDelay: '0.8s' }} />
        <div className="absolute top-1/2 left-2/3 w-1.5 h-1.5 bg-teal-200 rounded-full blur-[1px] animate-sparkle" style={{ animationDelay: '1.4s' }} />
      </div>

      {/* SVG Botanical Scene */}
      <svg
        viewBox="0 0 800 450"
        className="w-full h-full object-cover relative z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="gardenSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#064e3b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="gardenSoil" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="30%" stopColor="#064e3b" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>

          <linearGradient id="treeBark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="50%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>

          <radialGradient id="lotusGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>

          <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Rolling Green Hills in Background */}
        <path
          d="M0 320 Q 200 260, 400 300 T 800 290 L 800 450 L 0 450 Z"
          fill="#065f46"
          opacity="0.7"
        />
        <path
          d="M0 350 Q 250 310, 500 340 T 800 330 L 800 450 L 0 450 Z"
          fill="url(#gardenSoil)"
        />

        {/* Dynamic Flora Elements based on Growth Stage */}

        {/* STAGE 1: Sprouts & Moss Clearings */}
        {growthStage >= 1 && (
          <g className="animate-grow">
            {/* Left Sprout */}
            <path
              d="M 180 370 Q 170 340 185 320 Q 200 340 180 370"
              fill="#34d399"
              stroke="#059669"
              strokeWidth="2"
            />
            <path
              d="M 185 335 Q 210 325 215 340 Q 195 350 185 335"
              fill="#6ee7b7"
            />
            {/* Small Flower */}
            <circle cx="185" cy="320" r="5" fill="#fef08a" />

            {/* Right Sprout */}
            <path
              d="M 620 380 Q 640 350 630 330 Q 610 350 620 380"
              fill="#34d399"
              stroke="#059669"
              strokeWidth="2"
            />
            <path
              d="M 625 345 Q 600 335 595 350 Q 615 360 625 345"
              fill="#6ee7b7"
            />
            <circle cx="630" cy="330" r="6" fill="#f472b6" />
          </g>
        )}

        {/* STAGE 2: Blooming Water Lilies & Crystal Pond */}
        {growthStage >= 2 && (
          <g className="animate-grow">
            {/* Pond Reflection */}
            <ellipse cx="400" cy="385" rx="160" ry="32" fill="#0d9488" opacity="0.4" />
            <ellipse cx="400" cy="385" rx="140" ry="24" fill="#14b8a6" opacity="0.6" />
            <ellipse cx="400" cy="385" rx="110" ry="16" fill="url(#lotusGlow)" />

            {/* Water Lilies */}
            <g transform="translate(350, 375)">
              <ellipse cx="0" cy="0" rx="18" ry="7" fill="#047857" />
              <circle cx="-2" cy="-4" r="5" fill="#f43f5e" />
              <circle cx="4" cy="-5" r="4" fill="#fda4af" />
            </g>
            <g transform="translate(440, 380)">
              <ellipse cx="0" cy="0" rx="22" ry="8" fill="#047857" />
              <circle cx="2" cy="-5" r="6" fill="#ec4899" />
              <circle cx="-4" cy="-4" r="4" fill="#fbcfe8" />
            </g>
          </g>
        )}

        {/* STAGE 3: Luminescent Sakura & Mystic Ferns */}
        {growthStage >= 3 && (
          <g className="animate-grow">
            {/* Sakura Bush Left */}
            <g transform="translate(140, 290)">
              <path d="M 0 60 Q 20 20 40 0 Q 60 20 80 60 Z" fill="#065f46" />
              <circle cx="30" cy="15" r="22" fill="#f472b6" opacity="0.85" filter="url(#emeraldGlow)" />
              <circle cx="55" cy="20" r="18" fill="#fb7185" opacity="0.85" />
              <circle cx="40" cy="35" r="24" fill="#fbcfe8" opacity="0.9" />
            </g>

            {/* Radiant Ferns Right */}
            <g transform="translate(640, 290)">
              <path d="M 0 60 Q 30 10 60 0 Q 70 30 80 60 Z" fill="#047857" />
              <circle cx="40" cy="20" r="20" fill="#34d399" opacity="0.8" filter="url(#emeraldGlow)" />
              <circle cx="25" cy="35" r="16" fill="#a7f3d0" opacity="0.9" />
            </g>
          </g>
        )}

        {/* STAGE 4: Ancient Carved Stone Lanterns & Bioluminescent Willow */}
        {growthStage >= 4 && (
          <g className="animate-grow">
            {/* Stone Lantern Left */}
            <g transform="translate(250, 310)">
              <rect x="0" y="30" width="16" height="40" rx="2" fill="#64748b" />
              <polygon points="-6,30 22,30 14,14 -2,14" fill="#475569" />
              <rect x="2" y="18" width="12" height="12" fill="#fef08a" filter="url(#emeraldGlow)" opacity="0.9" />
            </g>
            {/* Stone Lantern Right */}
            <g transform="translate(530, 310)">
              <rect x="0" y="30" width="16" height="40" rx="2" fill="#64748b" />
              <polygon points="-6,30 22,30 14,14 -2,14" fill="#475569" />
              <rect x="2" y="18" width="12" height="12" fill="#fef08a" filter="url(#emeraldGlow)" opacity="0.9" />
            </g>
          </g>
        )}

        {/* STAGE 5 (or Main Central Tree scaling by stage) */}
        <g transform="translate(400, 360)" className="animate-sway">
          {/* Main Tree Trunk */}
          <path
            d={`M -24 0 C -30 -60 -15 -140 -8 -180 C 0 -190 8 -190 16 -180 C 25 -140 35 -60 28 0 Z`}
            fill="url(#treeBark)"
          />
          {/* Roots */}
          <path d="M -24 0 C -45 10 -60 20 -70 24" stroke="#451a03" strokeWidth="8" strokeLinecap="round" />
          <path d="M 28 0 C 50 10 65 20 75 24" stroke="#451a03" strokeWidth="8" strokeLinecap="round" />

          {/* Tree Canopy Layer 1 */}
          <circle
            cx="0"
            cy={growthStage >= 5 ? -210 : -180}
            r={growthStage >= 5 ? 90 : growthStage >= 3 ? 70 : 50}
            fill="#059669"
            opacity="0.9"
            filter="url(#emeraldGlow)"
          />
          {/* Tree Canopy Layer 2 */}
          <circle
            cx="-35"
            cy={growthStage >= 5 ? -220 : -190}
            r={growthStage >= 5 ? 70 : growthStage >= 3 ? 55 : 40}
            fill="#10b981"
            opacity="0.85"
          />
          {/* Tree Canopy Layer 3 */}
          <circle
            cx="35"
            cy={growthStage >= 5 ? -220 : -190}
            r={growthStage >= 5 ? 70 : growthStage >= 3 ? 55 : 40}
            fill="#34d399"
            opacity="0.85"
          />
          {/* Top Crown */}
          <circle
            cx="0"
            cy={growthStage >= 5 ? -260 : -220}
            r={growthStage >= 5 ? 65 : growthStage >= 3 ? 45 : 30}
            fill="#6ee7b7"
            opacity="0.95"
          />

          {/* Stage 5 Sacred Core of Vitality */}
          {growthStage >= 5 && (
            <g transform="translate(0, -210)" className="animate-pulse-subtle">
              <circle cx="0" cy="0" r="16" fill="#fef08a" filter="url(#emeraldGlow)" />
              <circle cx="0" cy="0" r="8" fill="#ffffff" />
            </g>
          )}
        </g>
      </svg>

      {/* Dynamic Realm Stage Label Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        Botanical Sanctuary &bull; Stage {growthStage}/5
      </div>
    </div>
  );
};
