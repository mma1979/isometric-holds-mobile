import React, { useState } from 'react';
import { APK_RELEASES } from '../data/protocols';
import { StoreBadges } from './StoreBadges';
import {
  Download,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  HelpCircle,
  HardDrive,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Store,
} from 'lucide-react';

export const DownloadSection: React.FC = () => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <section id="download" className="py-24 bg-gray-900/40 border-t border-gray-800/80 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Download size={14} />
            <span>Direct Android Sideload & Stores</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Install Isometric Holds on Android
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Free, open, and lightweight. Download the production release APK directly and start training in seconds.
          </p>
        </div>

        {/* APK Download Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {APK_RELEASES.map((rel) => (
            <div
              key={rel.filename}
              className={`p-8 rounded-3xl transition-all duration-300 relative flex flex-col justify-between ${
                rel.recommended
                  ? 'bg-gradient-to-b from-gray-900 via-gray-900/90 to-gray-950 border-2 border-amber-400/80 shadow-2xl shadow-amber-500/10'
                  : 'bg-gray-900/70 border border-gray-800'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    rel.recommended
                      ? 'bg-amber-400 text-gray-950 shadow-md shadow-amber-500/20'
                      : 'bg-gray-800 text-gray-300 border border-gray-700'
                  }`}
                >
                  {rel.badge}
                </span>
                <span className="text-sm font-mono font-bold text-amber-400 flex items-center gap-1.5">
                  <HardDrive size={15} />
                  {rel.size}
                </span>
              </div>

              <div className="space-y-3 mb-8">
                <h3 className="text-2xl font-bold text-white">{rel.type}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{rel.subtitle}</p>

                <div className="text-xs text-gray-500 font-mono pt-2">File: {rel.filename}</div>
              </div>

              {/* Download CTA */}
              <a
                href={rel.path}
                download={rel.filename}
                className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg ${
                  rel.recommended
                    ? 'bg-amber-400 hover:bg-amber-300 text-gray-950 shadow-amber-500/25'
                    : 'bg-gray-800 hover:bg-gray-750 text-white border border-gray-700 hover:border-gray-600'
                }`}
              >
                <Download size={18} className="stroke-[2.5]" />
                <span>Download {rel.filename.includes('arm64') ? 'ARM64 APK' : 'Universal APK'}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Official App Stores Section (Google, Apple, Huawei) */}
        <div className="mb-12 bg-gray-950/80 border border-gray-800/80 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Store size={20} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">App Stores Distribution</h4>
                <p className="text-xs text-gray-400">Planned & upcoming releases across major mobile app marketplaces</p>
              </div>
            </div>
            <span className="self-start sm:self-auto text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700 font-mono">
              In Review & Staging
            </span>
          </div>

          <StoreBadges />
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 py-6 border-y border-gray-800/80 text-xs sm:text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" />
            <span>Clean & Malware-Free</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-amber-400" />
            <span>Android 9.0 (Pie) or newer</span>
          </div>
          <div className="flex items-center gap-2">
            <FileCheck size={18} className="text-blue-400" />
            <span>Self-contained APK</span>
          </div>
        </div>

        {/* Expandable Sideloading Instructions */}
        <div className="mt-12 bg-gray-900/60 border border-gray-800 rounded-3xl p-6 sm:p-8">

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <HelpCircle size={20} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">How to install an APK on Android</h4>
                <p className="text-xs text-gray-400">First time sideloading? It takes less than 30 seconds.</p>
              </div>
            </div>
            <div className="p-2 text-gray-400 hover:text-white">
              {showGuide ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </button>

          {showGuide && (
            <div className="mt-6 pt-6 border-t border-gray-800 space-y-4 text-sm text-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-950/80 p-5 rounded-2xl border border-gray-800/80 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-gray-950 font-bold flex items-center justify-center text-xs">
                    1
                  </div>
                  <div className="font-bold text-white text-base">Download the APK</div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Click the <strong>Download ARM64 APK</strong> button above from your Android browser (Chrome, Brave, etc.).
                  </p>
                </div>

                <div className="bg-gray-950/80 p-5 rounded-2xl border border-gray-800/80 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-gray-950 font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <div className="font-bold text-white text-base">Allow Install Unknown Apps</div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    When prompted by Android, tap <strong>Settings</strong> and toggle on <em>"Allow from this source"</em>.
                  </p>
                </div>

                <div className="bg-gray-950/80 p-5 rounded-2xl border border-gray-800/80 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-gray-950 font-bold flex items-center justify-center text-xs">
                    3
                  </div>
                  <div className="font-bold text-white text-base">Tap Install & Train</div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Tap <strong>Install</strong> on the confirmation dialog, then tap <strong>Open</strong> to start your first session!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
