'use client';

import React, { useState, useEffect } from 'react';
import { Habit, PlacedStructure, Quest, RealmProgression, RealmType, TechUnlock, UserProfile } from '@/lib/types';
import { storage } from '@/lib/storage';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { HeaderHUD } from '@/components/layout/HeaderHUD';
import { MobileNav, MainTab } from '@/components/layout/MobileNav';
import { RealmSelector } from '@/components/realms/RealmSelector';
import { ThreeRealmCanvas } from '@/components/three/ThreeRealmCanvas';
import { BuildingInspector } from '@/components/three/BuildingInspector';
import { Interactive3DObject } from '@/components/three/scenes/Garden3D';
import { HabitList } from '@/components/habits/HabitList';
import { HabitModal } from '@/components/habits/HabitModal';
import { DailyQuests } from '@/components/progression/DailyQuests';
import { TechTreeModal } from '@/components/progression/TechTreeModal';
import { RewardsShop } from '@/components/progression/RewardsShop';
import { LevelUpModal } from '@/components/progression/LevelUpModal';
import { ActivityHeatmap } from '@/components/analytics/ActivityHeatmap';
import { StatsOverview } from '@/components/analytics/StatsOverview';
import { AICoachDrawer } from '@/components/ai/AICoachDrawer';
import { soundManager } from '@/lib/sound';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [user, setUser] = useState<UserProfile>(storage.getUserProfile());
  const [realms, setRealms] = useState<Record<RealmType, RealmProgression>>(storage.getRealms());
  const [techTree, setTechTree] = useState<TechUnlock[]>(storage.getTechTree());
  const [quests, setQuests] = useState<Quest[]>(storage.getQuests());
  const [activeRealm, setActiveRealm] = useState<RealmType>('garden');
  const [activeMobileTab, setActiveMobileTab] = useState<MainTab>('habits');

  // Selected 3D Object for Inspector
  const [selected3DObject, setSelected3DObject] = useState<Interactive3DObject | null>(null);

  // Modals state
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isTechTreeOpen, setIsTechTreeOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);
  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
  const [newLevelEarned, setNewLevelEarned] = useState(1);

  useEffect(() => {
    setIsClient(true);
    refreshAllData();
  }, []);

  const refreshAllData = () => {
    const loadedHabits = storage.getHabits();
    const loadedUser = storage.getUserProfile();
    const loadedRealms = storage.getRealms();
    const loadedTech = storage.getTechTree();
    const loadedQuests = storage.getQuests();

    setHabits(loadedHabits);
    setUser(loadedUser);
    setRealms(loadedRealms);
    setTechTree(loadedTech);
    setQuests(loadedQuests);
    setActiveRealm(loadedUser.activeRealm || 'garden');
  };

  // Switch Active Realm
  const handleSelectRealm = (realm: RealmType) => {
    setActiveRealm(realm);
    setSelected3DObject(null);
    const updatedUser = { ...user, activeRealm: realm };
    setUser(updatedUser);
    storage.saveUserProfile(updatedUser);
  };

  // Canvas Tap Harvest Interactive Reward
  const handleCanvasInteractHarvest = (realmType: RealmType, gain: number) => {
    const currentProg = realms[realmType];
    const updatedProg = {
      ...currentProg,
      resourceAmount: currentProg.resourceAmount + gain,
      currentPoints: currentProg.currentPoints + Math.round(gain * 0.5),
    };
    const updatedRealms = {
      ...realms,
      [realmType]: updatedProg,
    };
    setRealms(updatedRealms);
    storage.saveRealms(updatedRealms);
  };

  // Complete / Uncomplete Habit
  const handleToggleComplete = (habitId: string) => {
    const targetHabit = habits.find((h) => h.id === habitId);
    if (!targetHabit) return;

    const isNowCompleted = !targetHabit.completedToday;
    const difficultyXPMap = { Easy: 15, Medium: 25, Hard: 45, Epic: 80 };
    const baseXP = difficultyXPMap[targetHabit.difficulty] || 25;
    const earnedXP = Math.round(baseXP * user.multiplier);
    const earnedCoins = 5;
    const realmPoints = Math.round(earnedXP * 0.85);
    const targetRealmKey = targetHabit.targetRealm === 'all' ? activeRealm : targetHabit.targetRealm;

    // Update habit in list
    const updatedHabits = habits.map((h) => {
      if (h.id === habitId) {
        const newStreak = isNowCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
        return {
          ...h,
          completedToday: isNowCompleted,
          streak: newStreak,
          longestStreak: Math.max(h.longestStreak, newStreak),
          totalCompletions: isNowCompleted ? h.totalCompletions + 1 : Math.max(0, h.totalCompletions - 1),
          lastCompletedDate: isNowCompleted ? new Date().toISOString().split('T')[0] : h.lastCompletedDate,
        };
      }
      return h;
    });
    setHabits(updatedHabits);
    storage.saveHabits(updatedHabits);

    if (isNowCompleted) {
      // 1. Update Player XP & Level
      const newXP = user.xp + earnedXP;
      let newLevel = user.level;
      let newXPToNext = user.xpToNextLevel;
      let leveledUp = false;

      if (newXP >= user.xpToNextLevel) {
        newLevel += 1;
        newXPToNext = Math.round(user.xpToNextLevel * 1.5);
        leveledUp = true;
        setNewLevelEarned(newLevel);
        setIsLevelUpOpen(true);
      }

      const updatedUser: UserProfile = {
        ...user,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: newXPToNext,
        coins: user.coins + earnedCoins + (leveledUp ? 50 : 0),
        totalHabitsCompleted: user.totalHabitsCompleted + 1,
        longestStreakEver: Math.max(user.longestStreakEver, targetHabit.streak + 1),
        multiplier: Math.min(3.0, 1.0 + (targetHabit.streak + 1) * 0.1),
      };
      setUser(updatedUser);
      storage.saveUserProfile(updatedUser);

      // 2. Update Target Realm Progression
      const currentProg = realms[targetRealmKey];
      const newPoints = currentProg.currentPoints + realmPoints;
      const newResource = currentProg.resourceAmount + Math.round(realmPoints * 0.6);
      let newStage = currentProg.growthStage;
      let newPointsTarget = currentProg.pointsToNextStage;

      if (newPoints >= currentProg.pointsToNextStage && newStage < 5) {
        newStage += 1;
        newPointsTarget = Math.round(currentProg.pointsToNextStage * 1.6);
        soundManager.playLevelUp();
      }

      const updatedRealms = {
        ...realms,
        [targetRealmKey]: {
          ...currentProg,
          currentPoints: newPoints,
          pointsToNextStage: newPointsTarget,
          growthStage: newStage,
          resourceAmount: newResource,
        },
      };
      setRealms(updatedRealms);
      storage.saveRealms(updatedRealms);

      // 3. Log daily activity for heatmap
      storage.logDailyActivity(earnedXP);

      // 4. Update Quests progress
      const updatedQuests = quests.map((q) => {
        if (!q.completed) {
          return {
            ...q,
            progress: Math.min(q.target, q.progress + 1),
          };
        }
        return q;
      });
      setQuests(updatedQuests);
      storage.saveQuests(updatedQuests);
    }
  };

  // Add / Edit Habit
  const handleSaveHabit = (habitData: Partial<Habit>) => {
    if (editingHabit) {
      const updated = habits.map((h) => (h.id === editingHabit.id ? { ...h, ...habitData } : h));
      setHabits(updated);
      storage.saveHabits(updated);
      setEditingHabit(null);
    } else {
      const newHabit: Habit = {
        id: `h-${Date.now()}`,
        title: habitData.title || 'New Goal',
        description: habitData.description || '',
        category: habitData.category || 'Health',
        difficulty: habitData.difficulty || 'Medium',
        targetTimeOfDay: habitData.targetTimeOfDay || 'Morning',
        targetRealm: habitData.targetRealm || activeRealm,
        frequency: habitData.frequency || 'daily',
        scheduledDays: habitData.scheduledDays || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        streak: 0,
        longestStreak: 0,
        totalCompletions: 0,
        archived: false,
        color: '#10b981',
        icon: 'Flame',
        completedToday: false,
        createdAt: new Date().toISOString(),
      };
      const updated = [newHabit, ...habits];
      setHabits(updated);
      storage.saveHabits(updated);
    }
  };

  // Delete Habit
  const handleDeleteHabit = (habitId: string) => {
    soundManager.playTap();
    const updated = habits.filter((h) => h.id !== habitId);
    setHabits(updated);
    storage.saveHabits(updated);
  };

  // Upgrade Structure from Inspector
  const handleUpgrade3DStructure = (structureId: string) => {
    const currentProg = realms[activeRealm];
    const cost = ( (selected3DObject?.level || 1) + 1 ) * 35;
    if (currentProg.resourceAmount < cost) return;

    const updatedRealms = {
      ...realms,
      [activeRealm]: {
        ...currentProg,
        resourceAmount: currentProg.resourceAmount - cost,
      },
    };
    setRealms(updatedRealms);
    storage.saveRealms(updatedRealms);

    if (selected3DObject) {
      setSelected3DObject({
        ...selected3DObject,
        level: selected3DObject.level + 1,
      });
    }
  };

  // Unlock Tech Node
  const handleUnlockTech = (techId: string, cost: number, resourceCost: number) => {
    const updatedTech = techTree.map((t) => (t.id === techId ? { ...t, unlocked: true } : t));
    setTechTree(updatedTech);
    storage.saveTechTree(updatedTech);

    const updatedUser = { ...user, coins: Math.max(0, user.coins - cost) };
    setUser(updatedUser);
    storage.saveUserProfile(updatedUser);

    const currentProg = realms[activeRealm];
    const updatedRealms = {
      ...realms,
      [activeRealm]: {
        ...currentProg,
        resourceAmount: Math.max(0, currentProg.resourceAmount - resourceCost),
        unlockedTechIds: [...currentProg.unlockedTechIds, techId],
      },
    };
    setRealms(updatedRealms);
    storage.saveRealms(updatedRealms);
  };

  // Claim Quest Reward
  const handleClaimQuest = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    const updatedQuests = quests.map((q) => (q.id === questId ? { ...q, completed: true } : q));
    setQuests(updatedQuests);
    storage.saveQuests(updatedQuests);

    const updatedUser = {
      ...user,
      xp: user.xp + quest.rewardXP,
      coins: user.coins + quest.rewardCoins,
    };
    setUser(updatedUser);
    storage.saveUserProfile(updatedUser);
  };

  // Shop Purchases
  const handleBuyShield = () => {
    if (user.coins < 50) return;
    const updatedUser = {
      ...user,
      coins: user.coins - 50,
      streakShields: user.streakShields + 1,
    };
    setUser(updatedUser);
    storage.saveUserProfile(updatedUser);
  };

  const handleBuyXPBooster = () => {
    if (user.coins < 65) return;
    const updatedUser = {
      ...user,
      coins: user.coins - 65,
      xp: user.xp + 100,
      multiplier: Math.min(3.0, user.multiplier + 0.3),
    };
    setUser(updatedUser);
    storage.saveUserProfile(updatedUser);
  };

  const handleBuyCatalyst = () => {
    if (user.coins < 80) return;
    const updatedUser = { ...user, coins: user.coins - 80 };
    setUser(updatedUser);
    storage.saveUserProfile(updatedUser);

    const currentProg = realms[activeRealm];
    const updatedRealms = {
      ...realms,
      [activeRealm]: {
        ...currentProg,
        resourceAmount: currentProg.resourceAmount + 120,
        currentPoints: currentProg.currentPoints + 80,
      },
    };
    setRealms(updatedRealms);
    storage.saveRealms(updatedRealms);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-[#71717a]">
        <div className="flex items-center gap-2.5 text-xs font-semibold">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading 3D Spatial Canvas...</span>
        </div>
      </div>
    );
  }

  const currentRealmProg = realms[activeRealm];

  return (
    <div className="min-h-screen pb-16 md:pb-8 text-[#f4f4f5] flex flex-col bg-[#09090b]">
      {/* Top Header HUD */}
      <HeaderHUD
        user={user}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenTechTree={() => setIsTechTreeOpen(true)}
        onRefreshData={refreshAllData}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 space-y-4">
        {/* Realm Selector Switcher Bar */}
        <RealmSelector
          activeRealm={activeRealm}
          realms={realms}
          onSelectRealm={handleSelectRealm}
        />

        {/* Main Content Layout: 2-Column Desktop View / Mobile Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* LEFT COLUMN: 3D Interactive WebGL Viewport & Building Inspector */}
          <div className={`lg:col-span-6 space-y-3.5 ${activeMobileTab === 'realm' || activeMobileTab === 'habits' ? 'block' : 'hidden md:block'}`}>
            {/* Real 3D WebGL Canvas */}
            <ThreeRealmCanvas
              realmProg={currentRealmProg}
              onSelectStructure={(obj) => setSelected3DObject(obj)}
              onInteractHarvest={handleCanvasInteractHarvest}
            />

            {/* Slide-in Building Detail Inspector */}
            {selected3DObject && (
              <BuildingInspector
                structure={selected3DObject}
                realmProg={currentRealmProg}
                onClose={() => setSelected3DObject(null)}
                onUpgrade={handleUpgrade3DStructure}
              />
            )}

            {/* Daily Quests & Challenges */}
            <DailyQuests quests={quests} onClaimQuest={handleClaimQuest} />
          </div>

          {/* RIGHT COLUMN: Habit Tracker List & Analytics Heatmap */}
          <div className={`lg:col-span-6 space-y-3.5 ${activeMobileTab === 'habits' || activeMobileTab === 'quests' ? 'block' : 'hidden md:block'}`}>
            {/* Habit Tracker List */}
            <HabitList
              habits={habits}
              activeRealm={activeRealm}
              onToggleComplete={handleToggleComplete}
              onEdit={(h) => {
                setEditingHabit(h);
                setIsHabitModalOpen(true);
              }}
              onDelete={handleDeleteHabit}
              onOpenCreateModal={() => {
                setEditingHabit(null);
                setIsHabitModalOpen(true);
              }}
              onOpenAICoach={() => setIsAICoachOpen(true)}
            />

            {/* Consistency Heatmap */}
            <ActivityHeatmap
              logs={storage.getActivityLogs()}
              totalCompletions={user.totalHabitsCompleted}
              currentStreak={user.longestStreakEver}
            />

            {/* Comprehensive Stats Overview */}
            <StatsOverview user={user} realms={realms} />
          </div>
        </div>
      </main>

      {/* Floating Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeMobileTab}
        onSelectTab={setActiveMobileTab}
        onOpenAICoach={() => setIsAICoachOpen(true)}
        onOpenTechTree={() => setIsTechTreeOpen(true)}
      />

      {/* MODALS */}

      {/* Create / Edit Habit Modal */}
      <HabitModal
        isOpen={isHabitModalOpen}
        initialHabit={editingHabit}
        activeRealm={activeRealm}
        onClose={() => {
          setIsHabitModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
      />

      {/* Tech Tree & Research Modal */}
      <TechTreeModal
        isOpen={isTechTreeOpen}
        activeRealm={activeRealm}
        realmProg={currentRealmProg}
        techTree={techTree}
        userCoins={user.coins}
        onClose={() => setIsTechTreeOpen(false)}
        onUnlockTech={handleUnlockTech}
      />

      {/* Rewards Bazaar Shop Modal */}
      <RewardsShop
        isOpen={isShopOpen}
        user={user}
        activeRealm={activeRealm}
        onClose={() => setIsShopOpen(false)}
        onBuyShield={handleBuyShield}
        onBuyCatalyst={handleBuyCatalyst}
        onBuyXPBooster={handleBuyXPBooster}
      />

      {/* AI Habit Coach & Quest Master Drawer */}
      <AICoachDrawer
        isOpen={isAICoachOpen}
        activeRealm={activeRealm}
        currentStreak={user.longestStreakEver}
        onClose={() => setIsAICoachOpen(false)}
        onAddHabit={(habitData) => {
          handleSaveHabit(habitData);
          setIsAICoachOpen(false);
        }}
      />

      {/* Level Up Ascension Modal */}
      <LevelUpModal
        isOpen={isLevelUpOpen}
        newLevel={newLevelEarned}
        onClose={() => setIsLevelUpOpen(false)}
      />
    </div>
  );
}
