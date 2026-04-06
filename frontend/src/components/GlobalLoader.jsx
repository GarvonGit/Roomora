import { useState, useEffect } from 'react';
import { BedDouble } from 'lucide-react';

export default function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleLoaderEvent = (e) => {
      setIsLoading(e.detail.isLoading);
    };

    window.addEventListener('global-loader', handleLoaderEvent);
    return () => window.removeEventListener('global-loader', handleLoaderEvent);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm transition-opacity">
      <div className="flex flex-col items-center gap-4 p-8 bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-700 animate-in fade-in zoom-in duration-300">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 rounded-xl blur-xl opacity-40 animate-pulse"></div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30 flex items-center justify-center relative">
             <span className="text-white text-4xl leading-none font-black animate-bounce mt-2">R</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-black tracking-tighter text-blue-900 dark:text-white mt-2">
            Roomora<span className="text-blue-600 dark:text-primary-500">.</span>
          </h2>
          <p className="text-sm font-medium text-gray-400 animate-pulse mt-1">
            Validating...
          </p>
        </div>
      </div>
    </div>
  );
}
