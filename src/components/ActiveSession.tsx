import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, SkipForward, X, CheckCircle, Volume2, VolumeX, Timer, Flame, Trophy, PlayCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { exercises } from '../data';
import { SessionConfigItem } from '../types';
import { useLogs } from '../store';
import ExerciseGraphic from './ExerciseGraphic';
import { playSessionStart, playTransition, playSessionEnd } from '../audio';

const speak = (text: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
};

interface ActiveSessionProps {
  config: SessionConfigItem[];
  onComplete: () => void;
  onCancel: () => void;
}

type StepType = 'prepare' | 'hold' | 'rest';

interface SessionStep {
  type: StepType;
  durationMs: number;
  exerciseId: string;
  setNum: number;
  totalSets: number;
  configData: SessionConfigItem;
}

export default function ActiveSession({ config, onComplete, onCancel }: ActiveSessionProps) {
  const { addLog, logs } = useLogs();
  const sessionStartTime = useRef(Date.now());
  
  // Build the flat sequence of steps
  const sequence = useMemo(() => {
    const steps: SessionStep[] = [];
    config.forEach((cfg, exIdx) => {
      for (let s = 1; s <= cfg.sets; s++) {
        // Prepare phase (5 seconds)
        steps.push({
          type: 'prepare',
          durationMs: 5000,
          exerciseId: cfg.exerciseId,
          setNum: s,
          totalSets: cfg.sets,
          configData: cfg
        });
        
        // Hold phase
        steps.push({
          type: 'hold',
          durationMs: cfg.duration * 1000,
          exerciseId: cfg.exerciseId,
          setNum: s,
          totalSets: cfg.sets,
          configData: cfg
        });
        
        // Rest phase (configured rest time, except after the very last set of the session)
        if (s < cfg.sets || exIdx < config.length - 1) {
          steps.push({
            type: 'rest',
            durationMs: cfg.rest * 1000,
            exerciseId: cfg.exerciseId,
            setNum: s,
            totalSets: cfg.sets,
            configData: cfg
          });
        }
      }
    });
    return steps;
  }, [config]);

  const [stepIndex, setStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  
  // Timing state
  const currentStep = sequence[stepIndex];
  const [remainingTime, setRemainingTime] = useState(currentStep?.durationMs || 0);
  const [endTime, setEndTime] = useState<number | null>(Date.now() + (currentStep?.durationMs || 0));
  const spokenStepRef = useRef<number>(-1);

  // Play start sound on mount
  useEffect(() => {
    if (voiceEnabled) {
      playSessionStart();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setShowVideo(false);
  }, [currentStep?.exerciseId]);

  // Voice guide effect
  useEffect(() => {
    if (!voiceEnabled || !currentStep || isFinished) return;
    if (spokenStepRef.current === stepIndex) return; // Prevent repeating on voiceEnabled toggle
    spokenStepRef.current = stepIndex;

    const exercise = exercises.find(e => e.id === currentStep.exerciseId);
    
    if (currentStep.type === 'prepare') {
      speak(`Get ready for ${exercise?.title}. Set ${currentStep.setNum} of ${currentStep.totalSets}.`);
    } else if (currentStep.type === 'hold') {
      speak(`Hold for ${currentStep.configData.duration} seconds.`);
    } else if (currentStep.type === 'rest') {
      speak(`Rest for 15 seconds.`);
    }
  }, [stepIndex, currentStep, isFinished, voiceEnabled]);

  // Session complete effect
  useEffect(() => {
    if (isFinished && voiceEnabled) {
      playSessionEnd();
      setTimeout(() => speak("Session complete. Great job!"), 1000); // Give the gong a moment to ring
    }
  }, [isFinished, voiceEnabled]);

  // Initialize timing when step changes
  useEffect(() => {
    if (!currentStep) return;
    setRemainingTime(currentStep.durationMs);
    setEndTime(isPaused ? null : Date.now() + currentStep.durationMs);
  }, [stepIndex, currentStep, isPaused]);

  // The requestAnimationFrame loop for the timer
  useEffect(() => {
    if (isPaused || !endTime || isFinished) return;

    let frameId: number;
    const tick = () => {
      const now = Date.now();
      const newRemaining = Math.max(0, endTime - now);
      setRemainingTime(newRemaining);

      if (newRemaining > 0) {
        frameId = requestAnimationFrame(tick);
      }
    };
    
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPaused, endTime, isFinished]);

  // Handle step completion
  useEffect(() => {
    if (remainingTime === 0 && !isPaused && !isFinished) {
      handleNextStep();
    }
  }, [remainingTime, isPaused, isFinished]);

  const handleNextStep = () => {
    if (!currentStep) return;
    
    // Log the exercise if we just finished its final HOLD set
    if (currentStep.type === 'hold' && currentStep.setNum === currentStep.totalSets) {
      addLog({
        id: uuidv4(),
        exerciseId: currentStep.exerciseId,
        date: new Date().toISOString(),
        sets: currentStep.totalSets,
        durationReps: currentStep.configData.duration,
        weight: 0 // Bodyweight assumed for guided session
      });
    }

    if (stepIndex + 1 < sequence.length) {
      if (voiceEnabled) playTransition();
      setStepIndex(stepIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleSkip = () => {
    handleNextStep();
  };

  const togglePause = () => {
    if (isPaused) {
      // Unpausing: calculate new end time based on remaining time
      setEndTime(Date.now() + remainingTime);
      setIsPaused(false);
    } else {
      // Pausing: clear end time
      setEndTime(null);
      setIsPaused(true);
    }
  };

  if (isFinished) {
    const totalTimeHeld = config.reduce((acc, curr) => acc + (curr.sets * curr.duration), 0);
    const totalRestTime = config.reduce((acc, curr) => acc + (curr.sets * curr.rest), 0);
    const caloriesBurned = Math.round((totalTimeHeld / 60) * 5 + (totalRestTime / 60) * 1.5);

    // Find personal bests BEFORE this session started
    const bests: Record<string, number> = {};
    const previousLogs = logs.filter(l => new Date(l.date).getTime() < sessionStartTime.current);
    previousLogs.forEach(l => {
      if (!bests[l.exerciseId] || l.durationReps > bests[l.exerciseId]) {
         bests[l.exerciseId] = l.durationReps;
      }
    });

    const newRecords = config
      .filter(c => c.duration > (bests[c.exerciseId] || 0))
      .map(c => ({
         exercise: exercises.find(e => e.id === c.exerciseId),
         duration: c.duration,
         oldBest: bests[c.exerciseId] || 0
      }));

    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center pt-10 animate-in zoom-in-95 duration-500 pb-20">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h2 className="mb-2 text-3xl font-bold text-white">Session Complete!</h2>
        <p className="mb-8 text-center text-gray-400">Great job! All your exercises have been automatically logged.</p>
        
        {/* Stats Grid */}
        <div className="w-full grid gap-4 sm:grid-cols-2 mb-8">
           <div className="flex items-center gap-4 rounded-2xl bg-gray-900/50 p-5 border border-gray-800 transition-colors hover:border-gray-700">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                 <Timer className="h-6 w-6" />
              </div>
              <div>
                 <p className="text-sm font-medium text-gray-400">Total Hold Time</p>
                 <p className="text-xl font-bold text-white">
                    {Math.floor(totalTimeHeld / 60)}m {totalTimeHeld % 60}s
                 </p>
              </div>
           </div>
           
           <div className="flex items-center gap-4 rounded-2xl bg-gray-900/50 p-5 border border-gray-800 transition-colors hover:border-gray-700">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                 <Flame className="h-6 w-6" />
              </div>
              <div>
                 <p className="text-sm font-medium text-gray-400">Est. Calories Burned</p>
                 <p className="text-xl font-bold text-white">{caloriesBurned} kcal</p>
              </div>
           </div>
        </div>

        {/* Records Section */}
        {newRecords.length > 0 && (
           <div className="w-full rounded-2xl bg-gray-900/50 p-6 border border-yellow-500/30 mb-8 shadow-[0_0_30px_rgba(234,179,8,0.05)]">
              <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-yellow-500">
                 <Trophy className="h-5 w-5" />
                 New Personal Records!
              </h3>
              <div className="space-y-4">
                 {newRecords.map(record => (
                    <div key={record.exercise?.id} className="flex items-center justify-between border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                       <span className="font-medium text-white">{record.exercise?.title}</span>
                       <div className="text-right flex items-baseline gap-2">
                          <span className="font-bold text-green-400 text-xl">{record.duration}s</span>
                          <span className="text-xs text-gray-500 font-medium">(was {record.oldBest}s)</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        <button
          onClick={onComplete}
          className="w-full sm:w-auto rounded-xl bg-yellow-500 px-10 py-4 font-bold text-gray-950 transition-all hover:bg-yellow-400 hover:shadow-xl hover:shadow-yellow-500/20 active:scale-95"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (!currentStep) return null;

  const exercise = exercises.find(e => e.id === currentStep.exerciseId);
  const seconds = Math.ceil(remainingTime / 1000);

  // Styling based on phase
  let phaseColor = 'text-white';
  let phaseBg = 'bg-gray-800';
  let phaseLabel = '';
  
  if (currentStep.type === 'prepare') {
    phaseColor = 'text-yellow-500';
    phaseBg = 'bg-yellow-500/10 ring-yellow-500/30';
    phaseLabel = 'Get Ready';
  } else if (currentStep.type === 'hold') {
    phaseColor = 'text-green-500';
    phaseBg = 'bg-green-500/10 ring-green-500/30';
    phaseLabel = 'Hold!';
  } else if (currentStep.type === 'rest') {
    phaseColor = 'text-blue-400';
    phaseBg = 'bg-blue-500/10 ring-blue-500/30';
    phaseLabel = 'Rest';
  }

  return (
    <div className="mx-auto max-w-4xl animate-in fade-in duration-500 pb-20 px-2 sm:px-0">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onCancel}
          className="group flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
        >
          <X className="h-5 w-5" />
          End Session
        </button>
        <div className="flex items-center justify-between w-full sm:w-auto sm:gap-4">
          <div className="text-sm font-medium text-gray-500">
            Step {stepIndex + 1} of {sequence.length}
          </div>
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`flex items-center gap-2 p-2 sm:p-0 text-sm font-medium transition-colors ${voiceEnabled ? 'text-yellow-500 hover:text-yellow-400' : 'text-gray-500 hover:text-gray-400'}`}
            title={voiceEnabled ? "Mute Voice Guide" : "Enable Voice Guide"}
          >
            {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
        {/* Left Column: Visuals & Info */}
        <div className="space-y-4 sm:space-y-6">
          <div className="overflow-hidden rounded-2xl bg-gray-900 ring-1 ring-white/10 aspect-square sm:aspect-video relative group">
             {showVideo ? (
               <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${exercise?.videoId}?controls=1&rel=0&playsinline=1&modestbranding=1&autoplay=1`}
                  title={exercise?.title} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute inset-0 transition-opacity duration-500"
               ></iframe>
             ) : (
               <>
                 <ExerciseGraphic 
                   exerciseId={exercise?.id || ''}
                   className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${currentStep.type === 'rest' ? 'opacity-30' : 'opacity-80'}`}
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
             {currentStep.type === 'rest' && !showVideo && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="text-4xl font-bold text-white tracking-widest uppercase drop-shadow-lg">Resting...</span>
               </div>
             )}
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h2 className="text-2xl font-bold text-white mb-2">{exercise?.title}</h2>
            <div className="flex gap-4">
              <span className="inline-flex rounded-md bg-gray-800 px-3 py-1 text-sm font-medium text-gray-300">
                Set {currentStep.setNum} of {currentStep.totalSets}
              </span>
              <span className="inline-flex rounded-md bg-gray-800 px-3 py-1 text-sm font-medium text-gray-300">
                Target: {currentStep.configData.duration}s
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Active Timer */}
          <div className="flex flex-col items-center justify-center space-y-8 sm:space-y-10 rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8 py-10 sm:py-16">
          
          <div className="text-center space-y-2 sm:space-y-4">
            <h3 className={`text-2xl sm:text-3xl font-extrabold uppercase tracking-widest ${phaseColor}`}>
              {phaseLabel}
            </h3>
          </div>

          <div className={`flex h-56 w-56 sm:h-64 sm:w-64 items-center justify-center rounded-full ring-4 transition-all duration-500 ${phaseBg}`}>
            <span className={`font-mono text-7xl sm:text-8xl font-bold tabular-nums tracking-tight ${phaseColor}`}>
              {seconds}
            </span>
          </div>

          <div className="flex w-full items-center justify-center gap-6">
            <button
              onClick={togglePause}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-800 text-white transition-all hover:bg-gray-700 active:scale-95"
            >
              {isPaused ? (
                <Play className="h-10 w-10 ml-1 fill-current" />
              ) : (
                <Pause className="h-10 w-10 fill-current" />
              )}
            </button>
            
            <button
              onClick={handleSkip}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-800/50 text-gray-400 transition-all hover:bg-gray-700 hover:text-white active:scale-95"
              title="Skip phase"
            >
              <SkipForward className="h-6 w-6" />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
