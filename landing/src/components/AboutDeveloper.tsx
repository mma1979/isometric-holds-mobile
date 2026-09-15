import React from 'react';
import { Mail, Linkedin, ExternalLink, Heart, Shield, Code2, Terminal } from 'lucide-react';

export const AboutDeveloper: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-gray-950 border-t border-gray-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-gray-900 via-gray-900/90 to-gray-950 border border-gray-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar badge */}
            <div className="w-24 h-24 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 font-extrabold text-3xl shrink-0 shadow-inner">
              MA
            </div>

            <div className="space-y-4 text-center md:text-left flex-1">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Terminal size={13} className="text-amber-400" />
                  <span>Creator & Software Craftsman</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Mohammed Abdelhay</h3>
                <p className="text-amber-400 text-sm font-medium">Engineer & Martial Arts Conditioning Enthusiast</p>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                I engineered <strong>Isometric Holds</strong> to solve a personal pain point: modern fitness apps are
                filled with bloated subscriptions, invasive tracking, and flashy distractions. This app was crafted
                to be a timeless, distraction-free training sanctuary—100% offline, privacy-first, and grounded in
                authentic martial conditioning and sports science.
              </p>

              {/* Social / Contact Links */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                <a
                  href="mailto:mamado2000@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm font-semibold text-white border border-gray-700 transition"
                >
                  <Mail size={16} className="text-amber-400" />
                  <span>mamado2000@gmail.com</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/mohammed-abdelhay"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a66c2]/20 hover:bg-[#0a66c2]/30 text-sm font-semibold text-blue-300 border border-[#0a66c2]/40 transition"
                >
                  <Linkedin size={16} className="text-blue-400" />
                  <span>LinkedIn Profile</span>
                  <ExternalLink size={13} className="text-blue-400/80" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
