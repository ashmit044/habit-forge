const categories = ['Health', 'Mind', 'Career', 'Fitness', 'Creativity', 'Routine'] as const;
const difficulties = ['Easy', 'Medium', 'Hard', 'Epic'] as const;
const timesOfDay = ['Morning', 'Afternoon', 'Evening', 'Anytime'] as const;
const realms = ['garden', 'military', 'town', 'space', 'arcane', 'all'] as const;
const frequencies = ['daily', 'weekdays', 'weekends', 'custom'] as const;
const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export interface NewHabitInput {
  title: string;
  description: string;
  category: (typeof categories)[number];
  difficulty: (typeof difficulties)[number];
  targetTimeOfDay: (typeof timesOfDay)[number];
  targetRealm: (typeof realms)[number];
  frequency: (typeof frequencies)[number];
  scheduledDays: (typeof days)[number][];
  color: string;
  icon: string;
}

type ValidationResult = { success: true; data: NewHabitInput } | { success: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function enumValue<T extends readonly string[]>(
  value: unknown,
  choices: T,
  fallback: T[number],
): T[number] | null {
  if (value === undefined) return fallback;
  return typeof value === 'string' && choices.includes(value) ? (value as T[number]) : null;
}

export function validateNewHabit(value: unknown): ValidationResult {
  if (!isRecord(value)) return { success: false, error: 'Request body must be a JSON object' };

  if (typeof value.title !== 'string' || !value.title.trim() || value.title.trim().length > 120) {
    return { success: false, error: 'Title must contain 1 to 120 characters' };
  }

  const description = value.description === undefined ? '' : value.description;
  if (typeof description !== 'string' || description.length > 1000) {
    return { success: false, error: 'Description must be a string of at most 1000 characters' };
  }

  const category = enumValue(value.category, categories, 'Health');
  const difficulty = enumValue(value.difficulty, difficulties, 'Medium');
  const targetTimeOfDay = enumValue(value.targetTimeOfDay, timesOfDay, 'Morning');
  const targetRealm = enumValue(value.targetRealm, realms, 'all');
  const frequency = enumValue(value.frequency, frequencies, 'daily');
  if (!category || !difficulty || !targetTimeOfDay || !targetRealm || !frequency) {
    return { success: false, error: 'Habit contains an unsupported category, difficulty, time, realm, or frequency' };
  }

  const scheduledDays = value.scheduledDays === undefined
    ? [...days]
    : value.scheduledDays;
  if (
    !Array.isArray(scheduledDays) ||
    scheduledDays.length < 1 ||
    scheduledDays.length > days.length ||
    scheduledDays.some((day) => typeof day !== 'string' || !days.includes(day as (typeof days)[number])) ||
    new Set(scheduledDays).size !== scheduledDays.length
  ) {
    return { success: false, error: 'Scheduled days must contain 1 to 7 unique, valid weekday values' };
  }

  const color = value.color === undefined ? '#10b981' : value.color;
  if (typeof color !== 'string' || !/^#[\da-fA-F]{6}$/.test(color)) {
    return { success: false, error: 'Color must be a six-digit hex color' };
  }

  const icon = value.icon === undefined ? 'Flame' : value.icon;
  if (typeof icon !== 'string' || !/^[A-Za-z][A-Za-z0-9]{0,39}$/.test(icon)) {
    return { success: false, error: 'Icon must be a valid icon name' };
  }

  return {
    success: true,
    data: {
      title: value.title.trim(),
      description: description.trim(),
      category,
      difficulty,
      targetTimeOfDay,
      targetRealm,
      frequency,
      scheduledDays: scheduledDays as NewHabitInput['scheduledDays'],
      color,
      icon,
    },
  };
}
