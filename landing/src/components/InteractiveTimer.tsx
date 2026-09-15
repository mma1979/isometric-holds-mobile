import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle, Flame, Sparkles } from 'lucide-react';

const DEMO_EXERCISES = [
  { id: 'wall-sit', name: 'Wall Sit Hold', duration: 45, muscles: 'Quads & Glutes' },
  { id: 'plank', name: 'RKC Forearm Plank', duration: 40, muscles: 'Deep Core & Obliques' },
  { id: 'horse-stance', name: 'Shaolin Horse Stance', duration: 60, muscles: 'Adductors & Pelvic Floor' },
  { id: 'hollow-body', name: 'Hollow Body Hold', duration: 30, muscles: 'Midline & Abdominals' },
];

export const InteractiveTimer: React.FC = () => {
  const [selectedEx, setSelectedEx] = useState(DEMO_EXERCISES[0]);
  const [timeLeft, setTimeLeft] = useState(selectedEx.duration);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completed, setCompleted] = useState(false);

  // Web Audio Context for synthesized beep sounds (works in browser without external files!)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = (freq = 600, duration = 0.15) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  useEffect(() => {
    let timer: any = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 4 && prev > 1) {
            playBeep(440, 0.1); // Countdown beep
          } else if (prev === 1) {
            playBeep(880, 0.35); // Completion double chime
            setCompleted(true);
            setIsActive(false);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const handleSelectExercise = (ex: typeof DEMO_EXERCISES[0]) => {
    setSelectedEx(ex);
    setTimeLeft(ex.duration);
    setIsActive(false);
    setCompleted(false);
  };

  const handleReset = () => {
    setTimeLeft(selectedEx.duration);
    setIsActive(false);
    setCompleted(false);
  };

  const handleTogglePlay = () => {
    if (completed) {
      setTimeLeft(selectedEx.duration);
      setCompleted(false);
    }
    if (!isActive) {
      playBeep(520, 0.15);
    }
    setIsActive(!isActive);
  };

  const total = selectedEx.duration;
  const progressPercent = ((total - timeLeft) / total) * 100;
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100;

  return (
    <section id="demo" className="py-24 bg-gray-950 border-t border-gray-800/80 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Try a 45-Second Hold Right Now
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Experience the tension countdown, audio timing cues, and focus flow built into the mobile app.
          </p>
        </div>

        {/* Demo Timer Box */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Exercise Selector Chips */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
            {DEMO_EXERCISES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => handleSelectExercise(ex)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedEx.id === ex.id
                    ? 'bg-amber-400 text-gray-950 shadow-md shadow-amber-500/20'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700/80'
                }`}
              >
                {ex.name} ({ex.duration}s)
              </button>
            ))}
          </div>

          {/* Central Timer Display */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center my-4">
              <svg className="w-56 h-56 sm:w-64 sm:h-64 -rotate-90 transform" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-gray-800/80"
                  fill="transparent"
                />
                {/* Progress Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="url(#demoGradient)"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="demoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#ca8a04" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Countdown Numbers */}
              <div className="absolute flex flex-col items-center justify-center">
                {completed ? (
                  <div className="flex flex-col items-center animate-pulse">
                    <CheckCircle size={44} className="text-amber-400 mb-1" />
                    <span className="text-xl font-bold text-white">COMPLETE!</span>
                    <span className="text-xs text-amber-300 font-medium">Tendon Tension Forged</span>
                  </div>
                ) : (
                  <>
                    <span className="text-5xl sm:text-6xl font-black font-mono text-white tracking-tight">
                      {timeLeft}
                      <span className="text-base text-amber-400 ml-1">s</span>
                    </span>
                    <span className="text-xs text-gray-400 font-semibold tracking-widest uppercase mt-1">
                      {isActive ? 'HOLD STEADY' : 'READY TO START'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Hold Details */}
            <div className="text-center mt-2 space-y-1">
              <h3 className="text-lg font-bold text-white">{selectedEx.name}</h3>
              <p className="text-xs text-gray-400 font-mono">Target: {selectedEx.muscles}</p>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-3 rounded-full border transition ${
                  soundEnabled
                    ? 'bg-gray-800 border-gray-700 text-amber-400'
                    : 'bg-gray-800 border-gray-700 text-gray-500'
                }`}
                title={soundEnabled ? 'Audio cues enabled' : 'Audio cues muted'}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>

              <button
                onClick={handleTogglePlay}
                className="px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-gray-950 font-bold text-base flex items-center gap-2 shadow-lg shadow-amber-500/25 transition"
              >
                {isActive ? (
                  <>
                    <Pause size={18} className="fill-gray-950" />
                    <span>Pause Hold</span>
                  </>
                ) : (
                  <>
                    <Play size={18} className="fill-gray-950" />
                    <span>{completed ? 'Hold Again' : 'Start Hold'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-3 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white active:scale-95 transition"
                title="Reset timer"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
