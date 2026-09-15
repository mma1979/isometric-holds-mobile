import React, { useState, useEffect } from 'react';
import { Play, Pause, Flame, Volume2, ShieldCheck, Zap, RotateCcw } from 'lucide-react';

export const PhoneMockup: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(42);
  const [isActive, setIsActive] = useState(true);
  const totalSeconds = 60;

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 60));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const strokeDashoffset = 283 - (283 * progressPercent) / 100;

  return (
    <div className="relative mx-auto w-[290px] sm:w-[320px] md:w-[340px] aspect-[9/18.8] bg-gray-900 rounded-[48px] p-3.5 shadow-2xl shadow-amber-500/10 border-[6px] border-gray-800 ring-1 ring-white/10 select-none">
      {/* Speaker / Dynamic Island */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-gray-950 rounded-full z-30 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-gray-800 mr-2"></div>
        <div className="w-8 h-1 bg-gray-800 rounded-full"></div>
      </div>

      {/* Screen container */}
      <div className="w-full h-full bg-gray-950 rounded-[38px] overflow-hidden flex flex-col relative border border-gray-800/60 text-white">
        {/* Status Bar */}
        <div className="pt-3 px-6 flex justify-between items-center text-[10px] text-gray-400 font-mono tracking-wider z-20">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="w-4 h-2 rounded-[2px] border border-gray-400 p-[0.5px] flex items-center">
              <div className="h-full w-full bg-amber-400 rounded-[1px]"></div>
            </div>
          </div>
        </div>

        {/* Screen Header */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-gray-800/50">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1">
              <Zap size={10} className="fill-amber-400" />
              <span>Shaolin Holds Protocol</span>
            </div>
            <div className="text-sm font-extrabold text-white">Horse Stance (Ma Bu)</div>
          </div>
          <div className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] text-amber-300 font-semibold">
            Hold 4 of 6
          </div>
        </div>

        {/* Interactive App Screen Center Body */}
        <div className="flex-1 px-4 py-3 flex flex-col items-center justify-between overflow-hidden">
          {/* Exercise thumbnail preview */}
          <div className="w-full h-28 rounded-2xl overflow-hidden relative bg-gray-900 border border-gray-800 shadow-inner group">
            <img
              src="./images/shaolen/4-horse-stance.webp"
              alt="Horse Stance"
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                // Fallback if image path differs
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px]">
              <span className="bg-gray-950/80 backdrop-blur px-2 py-0.5 rounded-md text-gray-300 border border-gray-800 font-mono">
                Target: Adductors • Quads
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Volume2 size={11} /> Audio ON
              </span>
            </div>
          </div>

          {/* Circular Countdown Gauge */}
          <div className="relative my-2 flex items-center justify-center">
            <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="currentColor"
                strokeWidth="6"
                className="text-gray-800/80"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="url(#amberGradient)"
                strokeWidth="6"
                strokeDasharray="276"
                strokeDashoffset={(276 * (100 - progressPercent)) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
                fill="transparent"
              />
              <defs>
                <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner countdown numbers */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                {secondsLeft}
                <span className="text-xs font-sans text-amber-400 font-semibold ml-0.5">s</span>
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">HOLD TENSION</span>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="w-full grid grid-cols-2 gap-2 text-center text-[10px]">
            <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-1.5">
              <div className="text-gray-400 font-medium">Session Time</div>
              <div className="text-xs font-bold text-gray-200 font-mono">04:18</div>
            </div>
            <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-1.5">
              <div className="text-gray-400 font-medium">Heart Stress</div>
              <div className="text-xs font-bold text-emerald-400 font-mono flex items-center justify-center gap-1">
                <ShieldCheck size={11} /> LOW IMPACT
              </div>
            </div>
          </div>

          {/* App Controls Bar */}
          <div className="w-full flex items-center justify-center gap-3 pt-1">
            <button
              onClick={() => setSecondsLeft(60)}
              className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white active:scale-95 transition"
              title="Reset Hold"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={() => setIsActive(!isActive)}
              className="px-5 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/30 active:scale-95 transition"
            >
              {isActive ? <Pause size={14} className="fill-gray-950" /> : <Play size={14} className="fill-gray-950" />}
              <span>{isActive ? 'Pause' : 'Resume'}</span>
            </button>
          </div>
        </div>

        {/* Bottom bar navigation bar mock */}
        <div className="h-5 flex items-center justify-center pb-2">
          <div className="w-28 h-1 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
