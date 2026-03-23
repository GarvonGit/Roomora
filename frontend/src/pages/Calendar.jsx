import { useState } from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDay }, (_, i) => i);

  const mockHolidays = [14, 25]; // e.g., mock Indian holidays
  const weekendDays = [0, 6];

  const handlePricingSuggest = () => {
    alert('AI Engine Suggested Price: Room rate increased by 20% on holidays based on high demand prediction.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-1">Roomora Pricing Calendar</h2>
          <p className="text-gray-500 text-sm">Visualize demand and adjust rates dynamically (₹)</p>
        </div>
        <button 
          onClick={handlePricingSuggest}
          className="btn-primary flex items-center gap-2 bg-gradient-to-r from-purple-600 to-primary-600 border-0"
        >
          <Zap className="w-4 h-4 text-yellow-300" /> Get AI Suggestions
        </button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-3">
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </h3>
          <div className="flex gap-4 text-xs font-medium">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-100 dark:bg-red-900/40 border border-red-300 rounded"></div> Holiday / Peak</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded"></div> Weekend</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-50 dark:bg-dark-800 border-gray-200 dark:border-gray-700 border rounded"></div> Normal</div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-dark-700 border border-gray-200 dark:border-dark-700 rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 dark:bg-dark-800 py-2 text-center text-xs font-semibold text-gray-500">
              {day}
            </div>
          ))}

          {padding.map((p) => (
            <div key={`pad-${p}`} className="bg-white dark:bg-dark-900 min-h-[100px] opacity-50" />
          ))}

          {days.map((day) => {
            const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isWeekend = weekendDays.includes(dateObj.getDay());
            const isHoliday = mockHolidays.includes(day);

            let bgClass = "bg-white dark:bg-dark-900";
            if (isHoliday) bgClass = "bg-red-50 dark:bg-red-900/10";
            else if (isWeekend) bgClass = "bg-blue-50/50 dark:bg-blue-900/10";

            return (
              <div 
                key={day} 
                className={`${bgClass} min-h-[100px] p-2 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors cursor-pointer group flex flex-col`}
              >
                <div className={`font-medium text-sm mb-1 ${isHoliday ? 'text-red-600 dark:text-red-400' : ''}`}>
                  {day} {isHoliday && '🎯'}
                </div>
                <div className="mt-auto space-y-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="text-[10px] text-gray-500 bg-gray-100 dark:bg-dark-800 p-1 rounded">₹1,500 Base</div>
                  {isHoliday && <div className="text-[10px] text-primary-600 bg-primary-50 dark:bg-primary-500/10 p-1 rounded font-semibold">₹1,800 Peak</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
