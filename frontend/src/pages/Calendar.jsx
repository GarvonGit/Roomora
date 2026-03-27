import { useState } from 'react';
import { ChevronLeft, ChevronRight, Zap, TrendingUp, Plus, X } from 'lucide-react';

const initialIndianHolidays = [
  { id: 'ind-1', date: '2026-01-26', name: 'Republic Day', type: 'public_holiday' },
  { id: 'ind-2', date: '2026-03-03', name: 'Maha Shivaratri', type: 'religious' },
  { id: 'ind-3', date: '2026-03-24', name: 'Holi', type: 'religious' },
  { id: 'ind-4', date: '2026-04-14', name: 'Ambedkar Jayanti', type: 'public_holiday' },
  { id: 'ind-5', date: '2026-08-15', name: 'Independence Day', type: 'public_holiday' },
  { id: 'ind-6', date: '2026-08-28', name: 'Janmashtami', type: 'religious' },
  { id: 'ind-7', date: '2026-10-02', name: 'Gandhi Jayanti', type: 'public_holiday' },
  { id: 'ind-8', date: '2026-10-18', name: 'Dussehra', type: 'religious' },
  { id: 'ind-9', date: '2026-11-08', name: 'Diwali', type: 'religious' },
  { id: 'ind-10', date: '2026-12-25', name: 'Christmas', type: 'religious' }
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [customEvents, setCustomEvents] = useState([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventName, setNewEventName] = useState('');
  const [newEventType, setNewEventType] = useState('other');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonthDays = Array.from({ length: firstDay }, (_, i) => daysInPrevMonth - firstDay + i + 1);
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalSlots = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const nextMonthDaysCount = totalSlots - (firstDay + daysInMonth);
  const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handlePricingSuggest = () => {
    const thisMonthEvents = [...initialIndianHolidays, ...customEvents].filter(e => {
       const [y, m] = e.date.split('-');
       return parseInt(y) === year && parseInt(m) === month + 1;
    });

    if (thisMonthEvents.length > 0) {
      const types = thisMonthEvents.map(e => e.type);
      let insight = '';
      let markup = 20;

      if (types.includes('sports')) {
         insight = 'Due to an upcoming major sports match in your city this month, out-of-town fans will create a massive demand surge!';
         markup = 80;
      } else if (types.includes('concert')) {
         insight = 'A scheduled concert this month will draw heavy tourism. Bookings usually spike 2 weeks prior.';
         markup = 70;
      } else if (types.includes('religious') || types.includes('public_holiday')) {
         insight = 'Upcoming religious or public holidays detected. Families will be traveling locally.';
         markup = 50;
      } else {
         insight = 'Custom events detected in your area.';
         markup = 40;
      }

      alert(`🤖 AI Pricing Insight for ${currentDate.toLocaleString('default', { month: 'long' })}:\n\n${insight}\n\nRecommendation: Increase base room rates by up to ${markup}% on and immediately surrounding these dates to maximize revenue.`);
    } else {
      alert(`🤖 AI Pricing Insight for ${currentDate.toLocaleString('default', { month: 'long' })}:\n\nNo major events detected for this month. Maintain baseline competitive pricing to ensure steady occupancy.`);
    }
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if(newEventDate && newEventName) {
       setCustomEvents([...customEvents, { 
         id: `custom-${Date.now()}`, 
         date: newEventDate, 
         name: newEventName, 
         type: newEventType 
       }]);
       setIsModalOpen(false);
       setNewEventDate('');
       setNewEventName('');
       setNewEventType('other');
    }
  };

  const handleDeleteEvent = (id) => {
    setCustomEvents(customEvents.filter(e => e.id !== id));
  };

  const today = new Date();

  const checkHoliday = (y, m, d) => {
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const foundCustom = customEvents.find(h => h.date === dateStr);
    const foundIndian = initialIndianHolidays.find(h => h.date === dateStr);
    if (foundCustom) return { ...foundCustom, isCustom: true };
    if (foundIndian) return { ...foundIndian, isCustom: false };
    return null; 
  };

  const getPricingForDate = (y, m, d) => {
    const isWeekend = [0, 6].includes(new Date(y, m, d).getDay());
    const holidayObj = checkHoliday(y, m, d);
    const isHoliday = !!holidayObj;
    const isLowDemand = (d + m) % 5 === 0 && !isHoliday && !isWeekend;
    
    let basePrice = 1500;
    let finalPrice = basePrice;
    
    if (isHoliday) {
      if (holidayObj.type === 'sports') finalPrice = basePrice * 1.8;
      else if (holidayObj.type === 'concert') finalPrice = basePrice * 1.7;
      else if (holidayObj.type === 'religious' || holidayObj.type === 'public_holiday') finalPrice = basePrice * 1.5;
      else finalPrice = basePrice * 1.4;
    }
    else if (isWeekend) finalPrice = 1800; // standard weekend
    else if (isLowDemand) finalPrice = 1100; // low demand
    
    const isToday = y === today.getFullYear() && m === today.getMonth() && d === today.getDate();
    if (isToday && !isHoliday && !isWeekend && !isLowDemand) {
      finalPrice = basePrice;
    }
    
    const isFuture = new Date(y, m, d).setHours(0,0,0,0) > today.setHours(0,0,0,0);
    
    let bgClass = "bg-white dark:bg-dark-900";
    let textClass = "text-gray-900 dark:text-gray-100";
    
    if (!isFuture) {
      if (finalPrice > basePrice) {
        bgClass = "bg-green-50 dark:bg-green-900/20";
      } else if (finalPrice < basePrice) {
        bgClass = "bg-red-50 dark:bg-red-900/20";
      }
    } else if (isHoliday) {
      bgClass = "bg-red-50/50 dark:bg-red-900/10";
    }

    return { basePrice, finalPrice, holidayObj, isWeekend, isLowDemand, isToday, isFuture, bgClass, textClass };
  };

  const renderDay = (y, m, d, isCurrentMonth, keyPrefix) => {
    const dateObj = new Date(y, m, d);
    const renderY = dateObj.getFullYear();
    const renderM = dateObj.getMonth();
    const renderD = dateObj.getDate();

    const { basePrice, finalPrice, holidayObj, isToday, isFuture, bgClass, textClass } = getPricingForDate(renderY, renderM, renderD);
    const opacityClass = isCurrentMonth ? "opacity-100" : "opacity-40 grayscale-[30%]";
    
    const profit = finalPrice - basePrice;

    return (
      <div 
        key={`${keyPrefix}-${renderY}-${renderM}-${renderD}`} 
        className={`${bgClass} ${opacityClass} min-h-[130px] p-2 sm:p-3 hover:brightness-95 dark:hover:brightness-110 transition-all cursor-pointer group flex flex-col relative border-r border-b border-gray-100 dark:border-dark-700
          ${isToday ? 'ring-2 ring-primary-500 ring-inset shadow-lg scale-[1.02] z-10 rounded-lg overflow-hidden' : ''}
        `}
      >
        {isToday && (
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-500 to-purple-500 animate-pulse"></div>
        )}
        
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col w-full">
            <span className={`font-bold text-sm ${isToday ? 'text-primary-600 dark:text-primary-400' : textClass}`}>
              {renderD} {isToday && <span className="ml-1 text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full">Today</span>}
            </span>
            {holidayObj && (
              <div className="flex items-center justify-between mt-1 gap-1">
                <span className="text-[9px] text-red-600 dark:text-red-400 font-bold truncate max-w-[70px]" title={holidayObj.name}>
                  {holidayObj.name}
                </span>
                {holidayObj.isCustom && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteEvent(holidayObj.id); }}
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 bg-white/50 dark:bg-black/20 rounded-full p-0.5 transition-colors"
                    title="Delete Event"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            )}
          </div>
          {!isFuture && profit > 0 && <span className="text-green-600 dark:text-green-400 text-xs font-semibold shrink-0">+{profit}</span>}
          {!isFuture && profit < 0 && <span className="text-red-600 dark:text-red-400 text-xs font-semibold shrink-0">{profit}</span>}
        </div>

        <div className="mt-auto space-y-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <div className="flex justify-between items-center text-[10px] text-gray-500 bg-black/5 dark:bg-white/5 p-1 rounded">
            <span>Base:</span> <span>₹{Math.floor(basePrice)}</span>
          </div>
          <div className={`flex justify-between items-center text-[11px] p-1 rounded font-semibold
            ${(!isFuture && profit > 0) ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 
              (!isFuture && profit < 0) ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 
              'bg-gray-100 text-gray-700 dark:bg-dark-800 dark:text-gray-300'}`}
          >
            <span>{isFuture ? 'Predicted:' : 'Final:'}</span> <span>₹{Math.floor(finalPrice)}</span>
          </div>
        </div>

        {isToday && (
          <div className="mt-2 pt-2 border-t border-primary-200 dark:border-primary-800/50 flex flex-col gap-1 items-center bg-white/50 dark:bg-dark-900/50 p-1.5 rounded-md animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-1 text-[9px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide">
              <TrendingUp className="w-3 h-3" /> High Demand!
            </div>
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-medium py-1.5 rounded transition-colors shadow-sm">
              Increase +15%
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-1">Roomora Pricing Calendar</h2>
          <p className="text-gray-500 text-sm">Visualize demand and adjust rates dynamically (₹)</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Event
          </button>
          <button 
            onClick={handlePricingSuggest}
            className="btn-primary flex items-center gap-2 bg-gradient-to-r from-purple-600 to-primary-600 border-0"
          >
            <Zap className="w-4 h-4 text-yellow-300" /> Get AI Suggestions
          </button>
        </div>
      </div>

      <div className="card shadow-sm border border-gray-100 dark:border-dark-700 p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-dark-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 min-w-[160px]">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex items-center bg-gray-100 dark:bg-dark-800 rounded-lg p-1">
                <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white dark:hover:bg-dark-700 rounded-md transition-all shadow-sm">
                  <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date())} 
                  className="px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Today
                </button>
                <button onClick={handleNextMonth} className="p-1.5 hover:bg-white dark:hover:bg-dark-700 rounded-md transition-all shadow-sm">
                  <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 text-xs font-medium bg-gray-50 dark:bg-dark-800 p-2.5 rounded-lg border border-gray-100 dark:border-dark-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-sm shadow-sm ring-1 ring-black/5"></div> 
                <span className="text-gray-600 dark:text-gray-300">Profit (&gt; Base)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-sm shadow-sm ring-1 ring-black/5"></div> 
                <span className="text-gray-600 dark:text-gray-300">Loss (&lt; Base)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-primary-500 rounded-sm shadow-sm"></div> 
                <span className="text-gray-600 dark:text-gray-300">Current Day Action</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900">
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-dark-700 bg-gray-50/50 dark:bg-dark-800/50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-r border-gray-200 dark:border-dark-700 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 border-l-0 border-r-0 border-gray-200 dark:border-dark-700">
            {prevMonthDays.map((day) => renderDay(year, month - 1, day, false, "prev"))}
            {currentMonthDays.map((day) => renderDay(year, month, day, true, "curr"))}
            {nextMonthDays.map((day) => renderDay(year, month + 1, day, false, "next"))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-900 rounded-xl w-full max-w-sm shadow-2xl p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4">Add Custom Event</h3>
            <p className="text-xs text-gray-500 mb-4">AI uses the event type to suggest real-world optimal price multipliers.</p>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Name</label>
                <input required type="text" value={newEventName} onChange={e => setNewEventName(e.target.value)} className="input-field" placeholder="e.g. World Cup Match" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input required type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Event Type</label>
                <select value={newEventType} onChange={e => setNewEventType(e.target.value)} className="input-field py-2.5">
                  <option value="sports">Major Sports Match (Cricket, Football)</option>
                  <option value="concert">Concert / Festival / Show</option>
                  <option value="religious">Religious Event / Public Holiday</option>
                  <option value="corporate">Corporate Conference / Summit</option>
                  <option value="other">Other High Demand Event</option>
                </select>
              </div>
              <button type="submit" className="w-full btn-primary mt-4">Save Event Engine</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
