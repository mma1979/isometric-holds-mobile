import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';

interface StopwatchProps {
  onUseTime: (seconds: number) => void;
}

export default function Stopwatch({ onUseTime }: StopwatchProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // Time in milliseconds
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    let animationFrameId: number;

    const updateTimer = () => {
      const now = performance.now();
      const delta = now - lastUpdateRef.current;
      setTime((prevTime) => prevTime + delta);
      lastUpdateRef.current = now;
      animationFrameId = requestAnimationFrame(updateTimer);
    };

    if (isRunning) {
      lastUpdateRef.current = performance.now();
      animationFrameId = requestAnimationFrame(updateTimer);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  const handleUseTime = () => {
    // Convert ms to seconds and round to nearest whole second
    onUseTime(Math.round(time / 1000));
  };

  // Format time (MM:SS.ms)
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = Math.floor((time % 1000) / 10); // 2 digits

  const formatUnit = (unit: number) => unit.toString().padStart(2, '0');

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 flex flex-col items-center justify-center">
      <div className="mb-2 text-sm font-medium text-gray-400">Isometric Hold Timer</div>
      <div className="mb-6 font-mono text-5xl font-bold tracking-tight text-white tabular-nums">
        {formatUnit(minutes)}:{formatUnit(seconds)}
        <span className="text-3xl text-gray-500">.{formatUnit(milliseconds)}</span>
      </div>
      
      <div className="flex w-full items-center justify-center gap-4">
        <button
          onClick={resetTimer}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
          title="Reset"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        
        <button
          onClick={toggleTimer}
          className={`flex h-16 w-16 items-center justify-center rounded-full text-gray-950 transition-transform active:scale-95 ${
            isRunning ? 'bg-red-500 hover:bg-red-400' : 'bg-yellow-500 hover:bg-yellow-400'
          }`}
          title={isRunning ? "Pause" : "Start"}
        >
          {isRunning ? (
            <Pause className="h-6 w-6 fill-current" />
          ) : (
            <Play className="h-6 w-6 ml-1 fill-current" />
          )}
        </button>
        
        <button
          onClick={handleUseTime}
          disabled={time === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-gray-700 hover:text-green-400 disabled:opacity-50 disabled:hover:bg-gray-800 disabled:hover:text-gray-400"
          title="Use this time in log"
        >
          <CheckCircle2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
