import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ScienceSection } from './components/ScienceSection';
import { ProtocolExplorer } from './components/ProtocolExplorer';
import { FeaturesGrid } from './components/FeaturesGrid';
import { InteractiveTimer } from './components/InteractiveTimer';
import { DownloadSection } from './components/DownloadSection';
import { AboutDeveloper } from './components/AboutDeveloper';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-300">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ScienceSection />
        <ProtocolExplorer />
        <FeaturesGrid />
        <InteractiveTimer />
        <DownloadSection />
        <AboutDeveloper />
      </main>
      <Footer />
    </div>
  );
};

export default App;
