# ⚔️ HabitForge: Realms of Progress
### *The Gamified Habit Tracker That Expands Living Virtual Worlds*

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-10b981?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**HabitForge** is a gamified habit tracking web and mobile application designed to transform daily discipline into an immersive RPG expansion game. Every habit you conquer generates XP, gold coins, and elemental resources that nurture and evolve 5 distinct virtual realms.

---

## 🌟 The 5 Living Virtual Realms

| Realm | Archetype | Growth Catalysts | Stage 1 $\rightarrow$ Stage 5 Evolution |
| :--- | :--- | :--- | :--- |
| 🌿 **Celestial Sanctuary** | Botanical Garden | Sunlit Dew & Hydration | Sprout Clearing $\rightarrow$ Blooming Grove $\rightarrow$ Luminescent Orchard $\rightarrow$ Sacred Arboretum $\rightarrow$ **Eternal Tree of Life** |
| 🛡️ **Aegis Vanguard** | Tactical Military Outpost | Titanium Alloys & Energy | Forward Recon Post $\rightarrow$ Fortified Perimeter $\rightarrow$ Mechanized Outpost $\rightarrow$ Cyber Citadel $\rightarrow$ **Orbital Defense Super-Fortress** |
| 🏰 **Aethelgard** | Medieval Town to Metropolis | Royal Timber & Gold | Pioneer Settlement $\rightarrow$ Thriving Village $\rightarrow$ Market Township $\rightarrow$ Walled City-State $\rightarrow$ **Imperial Crown Metropolis** |
| 🚀 **Astra Zenith** | Deep Space Orbital Colony | Antimatter Cells & Stardust | Orbital Waypoint $\rightarrow$ Pressurized Habitat $\rightarrow$ Biosphere Station $\rightarrow$ Fleet Drydock $\rightarrow$ **Interstellar Warp Gateway** |
| 🧙‍♂️ **Eldritch Spire** | Arcane Wizard Academy | Aether Shards & Mana | Apprentice Circle $\rightarrow$ Alchemy Laboratory $\rightarrow$ Mystic Spires $\rightarrow$ Astral Observatory $\rightarrow$ **Archmage Grand Nexus** |

---

## ⚡ Core Features

### 🎮 1. Real-Time Interactive Visual Canvas
- **Animated SVG & Particle Scenes**: Dynamic day/night and glow atmospheres tailored to each realm.
- **Stage Progression Engine**: Watch buildings, mechs, flora, and space rings physically evolve as your realm points increase.
- **Inspect & Upgrade**: Click placed structures to inspect lore, upgrade tier levels, and boost passive daily resource generation.
- **Blueprint Deployment**: Unlock and construct new buildings, ponds, radar arrays, and starships.

### 🔥 2. Gamified Habit Tracking & Streaks
- **Dynamic Streak Multiplier**: Consecutive daily completions charge a combo multiplier up to **3.0x XP & Resource boost**.
- **Streak Aegis Shields**: Protect against broken streaks on missed or low-energy days.
- **Difficulty & Time-of-Day Categorization**: Easy (+15 XP), Medium (+25 XP), Hard (+45 XP), Epic (+80 XP).
- **Target Realm Allocation**: Assign habits to specific realms (e.g. Workouts grow Military Base, Reading expands Wizard Academy, Coding powers Space Colony).

### 🤖 3. AI Quest Master & Habit Coach
- **Daily Motivational Briefings**: Inspiring quotes and contextual guidance adapted to your active realm and current streak.
- **Goal Breakdown Assistant**: Enter any daunting ambition (e.g., *"Run a 10k marathon"*, *"Master Full-Stack TypeScript"*), and the AI calculates a 4-week progressive roadmap of bite-sized atomic daily habits.
- **Smart Habit Generator**: 1-click habit discovery and tracking.

### 🧬 4. Research Tech Trees & Progression
- 5 independent research branches per realm granting passive buffs (e.g., Morning Dew multipliers, Free Weekly Streak Saves, 2x Afternoon energy, Global XP boosts).
- Unlockable player titles, crests, and commander badges.

### 🏆 5. Daily Quests & The Bazaar (Rewards Shop)
- **Daily Bounties**: Complete timed missions (e.g. *Dawn Conqueror*, *Realm Architect*) for big XP and coin bundles.
- **Rewards Shop**: Spend earned gold on Streak Shields, Elixirs of Hyper-Focus, and Realm Catalysts.

### 📊 6. Consistency Analytics & Heatmaps
- **GitHub-Style Activity Heatmap**: Visualizes 45-day momentum, intensity tiers, and total habits conquered.
- **Data Portability**: Instant 1-click JSON backup export and restore engine.

### 🔊 7. Procedural Web Audio Sound Synthesizer
- Built-in Web Audio API sound generator delivering tactile feedback for checkoffs, level-up fanfare chords, streak chimes, and shield activations with zero external audio bloat.

---

## 📱 Mobile-First & PWA Ready
HabitForge is designed with a responsive, native-like mobile app experience:
- Tactile bottom floating navigation bar.
- Standalone PWA installation manifest (`manifest.json`).
- Touch-friendly checkboxes and swipeable filters.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, CSS Glassmorphism, Custom Keyframe Animations
- **Database & ORM**: PostgreSQL with Prisma ORM
- **State & Sync**: Resilient Universal Storage Manager (Offline-First Local Storage with automatic Postgres Database Sync)
- **Icons & Effects**: Lucide React, Canvas Confetti
- **Audio**: Web Audio API Procedural Synthesizer

---

## 🚀 Quickstart & Installation

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ashmit044/habit-forge.git
cd habit-forge
npm install
```

### 2. Configure Environment & PostgreSQL (Optional for local offline play)
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/habitforge?schema=public"
```

Initialize the database schema:
```bash
npx prisma db push
```

*(Note: HabitForge includes an automatic resilient offline storage engine that works instantly out of the box even without an active Postgres instance!)*

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start forging your realms!

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📦 Database Schema (Prisma PostgreSQL)

```prisma
model User {
  id              String         @id @default(uuid())
  username        String         @default("Hero")
  xp              Int            @default(0)
  level           Int            @default(1)
  coins           Int            @default(50)
  activeRealm     String         @default("garden")
  streakShields   Int            @default(1)
  habits          Habit[]
  realmStates     RealmState[]
  quests          Quest[]
}

model Habit {
  id                String      @id @default(uuid())
  title             String
  category          String      @default("Health")
  difficulty        String      @default("Medium")
  targetTimeOfDay   String      @default("Morning")
  targetRealm       String      @default("all")
  streak            Int         @default(0)
  longestStreak     Int         @default(0)
  totalCompletions  Int         @default(0)
  scheduledDays     String
}
```

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ by Ashmit Vohra ([@ashmit044](https://github.com/ashmit044))**
