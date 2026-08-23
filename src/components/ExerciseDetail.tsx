import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Clock, Dumbbell, History, Target, PlayCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Exercise } from '../types';
import { useLogs } from '../store';
import ProgressChart from './ProgressChart';
import Stopwatch from './Stopwatch';
import ExerciseGraphic from './ExerciseGraphic';
import { format, parseISO } from 'date-fns';

interface ExerciseDetailProps {
  exercise: Exercise;
  onBack: () => void;
}

export default function ExerciseDetail({ exercise, onBack }: ExerciseDetailProps) {
  const { logs, addLog, getLogsForExercise, deleteLog } = useLogs();
  const exerciseLogs = getLogsForExercise(exercise.id);

  const [sets, setSets] = useState(3);
  const [durationReps, setDurationReps] = useState(30);
  const [weight, setWeight] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setShowVideo(false);
  }, [exercise.id]);

  const handleLogWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    addLog({
      id: uuidv4(),
      exerciseId: exercise.id,
      date: new Date().toISOString(),
      sets,
      durationReps,
      weight,
    });
  };

  return (
    <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-2 sm:px-0">
      <button
        onClick={onBack}
        className="group mb-4 sm:mb-6 flex items-center gap-2 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Dashboard
      </button>

      <div className="mb-8 grid gap-6 lg:gap-8 lg:grid-cols-2">
        {/* Left Column: Video & Instructions */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{exercise.title}</h1>
            <p className="mt-1 text-gray-400">Shaolin Isometric Hold</p>
          </div>

          <div className="overflow-hidden rounded-2xl bg-gray-900 ring-1 ring-white/10 aspect-video relative group">
             {showVideo ? (
               <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${exercise.videoId}?controls=1&rel=0&playsinline=1&modestbranding=1&autoplay=1`}
                  title={exercise.title} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute inset-0"
               ></iframe>
             ) : (
               <>
                 <ExerciseGraphic 
                   exerciseId={exercise.id}
                   className="absolute inset-0 h-full w-full transition-opacity duration-500 opacity-80"
                 />
                 <div className="absolute inset-0 flex items-center justify-center bg-gray-950/20 group-hover:bg-gray-950/40 transition-colors">
                   <button
                     onClick={() => setShowVideo(true)}
                     className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-gray-950 shadow-xl transition-transform hover:scale-110 hover:bg-yellow-400 z-10"
                   >
                     <Play className="h-8 w-8 ml-1 fill-current" />
                   </button>
                 </div>
               </>
             )}
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <Target className="h-5 w-5 text-yellow-500" />
              How to Perform
            </h3>
            <ul className="space-y-3">
              {exercise.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-500/10 text-xs font-bold text-yellow-500">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 sm:p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Progression Guide</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="text-gray-400">Week 1</span>
                <span className="font-medium text-white">{exercise.progression.week1}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="text-gray-400">Week 2</span>
                <span className="font-medium text-white">{exercise.progression.week2}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Week 3</span>
                <span className="font-medium text-yellow-500">{exercise.progression.week3}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tracking */}
        <div className="space-y-6">
          <Stopwatch onUseTime={(sec) => setDurationReps(sec)} />

          <form onSubmit={handleLogWorkout} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
              <Plus className="h-5 w-5 text-yellow-500" />
              Log Your Session
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Sets</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={sets}
                  onChange={(e) => setSets(Number(e.target.value))}
                  className="block w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white transition-colors focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Duration (sec) / Reps</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="number"
                    min="1"
                    required
                    value={durationReps}
                    onChange={(e) => setDurationReps(Number(e.target.value))}
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-white transition-colors focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-400 flex justify-between">
                  <span>Weight (Optional)</span>
                  <span className="text-xs text-gray-500">lbs/kg</span>
                </label>
                <div className="relative">
                  <Dumbbell className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="number"
                    min="0"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    placeholder="Bodyweight"
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-white transition-colors focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-yellow-500 px-4 py-3 font-semibold text-gray-950 transition-transform hover:bg-yellow-400 active:scale-[0.98]"
            >
              Save Log
            </button>
          </form>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
             <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <History className="h-5 w-5 text-yellow-500" />
              Progress Tracker
            </h3>
            <ProgressChart logs={exerciseLogs} />
          </div>
          
          {exerciseLogs.length > 0 && (
             <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
                <h4 className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">History</h4>
                <div className="space-y-3">
                  {exerciseLogs.slice().reverse().map((log) => (
                    <div key={log.id} className="flex items-center justify-between rounded-xl bg-gray-800 p-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-white">
                          {format(parseISO(log.date), 'MMM d, yyyy - h:mm a')}
                        </p>
                        <p className="text-xs text-gray-400">
                          {log.sets} sets × {log.durationReps} sec {log.weight > 0 ? `+ ${log.weight} wgt` : '(Bodyweight)'}
                        </p>
                      </div>
                      <button 
                        onClick={() => deleteLog(log.id)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
