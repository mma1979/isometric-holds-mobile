import React, { useState } from 'react';
import { Play, ArrowLeft, Check } from 'lucide-react';
import { exercises } from '../data';
import { SessionConfigItem } from '../types';

interface SessionConfiguratorProps {
  onStart: (config: SessionConfigItem[]) => void;
  onCancel: () => void;
}

interface LocalConfig {
  selected: boolean;
  sets: number;
  duration: number;
  rest: number;
}

export default function SessionConfigurator({ onStart, onCancel }: SessionConfiguratorProps) {
  const [configs, setConfigs] = useState<Record<string, LocalConfig>>(() => {
    const initial: Record<string, LocalConfig> = {};
    exercises.forEach(ex => {
      initial[ex.id] = { selected: true, sets: 3, duration: 30, rest: 10 };
    });
    return initial;
  });

  const toggleSelect = (id: string) => {
    setConfigs(prev => ({
      ...prev,
      [id]: { ...prev[id], selected: !prev[id].selected }
    }));
  };

  const updateConfig = (id: string, field: 'sets' | 'duration' | 'rest', value: number) => {
    if (value < 1) return;
    setConfigs(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const sessionConfig = exercises
    .filter(ex => configs[ex.id].selected)
    .map(ex => ({
      exerciseId: ex.id,
      sets: configs[ex.id].sets,
      duration: configs[ex.id].duration,
      rest: configs[ex.id].rest,
    }));

  const totalSelected = sessionConfig.length;
  
  // Estimate calculations
  const totalHoldTime = sessionConfig.reduce((acc, curr) => acc + (curr.sets * curr.duration), 0);
  const totalRestTime = sessionConfig.reduce((acc, curr) => acc + (curr.sets * curr.rest), 0);
  // Assume ~5 kcal/min for active holding, and ~1.5 kcal/min for resting
  const estimatedCalories = Math.round((totalHoldTime / 60) * 5 + (totalRestTime / 60) * 1.5);
  const totalSessionMinutes = Math.ceil((totalHoldTime + totalRestTime) / 60);

  const handleStart = () => {
    if (sessionConfig.length > 0) {
      onStart(sessionConfig);
    }
  };

  return (
    <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <button
        onClick={onCancel}
        className="group mb-4 sm:mb-6 flex items-center gap-2 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Dashboard
      </button>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Configure Session</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-400">Select the exercises and set your targets for this guided session.</p>
      </div>

      <div className="space-y-4 mb-8">
        {exercises.map((exercise, idx) => {
          const config = configs[exercise.id];
          const isSelected = config.selected;

          return (
            <div 
              key={exercise.id}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                isSelected ? 'border-yellow-500/50 bg-gray-900 shadow-[0_0_20px_rgba(234,179,8,0.05)]' : 'border-gray-800 bg-gray-900/30 hover:border-gray-700'
              }`}
            >
              <div 
                className="flex cursor-pointer items-center p-4 sm:p-6"
                onClick={() => toggleSelect(exercise.id)}
              >
                <div className={`mr-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  isSelected ? 'border-yellow-500 bg-yellow-500 text-gray-950' : 'border-gray-600'
                }`}>
                  {isSelected && <Check className="h-4 w-4" />}
                </div>
                
                <div className="flex-1">
                  <h3 className={`text-lg font-bold transition-colors ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                    <span className="mr-2 text-sm font-normal text-gray-500">{idx + 1}.</span>
                    {exercise.title}
                  </h3>
                </div>
              </div>

              {isSelected && (
                <div className="border-t border-gray-800 bg-gray-800/30 p-4 sm:px-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">Sets</label>
                      <input
                        type="number"
                        min="1"
                        value={config.sets}
                        onChange={(e) => updateConfig(exercise.id, 'sets', parseInt(e.target.value) || 1)}
                        className="block w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-white transition-colors focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">Hold Duration (sec)</label>
                      <input
                        type="number"
                        min="5"
                        value={config.duration}
                        onChange={(e) => updateConfig(exercise.id, 'duration', parseInt(e.target.value) || 5)}
                        className="block w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-white transition-colors focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">Rest Interval (sec)</label>
                      <input
                        type="number"
                        min="0"
                        value={config.rest}
                        onChange={(e) => updateConfig(exercise.id, 'rest', parseInt(e.target.value) || 0)}
                        className="block w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-white transition-colors focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-4 sm:bottom-6 z-10 mx-auto max-w-md w-full px-4 sm:px-0 bg-gray-950/80 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none pb-4 pt-2 sm:p-0">
        <div className="mb-3 flex items-center justify-between px-2 text-sm">
          <span className="font-medium text-gray-400">Total Time: ~{totalSessionMinutes} min</span>
          <span className="font-bold text-yellow-500">{estimatedCalories} kcal</span>
        </div>
        <button
          onClick={handleStart}
          disabled={totalSelected === 0}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-500 px-6 py-4 sm:py-4 font-bold text-gray-950 shadow-xl transition-all hover:bg-yellow-400 hover:shadow-yellow-500/20 active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-yellow-500"
        >
          <Play className="h-5 w-5 fill-current" />
          Start {totalSelected} {totalSelected === 1 ? 'Exercise' : 'Exercises'}
        </button>
      </div>
    </div>
  );
}
