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
          <div className="absolute inset-0 bg-primary-500 rounded-xl blur-xl opacity-40 animate-pulse"></div>
          <div className="w-16 h-16 bg-white dark:bg-dark-900 border-2 border-primary-500 rounded-xl flex items-center justify-center relative shadow-lg">
            <BedDouble className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-bounce" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-300">
            Roomora
          </h2>
          <p className="text-sm font-medium text-gray-400 animate-pulse mt-1">
            Validating...
          </p>
        </div>
      </div>
    </div>
  );
}
