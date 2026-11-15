import { RealmProgression, RealmType, UserProfile } from './types';

type AchievementMetric = 'completions' | 'streak' | 'realmStage' | 'level';

interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  metric: AchievementMetric;
  target: number;
  rewardXP: number;
  rewardCoins: number;
}

export interface AchievementProgress extends AchievementDefinition {
  progress: number;
  unlocked: boolean;
  claimed: boolean;
}

const achievementDefinitions: AchievementDefinition[] = [
  {
    id: 'first-completion',
    title: 'First Steps',
    description: 'Complete your first habit.',
    metric: 'completions',
    target: 1,
    rewardXP: 25,
    rewardCoins: 10,
  },
  {
    id: 'habit-builder',
    title: 'Habit Builder',
    description: 'Complete 50 habits across your realms.',
    metric: 'completions',
    target: 50,
    rewardXP: 75,
    rewardCoins: 30,
  },
  {
    id: 'century-of-habits',
    title: 'A Century of Practice',
    description: 'Complete 100 habits across your realms.',
    metric: 'completions',
    target: 100,
    rewardXP: 180,
    rewardCoins: 75,
  },
  {
    id: 'steady-seven',
    title: 'Steady Hand',
    description: 'Build a seven-day personal best streak.',
    metric: 'streak',
    target: 7,
    rewardXP: 60,
    rewardCoins: 25,
  },
  {
    id: 'realm-evolution',
    title: 'World Shaper',
    description: 'Evolve any realm to stage three.',
    metric: 'realmStage',
    target: 3,
    rewardXP: 120,
    rewardCoins: 50,
  },
  {
    id: 'commander-rank',
    title: 'Veteran Founder',
    description: 'Reach player level ten.',
    metric: 'level',
    target: 10,
    rewardXP: 200,
    rewardCoins: 90,
  },
];

function getMetricValue(
  metric: AchievementMetric,
  user: UserProfile,
  realms: Record<RealmType, RealmProgression>,
): number {
  switch (metric) {
    case 'completions':
      return user.totalHabitsCompleted;
    case 'streak':
      return user.longestStreakEver;
    case 'realmStage':
      return Math.max(...Object.values(realms).map((realm) => realm.growthStage));
    case 'level':
      return user.level;
  }
}

export function getAchievementProgress(
  user: UserProfile,
  realms: Record<RealmType, RealmProgression>,
): AchievementProgress[] {
  const claimedIds = new Set(user.claimedAchievementIds ?? []);

  return achievementDefinitions.map((achievement) => {
    const progress = Math.max(0, getMetricValue(achievement.metric, user, realms));

    return {
      ...achievement,
      progress: Math.min(achievement.target, progress),
      unlocked: progress >= achievement.target,
      claimed: claimedIds.has(achievement.id),
    };
  });
}
