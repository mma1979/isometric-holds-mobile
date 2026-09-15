import React, { useState } from 'react';
import { APP_STORES, AppStoreListing } from '../data/protocols';
import { Bell, Sparkles, Clock } from 'lucide-react';

export const StoreBadges: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const handleStoreClick = (e: React.MouseEvent, store: AppStoreListing) => {
    if (store.status === 'Coming Soon') {
      e.preventDefault();
      setActiveToast(`${store.name} release is currently ${store.badge.toLowerCase()}! Download the APK directly above for instant access.`);
      setTimeout(() => {
        setActiveToast(null);
      }, 4500);
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'google-play':
        return (
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 512 512">
            <path fill="#4285F4" d="M47.1 27.8C44 32.7 42.2 38.8 42.2 46.2v419.6c0 7.4 1.8 13.5 4.9 18.4l230.7-228.2L47.1 27.8z" />
            <path fill="#FBBC04" d="M352.4 328.6l-74.6-72.6 74.6-72.6 86.8 49.3c14.6 8.3 22.8 23.3 22.8 39.5s-8.2 31.2-22.8 39.5l-86.8 46.9z" />
            <path fill="#EA4335" d="M47.1 27.8l230.7 228.2 74.6-72.6L124.9 57.3C102.3 44.5 72.8 33.6 47.1 27.8z" />
            <path fill="#34A853" d="M47.1 484.2c25.7-5.8 55.2-16.7 77.8-29.5l227.5-126.1-74.6-72.6L47.1 484.2z" />
          </svg>
        );
      case 'apple':
        return (
          <svg className="w-6 h-6 shrink-0 fill-current text-white" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.59-7.71-11.66-14.01-6.19-9.57-11.05-20.73-14.59-33.48-3.54-12.75-5.31-24.3-5.31-34.65 0-14.35 3.73-26.17 11.2-35.48 7.46-9.3 16.7-14.03 27.71-14.19 5.34 0 11.13 1.41 17.38 4.23 6.24 2.82 10.18 4.29 11.79 4.41 1.74-.24 5.92-1.85 12.54-4.82 6.62-2.96 12.51-4.27 17.68-3.92 13.59.98 24.3 6.09 32.14 15.34-11.74 7.07-17.44 16.63-17.09 28.69.34 9.57 4.13 17.62 11.37 24.14 7.23 6.52 15.65 10.23 25.26 11.13-2.39 7.4-5.33 14.8-8.83 22.2zM119.22 33.64c0-7.39 2.61-14.28 7.82-20.67 5.22-6.39 11.63-10.71 19.23-12.97-.22 1.52-.43 3.04-.65 4.57-.43 3.48-1.52 7.07-3.26 10.76-1.74 3.7-4.13 6.95-7.17 9.78-3.26 3.04-6.85 5.32-10.76 6.84-2.83 1.09-4.99 1.63-6.52 1.63-.44 0-.87-.04-1.3-.14-.22-1.3-.39-2.5-.39-3.8z" />
          </svg>
        );
      case 'huawei':
        return (
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 100 100">
            <rect width="100" height="100" rx="22" fill="#E60012" />
            <path fill="#FFFFFF" d="M50 20c-8.8 0-16 7.2-16 16v6h4v-6c0-6.6 5.4-12 12-12s12 5.4 12 12v6h4v-6c0-8.8-7.2-16-16-16z" />
            <path fill="#FFFFFF" d="M26 42h48l-4 40H30L26 42zm12 12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2s-.9-2-2-2H40c-1.1 0-2 .9-2 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Toast alert */}
      {activeToast && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-medium flex items-center justify-between gap-3 shadow-lg shadow-black/40 animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400 shrink-0" />
            <span>{activeToast}</span>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-amber-400 hover:text-white text-xs font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Badges container */}
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${compact ? '' : 'mt-2'}`}>
        {APP_STORES.map((store) => (
          <a
            key={store.id}
            href={store.url || '#'}
            onClick={(e) => handleStoreClick(e, store)}
            className="group relative flex items-center justify-between p-4 rounded-2xl bg-gray-900/90 hover:bg-gray-850 border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer select-none"
          >
            <div className="flex items-center gap-3.5">
              {renderIcon(store.icon)}
              <div className="text-left">
                <div className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">
                  {store.label}
                </div>
                <div className="text-sm font-extrabold text-white tracking-tight leading-tight group-hover:text-amber-400 transition-colors">
                  {store.sublabel}
                </div>
              </div>
            </div>

            {/* Status Pill */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center gap-1">
                <Clock size={10} />
                <span>{store.status}</span>
              </span>
              <span className="text-[9px] text-gray-500 font-mono mt-0.5">{store.badge}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
