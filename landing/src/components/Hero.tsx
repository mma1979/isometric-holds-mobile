import React from 'react';
import { Download, PlayCircle, ShieldCheck, Flame, Zap, ArrowRight, Activity } from 'lucide-react';
import { PhoneMockup } from './PhoneMockup';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background ambient decorative glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Version & release pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>v2.3.0 Release • 80% Smaller Footprint (14.5MB)</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Forge Unbreakable Tendons & <br className="hidden sm:inline" />
              <span className="text-gradient-gold">Raw Static Power.</span>
            </h1>

            {/* Body Copy */}
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Eliminate joint pain and recruit dormant muscle fibers without weights or gym machines.
              Experience 5 battle-tested isometric protocols with audio cues, precision interval timers,
              and 100% offline privacy.
            </p>

            {/* Quick value badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-medium text-gray-400 pt-1">
              <div className="flex items-center gap-1.5 bg-gray-900/80 px-3 py-1.5 rounded-lg border border-gray-800">
                <ShieldCheck size={15} className="text-emerald-400" />
                <span>Zero Joint Impact</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-900/80 px-3 py-1.5 rounded-lg border border-gray-800">
                <Zap size={15} className="text-amber-400" />
                <span>5 Protocols • 28+ Holds</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-900/80 px-3 py-1.5 rounded-lg border border-gray-800">
                <Activity size={15} className="text-blue-400" />
                <span>100% Offline & Private</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#download"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-gray-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all shadow-xl shadow-amber-500/25 group"
              >
                <Download size={20} className="stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
                <span>Download Android APK</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-950/15 font-mono">14.5 MB</span>
              </a>

              <a
                href="#protocols"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-base font-semibold text-gray-200 bg-gray-900/90 hover:bg-gray-800 border border-gray-700/80 hover:border-gray-600 transition-all active:scale-95"
              >
                <span>Explore 5 Protocols</span>
                <ArrowRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Sideload note & Store mentions */}
            <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-4 text-xs text-gray-400">
              <span>Direct APK Sideload (v2.3.0)</span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <a href="#download" className="text-gray-400 hover:text-amber-400 flex items-center gap-1.5 transition">
                <span>Coming soon to</span>
                <strong className="text-gray-300 font-medium">Google Play</strong>,
                <strong className="text-gray-300 font-medium">App Store</strong> &
                <strong className="text-gray-300 font-medium">AppGallery</strong>
                <span className="text-amber-400">→</span>
              </a>
            </div>
          </div>


          {/* Right Column: Live Phone Mockup with floating visual callouts */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Floating feature badge 1: Tendon Armor */}
            <div className="hidden sm:flex absolute -top-4 -left-6 z-20 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gray-900/90 border border-amber-500/30 backdrop-blur-xl shadow-xl shadow-black/60 animate-bounce duration-1000">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                <Flame size={18} />
              </div>
              <div>
                <div className="text-[11px] text-gray-400 uppercase font-semibold">Joint Armor</div>
                <div className="text-xs font-bold text-white">Collagen Thickening</div>
              </div>
            </div>

            {/* Floating feature badge 2: High Recruitment */}
            <div className="hidden sm:flex absolute -bottom-4 -right-4 z-20 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gray-900/90 border border-emerald-500/30 backdrop-blur-xl shadow-xl shadow-black/60">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                <Zap size={18} />
              </div>
              <div>
                <div className="text-[11px] text-gray-400 uppercase font-semibold">Neuromuscular</div>
                <div className="text-xs font-bold text-white">+5% Motor Recruitment</div>
              </div>
            </div>

            {/* The interactive phone mockup */}
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
};
