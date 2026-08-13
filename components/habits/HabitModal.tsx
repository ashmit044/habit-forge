'use client';

import React, { useState, useEffect } from 'react';
import { DayOfWeek, Habit, HabitCategory, HabitDifficulty, RealmType, TimeOfDay } from '@/lib/types';
import { REALM_DEFINITIONS, RealmGoalPreset } from '@/lib/realm-config';
import { X, Check, Plus, Flower2, ShieldAlert, Castle, Rocket, Wand2, Globe2 } from 'lucide-react';
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
        return <Flower2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'military':
        return <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />;
      case 'town':
        return <Castle className="w-3.5 h-3.5 text-amber-400" />;
      case 'space':
        return <Rocket className="w-3.5 h-3.5 text-purple-400" />;
      case 'arcane':
        return <Wand2 className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return <Globe2 className="w-3.5 h-3.5 text-slate-400" />;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-[#121215] border border-[#27272a] rounded-xl p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-md text-[#a1a1aa] hover:text-white bg-[#18181b] hover:bg-[#27272a] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <h3 className="text-sm font-bold text-white">
            {initialHabit ? 'Edit Goal Configuration' : 'Set New Habit / Goal'}
          </h3>
          <p className="text-xs text-[#71717a]">
            Assign this daily discipline to expand and nurture your chosen 3D realm.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* STEP 1: REALM SELECTION */}
          <div>
            <label className="block text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
              1. Target Realm
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {realmKeys.map((rKey) => {
                const isSelected = targetRealm === rKey;
                const meta = rKey !== 'all' ? REALM_DEFINITIONS[rKey] : null;
                const name = meta ? meta.name.split(' ')[0] : 'All';

                return (
                  <button
                    key={rKey}
                    type="button"
                    onClick={() => {
                      soundManager.playTap();
                      setTargetRealm(rKey);
                    }}
                    className={`p-2 rounded-md border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'bg-[#18181b] border-[#3f3f46] text-white shadow-sm'
                        : 'bg-[#09090b] border-[#27272a] text-[#71717a] hover:text-[#a1a1aa]'
                    }`}
                  >
                    {getRealmIcon(rKey)}
                    <span className="text-[10px] font-semibold truncate">{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BLUEPRINTS PRESETS */}
          {selectedMeta && (
            <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] space-y-2">
              <span className="text-[10px] font-semibold text-[#a1a1aa] uppercase tracking-wider block">
                {selectedMeta.name} Goal Templates:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {selectedMeta.goalPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2 rounded-md bg-[#121215] hover:bg-[#18181b] border border-[#27272a] text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs font-medium text-[#f4f4f5] group-hover:text-white">
                      <span className="truncate">{preset.title}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-[#18181b] text-[#a1a1aa] shrink-0 ml-1">
                        {preset.difficulty}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GOAL TITLE & DESCRIPTION */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1">
                Goal Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 45-Minute Deep Coding Sprint"
                className="w-full px-3 py-2 rounded-md bg-[#09090b] border border-[#27272a] text-white placeholder-[#71717a] text-xs focus:outline-none focus:border-[#3f3f46]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1">
                Notes & Execution Strategy
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Strategy notes on execution rules or habits..."
                rows={2}
                className="w-full px-3 py-1.5 rounded-md bg-[#09090b] border border-[#27272a] text-white placeholder-[#71717a] text-xs focus:outline-none focus:border-[#3f3f46]"
              />
            </div>
          </div>

          {/* CATEGORY & DIFFICULTY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1">
                Category
              </label>
              <div className="grid grid-cols-3 gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      soundManager.playTap();
                      setCategory(cat);
                    }}
                    className={`py-1 px-1.5 rounded text-[11px] font-medium border text-center transition-colors cursor-pointer truncate ${
                      category === cat
                        ? 'bg-white text-black border-white'
                        : 'bg-[#09090b] border-[#27272a] text-[#71717a] hover:text-[#a1a1aa]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1">
                Difficulty
              </label>
              <div className="grid grid-cols-4 gap-1">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => {
                      soundManager.playTap();
                      setDifficulty(diff);
                    }}
                    className={`py-1 px-1 rounded text-[11px] font-medium border text-center transition-colors cursor-pointer ${
                      difficulty === diff
                        ? 'bg-white text-black border-white'
                        : 'bg-[#09090b] border-[#27272a] text-[#71717a] hover:text-[#a1a1aa]'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SCHEDULE DAYS */}
          <div>
            <label className="block text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1">
              Active Days
            </label>
            <div className="flex items-center gap-1">
              {days.map((day) => {
                const isSelected = scheduledDays.includes(day.key);
                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => toggleDay(day.key)}
                    className={`flex-1 h-7 rounded text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer border ${
                      isSelected
                        ? 'bg-[#27272a] text-white border-[#3f3f46]'
                        : 'bg-[#09090b] text-[#71717a] border-[#27272a] hover:bg-[#18181b]'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#27272a] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playTap();
                onClose();
              }}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-[#a1a1aa] hover:text-white bg-[#18181b] hover:bg-[#27272a] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-neutral-200 text-black shadow-sm transition-colors cursor-pointer"
            >
              {initialHabit ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{initialHabit ? 'Save Changes' : 'Confirm Goal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
