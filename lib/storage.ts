import { DailyActivityLog, Habit, PlacedStructure, Quest, RealmProgression, RealmType, TechUnlock, UserProfile } from './types';
import { INITIAL_HABITS, INITIAL_TECH_TREE, REALM_DEFINITIONS } from './realm-config';

const STORAGE_KEY_HABITS = 'habitforge_habits_v2';
const STORAGE_KEY_USER = 'habitforge_user_v2';
const STORAGE_KEY_REALMS = 'habitforge_realms_v2';
const STORAGE_KEY_TECH = 'habitforge_tech_v2';
const STORAGE_KEY_QUESTS = 'habitforge_quests_v2';
const STORAGE_KEY_LOGS = 'habitforge_logs_v2';

export const INITIAL_USER: UserProfile = {
  id: 'hero-1',
  username: 'Commander Ashmit',
  xp: 320,
  level: 3,
  xpToNextLevel: 500,
  coins: 145,
  activeRealm: 'garden',
  streakShields: 2,
  totalHabitsCompleted: 48,
  longestStreakEver: 12,
  multiplier: 1.4,
};

export const INITIAL_REALMS_PROGRESSION: Record<RealmType, RealmProgression> = {
  garden: {
    realmType: 'garden',
    name: 'Celestial Sanctuary',
    title: 'Botanical Garden of Serenity',
    tagline: 'Cultivate rare flora and ancient trees of vitality.',
    description: REALM_DEFINITIONS.garden.description,
    growthStage: 2,
    currentPoints: 240,
    pointsToNextStage: 500,
    resourceName: 'Sunlit Dew',
    resourceAmount: 180,
    resourceIcon: 'Droplets',
    primaryColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    placedStructures: [
      { id: 'p1', itemKey: 'sprout_bed', name: 'Zen Herb Bed', x: 1, y: 1, tier: 1, level: 2, icon: 'Sprout', resourcePerDay: 5 },
      { id: 'p2', itemKey: 'crystal_lotus', name: 'Moonlight Lotus Pond', x: 3, y: 2, tier: 2, level: 1, icon: 'Sparkles', resourcePerDay: 10 },
    ],
    unlockedTechIds: ['g_1'],
  },
  military: {
    realmType: 'military',
    name: 'Aegis Vanguard',
    title: 'Tactical Defense Stronghold',
    tagline: 'Fabricate heavy battle mechs and cyber warfare tech.',
    description: REALM_DEFINITIONS.military.description,
    growthStage: 2,
    currentPoints: 310,
    pointsToNextStage: 500,
    resourceName: 'Titanium Alloys',
    resourceAmount: 210,
    resourceIcon: 'Cpu',
    primaryColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    placedStructures: [
      { id: 'p3', itemKey: 'sentry_turret', name: 'Twin-Link Laser Sentry', x: 0, y: 1, tier: 1, level: 2, icon: 'Crosshair', resourcePerDay: 8 },
      { id: 'p4', itemKey: 'radar_dish', name: 'Phased Array Radar', x: 2, y: 0, tier: 2, level: 1, icon: 'Radio', resourcePerDay: 12 },
    ],
    unlockedTechIds: ['m_1'],
  },
  town: {
    realmType: 'town',
    name: 'Aethelgard',
    title: 'Metropolis of the High Kings',
    tagline: 'Construct cozy cottages, bustling market squares, and royal castles.',
    description: REALM_DEFINITIONS.town.description,
    growthStage: 1,
    currentPoints: 160,
    pointsToNextStage: 350,
    resourceName: 'Royal Timber & Gold',
    resourceAmount: 95,
    resourceIcon: 'Coins',
    primaryColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    placedStructures: [
      { id: 'p5', itemKey: 'cozy_cottage', name: 'Artisan Cottage', x: 2, y: 1, tier: 1, level: 1, icon: 'Home', resourcePerDay: 6 },
    ],
    unlockedTechIds: ['t_1'],
  },
  space: {
    realmType: 'space',
    name: 'Astra Zenith',
    title: 'Orbital Deep-Space Colony',
    tagline: 'Build bio-domes, solar arrays, and warp gates.',
    description: REALM_DEFINITIONS.space.description,
    growthStage: 2,
    currentPoints: 290,
    pointsToNextStage: 500,
    resourceName: 'Antimatter Cells',
    resourceAmount: 140,
    resourceIcon: 'Atom',
    primaryColor: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    placedStructures: [
      { id: 'p6', itemKey: 'solar_panel', name: 'Helios Solar Collector', x: 1, y: 0, tier: 1, level: 2, icon: 'Sun', resourcePerDay: 10 },
      { id: 'p7', itemKey: 'hydroponic_dome', name: 'Lunar Hydro-Dome', x: 3, y: 1, tier: 2, level: 1, icon: 'Globe', resourcePerDay: 15 },
    ],
    unlockedTechIds: ['s_1'],
  },
  arcane: {
    realmType: 'arcane',
    name: 'Eldritch Spire',
    title: 'Citadel of the Arcane Masters',
    tagline: 'Summon floating rune crystals and master spell grimoires.',
    description: REALM_DEFINITIONS.arcane.description,
    growthStage: 1,
    currentPoints: 120,
    pointsToNextStage: 350,
    resourceName: 'Aether Shards',
    resourceAmount: 85,
    resourceIcon: 'Sparkle',
    primaryColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    placedStructures: [
      { id: 'p8', itemKey: 'potion_cauldron', name: 'Philosopher’s Cauldron', x: 2, y: 2, tier: 1, level: 1, icon: 'FlaskConical', resourcePerDay: 7 },
    ],
    unlockedTechIds: ['a_1'],
  },
};

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q-1',
    title: 'Dawn Conqueror',
    description: 'Complete at least 2 morning habits before noon.',
    rewardXP: 60,
    rewardCoins: 25,
    progress: 1,
    target: 2,
    completed: false,
    category: 'daily',
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: 'q-2',
    title: 'Realm Architect',
    description: 'Earn 50 realm resources through habit execution.',
    rewardXP: 80,
    rewardCoins: 35,
    progress: 35,
    target: 50,
    completed: false,
    category: 'daily',
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: 'q-3',
    title: 'Unbreakable Momentum',
    description: 'Maintain a 5-day habit streak across any category.',
    rewardXP: 150,
    rewardCoins: 60,
    progress: 4,
    target: 5,
    completed: false,
    category: 'streak',
    expiresAt: new Date(Date.now() + 86400000 * 3).toISOString(),
  },
];

export class StorageManager {
  private isClient = typeof window !== 'undefined';

  public getHabits(): Habit[] {
    if (!this.isClient) return INITIAL_HABITS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_HABITS);
      if (!data) {
        this.saveHabits(INITIAL_HABITS);
        return INITIAL_HABITS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_HABITS;
    }
  }

  public saveHabits(habits: Habit[]): void {
    if (!this.isClient) return;
    try {
      localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits:', e);
    }
  }

  public getUserProfile(): UserProfile {
    if (!this.isClient) return INITIAL_USER;
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      if (!data) {
        this.saveUserProfile(INITIAL_USER);
        return INITIAL_USER;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_USER;
    }
  }

  public saveUserProfile(user: UserProfile): void {
    if (!this.isClient) return;
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user profile:', e);
    }
  }

  public getRealms(): Record<RealmType, RealmProgression> {
    if (!this.isClient) return INITIAL_REALMS_PROGRESSION;
    try {
      const data = localStorage.getItem(STORAGE_KEY_REALMS);
      if (!data) {
        this.saveRealms(INITIAL_REALMS_PROGRESSION);
        return INITIAL_REALMS_PROGRESSION;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_REALMS_PROGRESSION;
    }
  }

  public saveRealms(realms: Record<RealmType, RealmProgression>): void {
    if (!this.isClient) return;
    try {
      localStorage.setItem(STORAGE_KEY_REALMS, JSON.stringify(realms));
    } catch (e) {
      console.error('Failed to save realms:', e);
    }
  }

  public getTechTree(): TechUnlock[] {
    if (!this.isClient) return INITIAL_TECH_TREE;
    try {
      const data = localStorage.getItem(STORAGE_KEY_TECH);
      if (!data) {
        this.saveTechTree(INITIAL_TECH_TREE);
        return INITIAL_TECH_TREE;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TECH_TREE;
    }
  }

  public saveTechTree(tech: TechUnlock[]): void {
    if (!this.isClient) return;
    try {
      localStorage.setItem(STORAGE_KEY_TECH, JSON.stringify(tech));
    } catch (e) {
      console.error('Failed to save tech tree:', e);
    }
  }

  public getQuests(): Quest[] {
    if (!this.isClient) return INITIAL_QUESTS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_QUESTS);
      if (!data) {
        this.saveQuests(INITIAL_QUESTS);
        return INITIAL_QUESTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_QUESTS;
    }
  }

  public saveQuests(quests: Quest[]): void {
    if (!this.isClient) return;
    try {
      localStorage.setItem(STORAGE_KEY_QUESTS, JSON.stringify(quests));
    } catch (e) {
      console.error('Failed to save quests:', e);
    }
  }

  public getActivityLogs(): DailyActivityLog[] {
    if (!this.isClient) {
      return this.generateMockActivityLogs();
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY_LOGS);
      if (!data) {
        const mock = this.generateMockActivityLogs();
        localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(mock));
        return mock;
      }
      return JSON.parse(data);
    } catch {
      return this.generateMockActivityLogs();
    }
  }

  public logDailyActivity(xp: number): void {
    if (!this.isClient) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const logs = this.getActivityLogs();
      const existingIndex = logs.findIndex((l) => l.date === today);

      if (existingIndex >= 0) {
        logs[existingIndex].count += 1;
        logs[existingIndex].xpGained += xp;
        logs[existingIndex].level = Math.min(4, Math.ceil(logs[existingIndex].count / 2));
      } else {
        logs.push({
          date: today,
          count: 1,
          xpGained: xp,
          level: 1,
        });
      }
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to log activity:', e);
    }
  }

  private generateMockActivityLogs(): DailyActivityLog[] {
    const logs: DailyActivityLog[] = [];
    const now = new Date();
    for (let i = 45; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = Math.random() > 0.25 ? Math.floor(Math.random() * 5) + 1 : 0;
      logs.push({
        date: dateStr,
        count,
        xpGained: count * 25,
        level: count === 0 ? 0 : Math.min(4, Math.ceil(count / 1.5)),
      });
    }
    return logs;
  }

  public exportBackup(): string {
    const data = {
      habits: this.getHabits(),
      user: this.getUserProfile(),
      realms: this.getRealms(),
      tech: this.getTechTree(),
      quests: this.getQuests(),
      logs: this.getActivityLogs(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  public importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.habits) this.saveHabits(parsed.habits);
      if (parsed.user) this.saveUserProfile(parsed.user);
      if (parsed.realms) this.saveRealms(parsed.realms);
      if (parsed.tech) this.saveTechTree(parsed.tech);
      if (parsed.quests) this.saveQuests(parsed.quests);
      if (parsed.logs) localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(parsed.logs));
      return true;
    } catch {
      return false;
    }
  }
}

export const storage = new StorageManager();
