/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { exercises } from './data';
import ExerciseDetail from './components/ExerciseDetail';
import DailyAchievement from './components/DailyAchievement';
import SessionConfigurator from './components/SessionConfigurator';
import ActiveSession from './components/ActiveSession';
import ExerciseGraphic from './components/ExerciseGraphic';
import { SessionConfigItem } from './types';
import { PlayCircle, Play } from 'lucide-react';

export default function App() {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [isConfiguringSession, setIsConfiguringSession] = useState(false);
  const [activeSessionConfig, setActiveSessionConfig] = useState<SessionConfigItem[] | null>(null);

  const selectedExercise = selectedExerciseId
    ? exercises.find((e) => e.id === selectedExerciseId)
    : null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 selection:bg-yellow-500/30">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
          <div 
            className="flex items-center gap-3 cursor-pointer transition-opacity hover:opacity-80"
            onClick={() => {
              setSelectedExerciseId(null);
              setIsConfiguringSession(false);
              setActiveSessionConfig(null);
            }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500 font-bold text-gray-950">
              SH
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Shaolin Isometric Holds
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {activeSessionConfig ? (
          <ActiveSession
            config={activeSessionConfig}
            onComplete={() => setActiveSessionConfig(null)}
            onCancel={() => setActiveSessionConfig(null)}
          />
        ) : isConfiguringSession ? (
          <SessionConfigurator
            onStart={(cfg) => {
              setActiveSessionConfig(cfg);
              setIsConfiguringSession(false);
            }}
            onCancel={() => setIsConfiguringSession(false)}
          />
        ) : selectedExercise ? (
          <ExerciseDetail
            exercise={selectedExercise}
            onBack={() => setSelectedExerciseId(null)}
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                6 Shaolin Isometric Holds
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
                No weights. No movement. Just pure strength. Track your progression through the ancient isometric techniques.
              </p>
              
              <button
                onClick={() => setIsConfiguringSession(true)}
                className="mt-8 mx-auto flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-yellow-500 px-8 py-4 text-lg font-bold text-gray-950 shadow-xl transition-all hover:bg-yellow-400 hover:shadow-yellow-500/20 active:scale-[0.98]"
              >
                <Play className="h-5 w-5 fill-current" />
                Start Guided Session
              </button>
            </div>

            <DailyAchievement />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {exercises.map((exercise, idx) => (
                <div
                  key={exercise.id}
                  onClick={() => setSelectedExerciseId(exercise.id)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 p-1 transition-all hover:border-yellow-500/50 hover:bg-gray-800 hover:shadow-2xl hover:shadow-yellow-500/10"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-950 relative">
                     <ExerciseGraphic 
                       exerciseId={exercise.id}
                       className="h-full w-full opacity-70 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent pointer-events-none"></div>
                     
                     <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <div>
                           <div className="mb-1 flex items-center gap-2">
                             <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-gray-950">
                               {idx + 1}
                             </span>
                           </div>
                           <h3 className="text-xl font-bold text-white">{exercise.title}</h3>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-transform group-hover:scale-110 group-hover:bg-yellow-500 group-hover:text-gray-950">
                          <PlayCircle className="h-5 w-5" />
                        </div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
