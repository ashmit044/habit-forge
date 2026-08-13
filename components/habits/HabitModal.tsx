'use client';

import React, { useState, useEffect } from 'react';
import { DayOfWeek, Habit, HabitCategory, HabitDifficulty, RealmType, TimeOfDay } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { X, Sparkles, Plus, Check } from 'lucide-react';
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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Health');
  const [difficulty, setDifficulty] = useState<HabitDifficulty>('Medium');
  const [targetTimeOfDay, setTargetTimeOfDay] = useState<TimeOfDay>('Morning');
  const [targetRealm, setTargetRealm] = useState<RealmType | 'all'>(activeRealm);
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
  const realms: (RealmType | 'all')[] = ['all', 'garden', 'military', 'town', 'space', 'arcane'];
  const days: { key: DayOfWeek; label: string }[] = [
    { key: 'mon', label: 'Mon' },
    { key: 'tue', label: 'Tue' },
    { key: 'wed', label: 'Wed' },
    { key: 'thu', label: 'Thu' },
    { key: 'fri', label: 'Fri' },
    { key: 'sat', label: 'Sat' },
    { key: 'sun', label: 'Sun' },
  ];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
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

        {/* Modal Title */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {initialHabit ? 'Edit Habit Blueprint' : 'Forge New Habit'}
            </h2>
            <p className="text-xs text-slate-400">
              Fuel your virtual realms and build your daily streaks.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Habit Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 20-Minute Tactical Cardio Drill"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description & Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why this habit matters, rules, or execution tips..."
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    soundManager.playTap();
                    setCategory(cat);
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
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

          {/* Difficulty & XP Tier */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Difficulty & Reward Tier
            </label>
            <div className="grid grid-cols-4 gap-2">
              {difficulties.map((diff) => {
                const xpMap: Record<HabitDifficulty, number> = {
                  Easy: 15,
                  Medium: 25,
                  Hard: 45,
                  Epic: 80,
                };
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => {
                      soundManager.playTap();
                      setDifficulty(diff);
                    }}
                    className={`py-2 px-1.5 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                      difficulty === diff
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>{diff}</div>
                    <div className="text-[10px] text-slate-400 opacity-80">+{xpMap[diff]} XP</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time of Day */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Time of Day
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timesOfDay.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => {
                    soundManager.playTap();
                    setTargetTimeOfDay(time);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
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

          {/* Target Realm Allocation */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Empower Realm
            </label>
            <div className="grid grid-cols-3 gap-2">
              {realms.map((r) => {
                const label = r === 'all' ? 'All Realms' : REALM_DEFINITIONS[r].name.split(' ')[0];
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      soundManager.playTap();
                      setTargetRealm(r);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      targetRealm === r
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scheduled Days */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Schedule Frequency
            </label>
            <div className="flex items-center justify-between gap-1">
              {days.map((day) => {
                const isSelected = scheduledDays.includes(day.key);
                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => toggleDay(day.key)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              {initialHabit ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{initialHabit ? 'Save Changes' : 'Forge Habit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
