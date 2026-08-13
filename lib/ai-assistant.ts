export interface AIRecommendation {
  title: string;
  category: 'Health' | 'Mind' | 'Career' | 'Fitness' | 'Creativity' | 'Routine';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  targetTimeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
  targetRealm: 'garden' | 'military' | 'town' | 'space' | 'arcane';
  description: string;
  motivation: string;
}

export interface GoalBreakdown {
  goal: string;
  realmAffinity: string;
  milestones: {
    week: number;
    title: string;
    actionableHabit: string;
    xpBonus: number;
  }[];
  advice: string;
}

export class AIAssistant {
  public static getMotivationalBrief(hour: number, streak: number, activeRealm: string): { title: string; message: string; quote: string } {
    let greeting = 'Good morning, Commander';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon, Builder';
    else if (hour >= 17) greeting = 'Good evening, Guardian';

    const realmQuotes: Record<string, string[]> = {
      garden: [
        '“The seed that conquers the soil today blooms into the forest of tomorrow.”',
        '“Consistency is the sunlight that nourishes your potential.”',
        '“Water your habits with daily patience; ancient trees were once mere sprouts.”',
      ],
      military: [
        '“Discipline is the bridge between operational goals and tactical victory.”',
        '“Fortresses are not built in a day, but one solid block at a time.”',
        '“Hold the line. Every habit completed strengthens your defense grid.”',
      ],
      town: [
        '“Great cities are founded upon humble stones laid with steady hands.”',
        '“The guild grows wealthy not by sudden fortune, but by daily craft.”',
        '“Each day’s work brings new citizens and prosperity to the kingdom.”',
      ],
      space: [
        '“Small steps on Earth forge giant leaps among the stars.”',
        '“Align your trajectory; even a 1% daily course correction reaches distant galaxies.”',
        '“The quantum reactor pulses with the power of unbroken focus.”',
      ],
      arcane: [
        '“Willpower is the purest reagent; transmute your intention into reality.”',
        '“The ancient grimoires say: true mastery is nothing more than enchanted discipline.”',
        '“Channel your mana into action, and the stars will align for you.”',
      ],
    };

    const quotes = realmQuotes[activeRealm] || realmQuotes.garden;
    const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];

    let message = `You're maintaining fantastic momentum with an active streak! Every checkmark directly empowers your ${activeRealm} realm.`;
    if (streak === 0) {
      message = `Today is Day 1 of your ascension. Complete your first habit to ignite your streak combo and harvest resources!`;
    } else if (streak >= 7) {
      message = `Unstoppable! You hold an elite ${streak}-day streak. Your multiplier is supercharged and rare realm perks are within reach.`;
    }

    return {
      title: `${greeting}!`,
      message,
      quote: selectedQuote,
    };
  }

  public static generateSmartSuggestions(userPrompt: string): AIRecommendation[] {
    const query = userPrompt.toLowerCase();
    
    if (query.includes('fit') || query.includes('workout') || query.includes('muscle') || query.includes('run')) {
      return [
        {
          title: 'Tactical Pushup & Core Drill',
          category: 'Fitness',
          difficulty: 'Medium',
          targetTimeOfDay: 'Morning',
          targetRealm: 'military',
          description: '3 sets of pushups and a 60-second plank to activate core strength.',
          motivation: 'Builds military strength and supplies Titanium Alloys for base defenses.',
        },
        {
          title: 'Post-Workout Hydration & Electrolytes',
          category: 'Health',
          difficulty: 'Easy',
          targetTimeOfDay: 'Afternoon',
          targetRealm: 'garden',
          description: 'Rehydrate with 500ml water and essential minerals after physical exertion.',
          motivation: 'Replenishes life energy and irrigates the Botanical Nursery.',
        },
        {
          title: 'Daily 7,500 Step Recon Patrol',
          category: 'Fitness',
          difficulty: 'Hard',
          targetTimeOfDay: 'Evening',
          targetRealm: 'military',
          description: 'Complete a brisk outdoor walk or treadmill session to stay agile.',
          motivation: 'Maintains tactical perimeter awareness and earns military XP.',
        },
      ];
    }

    if (query.includes('code') || query.includes('study') || query.includes('program') || query.includes('work')) {
      return [
        {
          title: 'Deep Focus Coding Sprint',
          category: 'Career',
          difficulty: 'Epic',
          targetTimeOfDay: 'Morning',
          targetRealm: 'space',
          description: '45 minutes uninterrupted deep work on your core software project.',
          motivation: 'Powers the orbital quantum computer and fuels antimatter engines.',
        },
        {
          title: 'Algorithm / Documentation Review',
          category: 'Mind',
          difficulty: 'Medium',
          targetTimeOfDay: 'Afternoon',
          targetRealm: 'arcane',
          description: 'Read 1 technical RFC, tutorial, or architecture post.',
          motivation: 'Inscribes fresh knowledge into the Forbidden Grimoire.',
        },
        {
          title: 'Git Commit & Clean Workspace',
          category: 'Routine',
          difficulty: 'Easy',
          targetTimeOfDay: 'Evening',
          targetRealm: 'town',
          description: 'Push your code, write clean commit messages, and organize your desktop.',
          motivation: 'Maintains order in the Artisan Guild and earns royal coins.',
        },
      ];
    }

    // Default versatile recommendations
    return [
      {
        title: 'Morning Sun & Breathwork',
        category: 'Health',
        difficulty: 'Easy',
        targetTimeOfDay: 'Morning',
        targetRealm: 'garden',
        description: 'Spend 5 minutes outside taking deep diaphragmatic breaths.',
        motivation: 'Nourishes the Botanical Garden with pristine dawn sunlight.',
      },
      {
        title: 'Strategic Daily Planning',
        category: 'Career',
        difficulty: 'Medium',
        targetTimeOfDay: 'Morning',
        targetRealm: 'military',
        description: 'Identify top 3 non-negotiable objectives before checking email or social media.',
        motivation: 'Calibrates tactical radars for optimal mission success.',
      },
      {
        title: 'Evening Gratitude & Decompression',
        category: 'Mind',
        difficulty: 'Easy',
        targetTimeOfDay: 'Evening',
        targetRealm: 'arcane',
        description: 'Journal 3 things you are grateful for and power down blue screens 30m before sleep.',
        motivation: 'Purifies your mind and channels magical harmony into the Eldritch Spire.',
      },
    ];
  }

  public static breakdownGoal(goalInput: string): GoalBreakdown {
    return {
      goal: goalInput,
      realmAffinity: 'All Realms',
      milestones: [
        {
          week: 1,
          title: 'Foundation & Baseline',
          actionableHabit: 'Commit just 10 minutes every morning with zero friction.',
          xpBonus: 100,
        },
        {
          week: 2,
          title: 'Momentum Multiplier',
          actionableHabit: 'Increase intensity to 25 minutes and track consecutive days.',
          xpBonus: 200,
        },
        {
          week: 3,
          title: 'Mastery & Resilience',
          actionableHabit: 'Tackle the habit even on busy or low-energy days using a streak shield.',
          xpBonus: 350,
        },
        {
          week: 4,
          title: 'Permanent Habit Sovereign',
          actionableHabit: 'Automatic execution; habit becomes an effortless part of your identity.',
          xpBonus: 500,
        },
      ],
      advice: 'The secret to lasting habits is never breaking the chain two days in a row. Small, atomic actions beat erratic heroics every time!',
    };
  }
}
