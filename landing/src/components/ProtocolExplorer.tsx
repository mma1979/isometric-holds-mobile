import React, { useState } from 'react';
import { PROTOCOLS, TrainingProtocol, ProtocolExercise } from '../data/protocols';
import { Sparkles, Timer, Target, ChevronRight, Info, CheckCircle2 } from 'lucide-react';

export const ProtocolExplorer: React.FC = () => {
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>(PROTOCOLS[0].id);
  const activeProtocol = PROTOCOLS.find((p) => p.id === selectedProtocolId) || PROTOCOLS[0];

  return (
    <section id="protocols" className="py-24 bg-gray-950/60 border-t border-gray-800/80 relative">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Mastery Across Traditions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            5 Distinct Training Protocols
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            From ancient Shaolin temple conditioning to modern sports science and physical therapy.
            Choose a protocol to inspect holds, targeted muscles, and biomechanical alignment cues.
          </p>
        </div>

        {/* Protocol Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
          {PROTOCOLS.map((protocol) => {
            const isSelected = protocol.id === activeProtocol.id;
            return (
              <button
                key={protocol.id}
                onClick={() => setSelectedProtocolId(protocol.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-gray-950 shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-gray-900/90 text-gray-300 hover:text-white hover:bg-gray-800/80 border border-gray-800'
                }`}
              >
                <span>{protocol.title}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-gray-950/20 text-gray-950' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {protocol.exerciseCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Protocol Overview Card */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-gray-900/90 to-gray-900/50 border border-gray-800 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {activeProtocol.tag}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {activeProtocol.exerciseCount} Core Exercises
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">{activeProtocol.title}</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{activeProtocol.description}</p>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-8 gap-3">
              <div className="text-left md:text-right">
                <div className="text-xs text-gray-400 font-medium">Session Duration</div>
                <div className="text-lg font-bold text-amber-400 font-mono">8 – 15 mins</div>
              </div>
              <a
                href="#download"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-gray-950 hover:bg-amber-300 transition"
              >
                <span>Run In App</span>
                <ChevronRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Exercises Grid for the Selected Protocol */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProtocol.exercises.map((ex: ProtocolExercise, idx: number) => (
            <div
              key={ex.id}
              className="group bg-gray-900/70 hover:bg-gray-900/90 border border-gray-800 hover:border-amber-500/30 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Exercise Image Header */}
              <div className="relative h-48 w-full bg-gray-950 overflow-hidden">
                <img
                  src={ex.image}
                  alt={ex.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  onError={(e) => {
                    // Graceful fallback display if asset fails to load
                    (e.target as HTMLElement).style.opacity = '0.3';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

                {/* Duration Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-950/80 backdrop-blur border border-gray-800 text-xs font-mono font-bold text-amber-400">
                  <Timer size={13} />
                  <span>{ex.defaultDuration}s</span>
                </div>

                {/* Index badge */}
                <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-gray-900/90 border border-gray-700 flex items-center justify-center text-[11px] font-mono font-bold text-gray-300">
                  {idx + 1}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    {ex.name}
                  </h4>
                  <div className="text-xs text-gray-400 font-medium mt-0.5">{ex.subtitle}</div>

                  <p className="text-xs text-gray-300 mt-3 leading-relaxed">{ex.description}</p>
                </div>

                {/* Muscle target tags */}
                <div className="space-y-3 pt-3 border-t border-gray-800/80">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <Target size={14} className="text-amber-400" />
                    <span>Target Muscles:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ex.targetMuscles.map((muscle) => (
                      <span
                        key={muscle}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-gray-800/80 text-gray-300 border border-gray-700/60 font-medium"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>

                  {/* Form Cue Callout */}
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-[11px] text-amber-200/90 flex items-start gap-2">
                    <Info size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-amber-400 font-semibold">Pro Cue:</strong> {ex.cue}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
