export type RealmType = 'garden' | 'military' | 'town' | 'space' | 'arcane';

export type HabitDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Epic';
export type HabitCategory = 'Health' | 'Mind' | 'Career' | 'Fitness' | 'Creativity' | 'Routine';
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  difficulty: HabitDifficulty;
  targetTimeOfDay: TimeOfDay;
  targetRealm: RealmType | 'all';
  frequency: 'daily' | 'weekdays' | 'weekends' | 'custom';
  scheduledDays: DayOfWeek[];
  streak: number;
  longestStreak: number;
  totalCompletions: number;
  archived: boolean;
  color: string;
  icon: string;
  completedToday?: boolean;
  lastCompletedDate?: string; // YYYY-MM-DD
  createdAt: string;
}

export interface PlacedStructure {
  id: string;
  itemKey: string;
  name: string;
  x: number; // grid position 0-4
  y: number; // grid position 0-3
  tier: number;
  level: number;
  icon: string;
  resourcePerDay?: number;
}

export interface TechUnlock {
  id: string;
  realm: RealmType;
  name: string;
  description: string;
  tier: number; // 1 to 5
  cost: number;
  resourceCost: number;
  icon: string;
  unlocked: boolean;
  bonusEffect: string;
}

export interface RealmProgression {
  realmType: RealmType;
  name: string;
  title: string;
  tagline: string;
  description: string;
  growthStage: number; // 1 to 5
  currentPoints: number;
  pointsToNextStage: number;
  resourceName: string;
  resourceAmount: number;
  resourceIcon: string;
  primaryColor: string;
  glowColor: string;
  placedStructures: PlacedStructure[];
  unlockedTechIds: string[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  rewardXP: number;
  rewardCoins: number;
  progress: number;
  target: number;
  completed: boolean;
  category: 'daily' | 'epic' | 'streak';
  expiresAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  xp: number;
  level: number;
  xpToNextLevel: number;
  coins: number;
  activeRealm: RealmType;
  streakShields: number;
  totalHabitsCompleted: number;
  longestStreakEver: number;
  multiplier: number;
}

export interface DailyActivityLog {
  date: string; // YYYY-MM-DD
  count: number;
  xpGained: number;
  level: number; // 0 to 4 intensity for heatmaps
}
