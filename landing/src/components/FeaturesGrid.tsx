import React from 'react';
import {
  Play,
  Timer,
  Volume2,
  BookOpen,
  Layers,
  ShieldCheck,
  Smartphone,
  Flame,
  Award,
  Calendar,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Play,
    title: 'Guided Workout Runner',
    description:
      'Configurable hold and rest intervals. The screen guides you seamlessly through sets without needing to touch your phone.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Volume2,
    title: 'Voice Coaching & Audio Cues',
    description:
      'Clear synthesized vocal cues announce exercise names, 3-2-1 countdowns, halfway marks, and rest periods with gentle haptics.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Timer,
    title: 'Dedicated Hold Stopwatch',
    description:
      'Want to test maximum hold duration? Fire up the standalone stopwatch to measure your limits and log personal records instantly.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: BookOpen,
    title: 'Biomechanical Form Cues',
    description:
      'Every hold includes anatomical muscle targets, posture cues, common mistakes to avoid, and linked video walkthroughs.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Layers,
    title: 'Custom Routine Builder',
    description:
      'Mix and match holds from Shaolin, Core, and PT protocols to build custom workouts matched to your personal rehab or strength goals.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
  {
    icon: ShieldCheck,
    title: '100% Offline & Private',
    description:
      'Zero ads, zero trackers, zero cloud signups. All workouts, history, and streaks stay exclusively on your local device storage.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
];

export const FeaturesGrid: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-gray-950/80 border-t border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Smartphone size={14} />
            <span>Engineered for Focus</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Built for Serious Training
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            A minimalist, distraction-free companion that lets you focus entirely on breathing and maintaining tension.
          </p>
        </div>

        {/* 6 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-8 rounded-3xl bg-gray-900/60 hover:bg-gray-900/90 border border-gray-800 hover:border-amber-500/30 transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${feat.bg} flex items-center justify-center ${feat.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feat.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-800/60 flex items-center text-xs text-gray-500 font-medium">
                  <span>Included in v2.3.0</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
