import React from 'react';
import { SCIENCE_PILLARS } from '../data/protocols';
import { Activity, BookCheck, Check, HeartPulse, Zap } from 'lucide-react';

export const ScienceSection: React.FC = () => {
  return (
    <section id="science" className="py-24 bg-gray-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Activity size={14} />
            <span>Exercise Physiology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Why Isometric Holds Work
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Static muscular contraction produces unique biological adaptations that dynamic lifting cannot replicate.
            Here is how holding tension transforms tendons, blood vessels, and the central nervous system.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {SCIENCE_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="p-8 rounded-3xl bg-gray-900/80 border border-gray-800 hover:border-gray-700 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`text-2xl sm:text-3xl font-black font-mono ${pillar.color}`}>
                    {pillar.stat}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-800 text-gray-400 border border-gray-700">
                    {pillar.statLabel}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-sm text-gray-300 leading-relaxed">{pillar.description}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <BookCheck size={14} className="text-amber-400" />
                  <span>Peer-reviewed biomechanics</span>
                </span>
                <span className="font-mono text-[11px] text-gray-500">IsoProtocol v2.3</span>
              </div>
            </div>
          ))}
        </div>

        {/* Deep Dive Callout Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-500/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <h4 className="text-xl sm:text-2xl font-bold text-white">
              No Weights, No Machines, No Excuses.
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              Every protocol in the app is calibrated to be performed with just gravity, a floor, and a wall.
              Perfect for home conditioning, traveling hotel workouts, desk break resets, and injury rehabilitation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="#demo"
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-amber-400 text-gray-950 hover:bg-amber-300 transition text-center"
            >
              Test In-Browser Demo
            </a>
            <a
              href="#download"
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 border border-gray-700 transition text-center"
            >
              Get Android APK
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
