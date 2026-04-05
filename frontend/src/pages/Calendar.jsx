import { useState, useEffect } from 'react';
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Full scale Monthly forecasting & Inventory state
  const [monthForecast, setMonthForecast] = useState(null);
  const [liveInventory, setLiveInventory] = useState([]);
  const [isForecasting, setIsForecasting] = useState(false);
  
  // Selected day breakdown state
  const [selectedDay, setSelectedDay] = useState(null);

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

  const fetchLiveInventory = async () => {
    try {
      const token = localStorage.getItem('token') || 'test';
      const res = await fetch('http://localhost:5001/api/inventory', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setLiveInventory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLiveInventory();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setMonthForecast(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setMonthForecast(null);
  };

  const handleGenerateForecast = async () => {
    setIsForecasting(true);
    try {
      const monthEvents = [...initialIndianHolidays, ...customEvents].filter(e => {
        const [y, m] = e.date.split('-');
        return parseInt(y) === year && parseInt(m) === month + 1;
      });

      const token = localStorage.getItem('token') || 'test';
      const res = await fetch('http://localhost:5001/api/pricing/monthly-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ year, month: month + 1, events: monthEvents, todayDate: new Date().toISOString() })
      });
      const data = await res.json();
      
      if (!res.ok) {
         alert(data.message || data.error || 'Failed to get monthly forecast');
         return;
      }
      
      setMonthForecast(data.forecast);
      fetchLiveInventory(); // Refresh inventory
    } catch(err) {
      console.error(err);
      alert('Network error connecting to Roomora AI engine.');
    } finally {
      setIsForecasting(false);
    }
  };

// Old rule-based suggestion methods have been removed in favor of direct Gemini integration.

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if(newEventDate && newEventName) {
       setIsAnalyzing(true);
       try {
         const token = localStorage.getItem('token') || 'test';
         const res = await fetch('http://localhost:5001/api/pricing/dynamic-recommendation', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
           body: JSON.stringify({ eventDescription: newEventName, date: newEventDate })
         });
         const data = await res.json();
         
         if (!res.ok) {
            alert(data.message || data.error || 'Failed to get AI recommendation');
            setIsAnalyzing(false);
            return;
         }

         setCustomEvents([...customEvents, { 
           id: `custom-${Date.now()}`, 
           date: newEventDate, 
           name: newEventName, 
           type: 'ai_processed',
           aiMultiplier: data.suggestedMultiplier || 1.15,
           aiInsight: data.message || 'Custom event registered.'
         }]);
         
         setIsModalOpen(false);
         setNewEventDate('');
         setNewEventName('');
       } catch (err) {
         console.error('Error fetching AI data', err);
         alert('Network error connecting to AI engine.');
       } finally {
         setIsAnalyzing(false);
       }
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
    const isToday = y === today.getFullYear() && m === today.getMonth() && d === today.getDate();
    const isFuture = new Date(y, m, d).setHours(0,0,0,0) > today.setHours(0,0,0,0);
    
    // Default base attributes
    let basePrice = 1500;
    let finalPrice = basePrice;
    let multiplier = 1.0;
    let insightStr = '';

    // Apply strict Gemini forecast if available for this month
    if (monthForecast && monthForecast[d] && y === year && m === month) {
        multiplier = monthForecast[d].multiplier;
        insightStr = monthForecast[d].insight;
        finalPrice = basePrice * multiplier;
    } else {
        // Fallback placeholder logic
        if (holidayObj && holidayObj.aiMultiplier) {
            multiplier = parseFloat(holidayObj.aiMultiplier);
            finalPrice = basePrice * multiplier;
        } else if (isHoliday) {
            multiplier = 1.4;
            finalPrice = basePrice * multiplier;
        } else if (isWeekend) {
            multiplier = 1.2;
            finalPrice = 1800; 
        }
    }
    
    let bgClass = "bg-white dark:bg-dark-900";
    let textClass = "text-gray-900 dark:text-gray-100";
    
    if (!isFuture) {
      if (finalPrice > basePrice) {
        bgClass = "bg-green-50 dark:bg-green-900/20";
      } else if (finalPrice < basePrice) {
        bgClass = "bg-red-50 dark:bg-red-900/20";
      }
    } else if (multiplier > 1.2) {
      bgClass = "bg-red-50/50 dark:bg-red-900/10";
    }

    return { basePrice, finalPrice, multiplier, insightStr, holidayObj, isSunday: new Date(y, m, d).getDay() === 0, isToday, isFuture, bgClass, textClass };
  };

  const renderDay = (y, m, d, isCurrentMonth, keyPrefix) => {
    const dateObj = new Date(y, m, d);
    const renderY = dateObj.getFullYear();
    const renderM = dateObj.getMonth();
    const renderD = dateObj.getDate();

    const { basePrice, finalPrice, multiplier, insightStr, holidayObj, isToday, isFuture, bgClass, textClass } = getPricingForDate(renderY, renderM, renderD);
    const opacityClass = isCurrentMonth ? "opacity-100" : "opacity-40 grayscale-[30%]";
    
    const profit = finalPrice - basePrice;

    return (
      <div 
        key={`${keyPrefix}-${renderY}-${renderM}-${renderD}`} 
        onClick={() => {
            if (isCurrentMonth) setSelectedDay({ y: renderY, m: renderM, d: renderD, multiplier, insightStr, holidayObj });
        }}
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
            {insightStr && (
              <div className="mt-1 text-[9px] leading-tight text-blue-600 dark:text-blue-400 line-clamp-2" title={insightStr}>
                 {insightStr}
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
            ${(!isFuture && profit > 0) || multiplier > 1 ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 
              (!isFuture && profit < 0) || multiplier < 1 ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 
              'bg-gray-100 text-gray-700 dark:bg-dark-800 dark:text-gray-300'}`}
          >
            <span>{isFuture ? (multiplier > 1 ? '+Inflated:' : multiplier < 1 ? '-Discount:' : 'Final:') : 'Final:'}</span> <span>₹{Math.floor(finalPrice)}</span>
          </div>
        </div>
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
            onClick={handleGenerateForecast}
            disabled={isForecasting}
            className="btn-secondary flex items-center gap-2 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-400"
          >
            {isForecasting ? <Zap className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />} Analyze Month
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Custom Event
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

      {/* Selected Day Room Pricing Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-900 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden relative border border-gray-100 dark:border-dark-700">
            <div className="p-6 pb-4 border-b border-gray-100 dark:border-dark-700 bg-gray-50/50 dark:bg-dark-800/20">
              <button onClick={() => setSelectedDay(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-white dark:bg-dark-800 rounded-full p-1 shadow-sm">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold flex items-center gap-2">
                {new Date(selectedDay.y, selectedDay.m, selectedDay.d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              {selectedDay.holidayObj && <span className="inline-block mt-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-semibold">{selectedDay.holidayObj.name}</span>}
            </div>
            
            <div className="p-6 space-y-5">
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-4 flex gap-3">
                <Zap className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">Roomora AI Strategy</h4>
                  <p className="text-sm text-blue-800/80 dark:text-blue-200/80">
                      {selectedDay.insightStr || "No specific AI monthly analysis available yet. Click 'Analyze Month' to generate demand data."}
                  </p>
                  <p className="text-xs font-bold mt-2 text-blue-900 dark:text-blue-100">Multiplier Selected: <span className="bg-blue-200 dark:bg-blue-800 px-1.5 py-0.5 rounded ml-1">{selectedDay.multiplier}x</span></p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider">Live Dynamic Room Rates</h4>
                <div className="grid gap-3">
                  {(liveInventory && liveInventory.length > 0 ? liveInventory : [
                      { type: 'Standard Room', base_price: 1500, available: 0, total_count: 0 }
                  ]).map(room => (
                      <div key={room.type} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                          <div className="flex flex-col">
                             <span className="font-medium text-sm">{room.type}</span>
                             <span className={`text-[10px] uppercase font-bold 
                                ${room.available <= 2 ? 'text-red-500' : room.available >= room.total_count * 0.8 ? 'text-green-500' : 'text-gray-500'}`}>
                                {room.available} / {room.total_count} Available Left
                             </span>
                          </div>
                          <div className="flex items-center gap-4">
                              <span className="text-xs text-gray-400 line-through">₹{room.base_price}</span>
                              <span className={`font-bold ${selectedDay.multiplier > 1 ? 'text-green-600 dark:text-green-400' : selectedDay.multiplier < 1 ? 'text-red-500' : ''}`}>
                                 ₹{Math.floor(room.base_price * selectedDay.multiplier)}
                              </span>
                          </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-900 rounded-xl w-full max-w-sm shadow-2xl p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4">Add Custom Event</h3>
            <p className="text-xs text-gray-500 mb-4">Describe the event in detail. Roomora AI will research the event's impact and suggest an intelligent price markup.</p>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Description</label>
                <textarea required rows="3" value={newEventName} onChange={e => setNewEventName(e.target.value)} className="input-field w-full" placeholder="e.g. CSK vs RCB IPL match at Narendra Modi Stadium, Ahmedabad" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input required type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} className="input-field" />
              </div>
              <button disabled={isAnalyzing} type="submit" className="w-full btn-primary mt-4 flex items-center justify-center gap-2">
                {isAnalyzing ? <><Zap className="w-4 h-4 animate-pulse text-yellow-300" /> Analyzing Demand...</> : 'Save & Analyze'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
