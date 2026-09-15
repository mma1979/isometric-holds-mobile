import React, { useState, useEffect } from 'react';
import { Download, Menu, X, Shield, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Protocols', href: '#protocols' },
    { name: 'Science', href: '#science' },
    { name: 'Features', href: '#features' },
    { name: 'Interactive Demo', href: '#demo' },
    { name: 'Download', href: '#download' },
    { name: 'About', href: '#about' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-950/85 backdrop-blur-md border-b border-gray-800/80 py-3 shadow-lg shadow-black/40'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-extrabold text-lg shadow-inner group-hover:scale-105 group-hover:border-amber-400 transition-all duration-300">
            IH
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Isometric Holds
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-medium">
                v2.3.0
              </span>
            </span>
            <span className="text-xs text-gray-400 hidden sm:inline">Static Strength & Tendon Resilience</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-amber-400 transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="#download"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all shadow-md shadow-amber-500/20"
          >
            <Download size={16} className="stroke-[2.5]" />
            <span>Download APK</span>
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-950/95 border-b border-gray-800 px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:text-amber-400 hover:bg-gray-900/60"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="#download"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-950 bg-amber-400 hover:bg-amber-300"
            >
              <Download size={16} className="stroke-[2.5]" />
              <span>Download APK (v2.3.0)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
