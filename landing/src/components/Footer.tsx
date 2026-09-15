import React from 'react';
import { ArrowUp, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-950 border-t border-gray-800/80 py-12 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-extrabold text-sm">
              IH
            </div>
            <div>
              <div className="text-white font-bold text-sm">Isometric Holds</div>
              <div className="text-gray-500">v2.3.0 Production • Offline First</div>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex items-center gap-6">
            <a href="#protocols" className="hover:text-amber-400 transition">
              Protocols
            </a>
            <a href="#science" className="hover:text-amber-400 transition">
              Science
            </a>
            <a href="#demo" className="hover:text-amber-400 transition">
              Interactive Demo
            </a>
            <a href="#download" className="hover:text-amber-400 transition">
              Download
            </a>
            <a href="#about" className="hover:text-amber-400 transition">
              About
            </a>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 hover:text-white transition"
          >
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500">
          <p>© {new Date().getFullYear()} Isometric Holds. Created by Mohammed Abdelhay. All rights reserved.</p>
          <div className="flex items-center gap-2 text-gray-400">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>100% Privacy Respecting • Zero Third-Party Analytics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
