'use client';

import React from 'react';

interface TownSceneProps {
  growthStage: number; // 1 to 5
}

export const TownScene: React.FC<TownSceneProps> = ({ growthStage }) => {
  return (
    <div className="relative w-full h-[320px] md:h-[380px] rounded-2xl overflow-hidden bg-gradient-to-b from-amber-950/70 via-slate-900 to-amber-950/90 border border-amber-500/20 shadow-2xl flex items-center justify-center select-none">
      {/* Warm evening sunset glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-12 left-1/3 w-80 h-80 bg-amber-500/25 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-60 h-60 bg-orange-400/20 rounded-full blur-2xl" />
      </div>

      {/* SVG Medieval Town Scene */}
      <svg
        viewBox="0 0 800 450"
        className="w-full h-full object-cover relative z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="roofTile" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <linearGradient id="stoneWall" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <filter id="lanternGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Mountain Silhouette Background */}
        <polygon points="0,320 180,210 320,320 540,190 700,310 800,260 800,450 0,450" fill="#1e1b4b" opacity="0.6" />

        {/* Cobblestone Hills */}
        <path d="M0 360 Q 200 320, 400 350 T 800 340 L 800 450 L 0 450 Z" fill="#292524" />

        {/* Cobblestone Pathway */}
        <path d="M 360 450 L 380 370 L 420 370 L 440 450 Z" fill="#44403c" stroke="#78716c" strokeDasharray="6,4" />

        {/* STAGE 1: Cozy Artisan Cottage */}
        {growthStage >= 1 && (
          <g transform="translate(140, 280)" className="animate-grow">
            {/* House Body */}
            <rect x="0" y="40" width="80" height="60" fill="#78350f" stroke="#451a03" strokeWidth="2" />
            {/* Timber Beams */}
            <line x1="0" y1="40" x2="80" y2="100" stroke="#451a03" strokeWidth="2" />
            <line x1="80" y1="40" x2="0" y2="100" stroke="#451a03" strokeWidth="2" />
            {/* Roof */}
            <polygon points="-10,40 40,0 90,40" fill="url(#roofTile)" stroke="#451a03" strokeWidth="2" />
            {/* Chimney & Smoke */}
            <rect x="55" y="-10" width="16" height="30" fill="#44403c" />
            <circle cx="63" cy="-20" r="6" fill="#94a3b8" opacity="0.4" className="animate-float" />
            {/* Glowing Window */}
            <rect x="25" y="55" width="22" height="22" rx="2" fill="#fde047" filter="url(#lanternGlow)" />
            <line x1="36" y1="55" x2="36" y2="77" stroke="#451a03" />
            <line x1="25" y1="66" x2="47" y2="66" stroke="#451a03" />
          </g>
        )}

        {/* STAGE 2: Highland Windmill */}
        {growthStage >= 2 && (
          <g transform="translate(620, 220)" className="animate-grow">
            {/* Windmill Base */}
            <polygon points="15,160 30,50 60,50 75,160" fill="url(#stoneWall)" stroke="#1e293b" />
            <polygon points="20,50 45,20 70,50" fill="url(#roofTile)" />
            {/* Windmill Hub & Turning Sails */}
            <g transform="translate(45, 50)" className="animate-radar">
              <circle cx="0" cy="0" r="8" fill="#451a03" />
              {/* 4 Sails */}
              <line x1="0" y1="0" x2="0" y2="-60" stroke="#b45309" strokeWidth="3" />
              <rect x="2" y="-55" width="16" height="40" fill="#fef08a" opacity="0.7" />

              <line x1="0" y1="0" x2="60" y2="0" stroke="#b45309" strokeWidth="3" />
              <rect x="15" y="2" width="40" height="16" fill="#fef08a" opacity="0.7" />

              <line x1="0" y1="0" x2="0" y2="60" stroke="#b45309" strokeWidth="3" />
              <rect x="-18" y="15" width="16" height="40" fill="#fef08a" opacity="0.7" />

              <line x1="0" y1="0" x2="-60" y2="0" stroke="#b45309" strokeWidth="3" />
              <rect x="-55" y="-18" width="40" height="16" fill="#fef08a" opacity="0.7" />
            </g>
          </g>
        )}

        {/* STAGE 3: Guild Market Square */}
        {growthStage >= 3 && (
          <g transform="translate(250, 320)" className="animate-grow">
            {/* Market Stall Canopy */}
            <polygon points="0,20 50,0 100,20 90,30 10,30" fill="#dc2626" />
            <polygon points="15,20 35,5 55,20" fill="#fef08a" />
            <polygon points="65,20 85,5 95,20" fill="#fef08a" />
            {/* Stall Wooden Legs */}
            <line x1="15" y1="30" x2="15" y2="65" stroke="#78350f" strokeWidth="3" />
            <line x1="85" y1="30" x2="85" y2="65" stroke="#78350f" strokeWidth="3" />
            {/* Carts of Fruit & Grain */}
            <rect x="25" y="45" width="50" height="20" rx="3" fill="#92400e" />
            <circle cx="35" cy="42" r="5" fill="#f59e0b" />
            <circle cx="48" cy="40" r="6" fill="#ef4444" />
            <circle cx="62" cy="42" r="5" fill="#10b981" />
          </g>
        )}

        {/* STAGE 4: Great Clockwork Tower */}
        {growthStage >= 4 && (
          <g transform="translate(510, 180)" className="animate-grow">
            {/* Tower Shaft */}
            <rect x="0" y="40" width="50" height="160" fill="url(#stoneWall)" stroke="#0f172a" />
            {/* Spire Roof */}
            <polygon points="-8,40 25,-20 58,40" fill="url(#roofTile)" stroke="#451a03" />
            {/* Clock Face */}
            <circle cx="25" cy="70" r="16" fill="#fef3c7" stroke="#b45309" strokeWidth="2" filter="url(#lanternGlow)" />
            <line x1="25" y1="70" x2="25" y2="60" stroke="#451a03" strokeWidth="2" />
            <line x1="25" y1="70" x2="33" y2="70" stroke="#451a03" strokeWidth="2" />
          </g>
        )}

        {/* STAGE 5: Castle of the Grand Monarch (Central Palace) */}
        <g transform="translate(380, 200)" className="animate-sway">
          {/* Main Castle Gatehouse */}
          <rect
            x="-60"
            y={growthStage >= 5 ? 40 : 80}
            width="120"
            height={growthStage >= 5 ? 140 : 100}
            fill="url(#stoneWall)"
            stroke="#1e293b"
            strokeWidth="2"
          />

          {/* Castle Towers (Left & Right) */}
          <rect x="-80" y="30" width="30" height="150" fill="url(#stoneWall)" stroke="#1e293b" />
          <polygon points="-85,30 -65,-20 -45,30" fill="url(#roofTile)" stroke="#451a03" />

          <rect x="50" y="30" width="30" height="150" fill="url(#stoneWall)" stroke="#1e293b" />
          <polygon points="45,30 65,-20 85,30" fill="url(#roofTile)" stroke="#451a03" />

          {/* Arched Portcullis */}
          <path d="M -20 180 L -20 120 Q 0 100 20 120 L 20 180 Z" fill="#0f172a" stroke="#d97706" strokeWidth="2" />

          {/* Royal Banners & Crest */}
          {growthStage >= 5 && (
            <g transform="translate(0, 60)">
              <rect x="-15" y="0" width="30" height="45" fill="#dc2626" />
              <polygon points="-15,45 0,35 15,45" fill="#dc2626" />
              <circle cx="0" cy="18" r="8" fill="#fbbf24" filter="url(#lanternGlow)" />
            </g>
          )}
        </g>
      </svg>

      {/* Dynamic Realm Stage Label Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-500/30 text-amber-400 text-xs font-semibold shadow-lg">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        Aethelgard &bull; Stage {growthStage}/5
      </div>
    </div>
  );
};
