'use client';

import React, { useState, useEffect } from 'react';
import { DayOfWeek, Habit, HabitCategory, HabitDifficulty, RealmType, TimeOfDay } from '@/lib/types';
import { REALM_DEFINITIONS, RealmGoalPreset } from '@/lib/realm-config';
import { X, Sparkles, Plus, Check, Flower2, ShieldAlert, Castle, Rocket, Wand2, Globe2, Zap } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface HabitModalProps {
  isOpen: boolean;
  initialHabit?: Habit | null;
  activeRealm: RealmType;
  onClose: () => void;
  onSave: (habitData: Partial<Habit>) => void;
}

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  initialHabit,
  activeRealm,
  onClose,
  onSave,
}) => {
  const [targetRealm, setTargetRealm] = useState<RealmType | 'all'>(activeRealm);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Health');
  const [difficulty, setDifficulty] = useState<HabitDifficulty>('Medium');
  const [targetTimeOfDay, setTargetTimeOfDay] = useState<TimeOfDay>('Morning');
  const [scheduledDays, setScheduledDays] = useState<DayOfWeek[]>([
    'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun',
  ]);

  useEffect(() => {
    if (initialHabit) {
      setTitle(initialHabit.title);
      setDescription(initialHabit.description || '');
      setCategory(initialHabit.category);
      setDifficulty(initialHabit.difficulty);
      setTargetTimeOfDay(initialHabit.targetTimeOfDay);
      setTargetRealm(initialHabit.targetRealm);
      setScheduledDays(initialHabit.scheduledDays);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Health');
      setDifficulty('Medium');
      setTargetTimeOfDay('Morning');
      setTargetRealm(activeRealm);
      setScheduledDays(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
    }
  }, [initialHabit, activeRealm, isOpen]);

  if (!isOpen) return null;

  const categories: HabitCategory[] = ['Health', 'Mind', 'Career', 'Fitness', 'Creativity', 'Routine'];
  const difficulties: HabitDifficulty[] = ['Easy', 'Medium', 'Hard', 'Epic'];
  const timesOfDay: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening', 'Anytime'];
  const realmKeys: (RealmType | 'all')[] = ['garden', 'military', 'town', 'space', 'arcane', 'all'];
  const days: { key: DayOfWeek; label: string }[] = [
    { key: 'mon', label: 'Mon' },
    { key: 'tue', label: 'Tue' },
    { key: 'wed', label: 'Wed' },
    { key: 'thu', label: 'Thu' },
    { key: 'fri', label: 'Fri' },
    { key: 'sat', label: 'Sat' },
    { key: 'sun', label: 'Sun' },
  ];

  const getRealmIcon = (type: RealmType | 'all') => {
    switch (type) {
      case 'garden':
        return <Flower2 className="w-4 h-4 text-emerald-400" />;
      case 'military':
        return <ShieldAlert className="w-4 h-4 text-blue-400" />;
      case 'town':
        return <Castle className="w-4 h-4 text-amber-400" />;
      case 'space':
        return <Rocket className="w-4 h-4 text-purple-400" />;
      case 'arcane':
        return <Wand2 className="w-4 h-4 text-pink-400" />;
      default:
        return <Globe2 className="w-4 h-4 text-slate-300" />;
    }
  };

  const selectedMeta = targetRealm !== 'all' ? REALM_DEFINITIONS[targetRealm] : null;

  const handleApplyPreset = (preset: RealmGoalPreset) => {
    soundManager.playTap();
    setTitle(preset.title);
    setDescription(preset.description);
    setCategory(preset.category);
    setDifficulty(preset.difficulty);
    setTargetTimeOfDay(preset.targetTimeOfDay);
  };

  const toggleDay = (day: DayOfWeek) => {
    soundManager.playTap();
    if (scheduledDays.includes(day)) {
      if (scheduledDays.length > 1) {
        setScheduledDays(scheduledDays.filter((d) => d !== day));
      }
    } else {
      setScheduledDays([...scheduledDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundManager.playUnlock();
    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      targetTimeOfDay,
      targetRealm,
      scheduledDays,
      frequency: scheduledDays.length === 7 ? 'daily' : 'custom',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-slate-950 shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white">
              {initialHabit ? 'Edit Realm Goal Blueprint' : 'Forge New Goal & Select Realm'}
            </h2>
            <p className="text-xs text-slate-400">
              Select which virtual realm this habit will nurture and expand.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* STEP 1: HERO REALM SELECTOR */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>Step 1: Choose Realm for this Goal</span>
              <span className="text-[10px] text-emerald-400 font-semibold">(Directs XP & Resources)</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {realmKeys.map((rKey) => {
                const isSelected = targetRealm === rKey;
                const meta = rKey !== 'all' ? REALM_DEFINITIONS[rKey] : null;
                const name = meta ? meta.name : 'Universal Core';
                const sub = meta ? meta.title.split(' ')[0] + ' Realm' : 'Grows Active Realm';

                return (
                  <button
                    key={rKey}
                    type="button"
                    onClick={() => {
                      soundManager.playTap();
                      setTargetRealm(rKey);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer select-none flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-white/40 shadow-lg scale-102'
                        : 'bg-slate-950/60 hover:bg-slate-800/50 border-slate-800/80 text-slate-400'
                    }`}
                    style={{
                      borderColor: isSelected ? meta?.accentColor || '#10b981' : undefined,
                      boxShadow: isSelected ? `0 0 20px -5px ${meta?.glowColor || 'rgba(16,185,129,0.4)'}` : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-700/50">
                        {getRealmIcon(rKey)}
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* REALM PRIMARY OBJECTIVE & PRESETS BANNER */}
          {selectedMeta && (
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/80 space-y-3 animate-fadeIn">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: selectedMeta.accentColor }}>
                    <Zap className="w-3.5 h-3.5" />
                    <span>{selectedMeta.name} Objective: {selectedMeta.primaryGoalTitle}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {selectedMeta.primaryGoalDescription}
                  </p>
                </div>
              </div>

              {/* One-Click Presets for this Realm */}
              <div>
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Suggested Blueprints for {selectedMeta.name}:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedMeta.goalPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-200 group-hover:text-white">
                        <span className="truncate">{preset.title}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 shrink-0 ml-1">
                          {preset.difficulty}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {preset.growthImpact}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: GOAL TITLE & DESCRIPTION */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Goal / Habit Name *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 45-Minute Deep Coding Sprint"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Description & Strategy Notes
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Notes on execution, rules, or how this empowers your realm..."
                rows={2}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* STEP 3: CATEGORY & DIFFICULTY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      soundManager.playTap();
                      setCategory(cat);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer truncate ${
                      category === cat
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Difficulty & XP Yield
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {difficulties.map((diff) => {
                  const xpMap = { Easy: 15, Medium: 25, Hard: 45, Epic: 80 };
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => {
                        soundManager.playTap();
                        setDifficulty(diff);
                      }}
                      className={`py-1.5 px-1 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                        difficulty === diff
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div>{diff}</div>
                      <div className="text-[10px] text-slate-400 opacity-80">+{xpMap[diff]}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TIME OF DAY & SCHEDULE DAYS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Time of Day
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {timesOfDay.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      soundManager.playTap();
                      setTargetTimeOfDay(time);
                    }}
                    className={`py-1.5 px-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      targetTimeOfDay === time
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Schedule Days
              </label>
              <div className="flex items-center justify-between gap-1">
                {days.map((day) => {
                  const isSelected = scheduledDays.includes(day.key);
                  return (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => toggleDay(day.key)}
                      className={`flex-1 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer border ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                soundManager.playTap();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              {initialHabit ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{initialHabit ? 'Save Goal Changes' : 'Forge Realm Goal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
