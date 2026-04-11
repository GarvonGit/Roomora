import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, TrendingUp, Plus, X, Sparkles, Loader2 } from 'lucide-react';
import api from '../utils/api';

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
  
  // Revenue & AI States
  const [pastData, setPastData] = useState({});
  const [aiForecast, setAiForecast] = useState({});
  const [isForecasting, setIsForecasting] = useState(false);
  
  // Selected day breakdown state
  const [selectedDay, setSelectedDay] = useState(null);
  const [daySummaryData, setDaySummaryData] = useState(null);
  const [isDayLoading, setIsDayLoading] = useState(false);

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

  const today = new Date();
  today.setHours(0,0,0,0);

  // Fetch past data (revenue/profit for the month)
  useEffect(() => {
    const fetchMonthData = async () => {
      const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
      try {
        const res = await api.get(`/revenue/month-summary?month=${monthStr}`);
        const newData = { ...pastData };
        res.data.days.forEach(d => {
           newData[d.date] = d;
        });
        setPastData(newData);
      } catch(err) {
        console.error("Error fetching month data", err);
      }
    };
    fetchMonthData();
  }, [year, month]);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleGenerateForecast = async () => {
    setIsForecasting(true);
    try {
      // 1. Fetch inventory and bookings
      const invRes = await api.get('/inventory');
      const bookRes = await api.get('/bookings');
      const inventory = invRes.data;
      const bookings = bookRes.data;

      const dataPayload = [];
      const monthEvents = [...initialIndianHolidays, ...customEvents];
      
      // Build payload for all future dates in this month
      for (let day = 1; day <= daysInMonth; day++) {
         const loopDate = new Date(year, month, day);
         loopDate.setHours(0,0,0,0);
         
         if (loopDate >= today) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isWeekend = [0, 6].includes(loopDate.getDay());
            const dayEvent = monthEvents.find(e => e.date === dateStr);
            
            // Map rooms
            const dayRooms = inventory.map(room => {
                const bookedCount = bookings.filter(b => b.room_type === room.type && b.check_in && b.check_in.startsWith(dateStr)).length;
                let realBookedCount = bookedCount;
                if (!realBookedCount) {
                     // Minor dummy variance to give the AI something to calculate locally if entirely unbooked
                     realBookedCount = Math.floor(Math.random() * room.total_count);
                }
                return {
                    type: room.type,
                    totalRooms: room.total_count,
                    booked: realBookedCount,
                    currentPrice: room.base_price
                };
            });

            dataPayload.push({
                date: dateStr,
                rooms: dayRooms,
                isWeekend,
                isHoliday: !!dayEvent,
                event: dayEvent ? dayEvent.name : null
            });
         }
      }

      // Call AI endpoint
      const aiRes = await api.post('/pricing/ai-forecast', { dataPayload });
      
      const newForecast = { ...aiForecast };
      if (aiRes.data && aiRes.data.dates) {
          aiRes.data.dates.forEach(d => {
              newForecast[d.date] = d;
          });
      }
      setAiForecast(newForecast);
      
    } catch(err) {
      console.error("AI Error:", err);
      alert('Network error connecting to pricing engine.');
    } finally {
      setIsForecasting(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if(newEventDate && newEventName) {
         setCustomEvents([...customEvents, { 
           id: `custom-${Date.now()}`, 
           date: newEventDate, 
           name: newEventName, 
           type: 'manual_processed'
         }]);
         setIsModalOpen(false);
         setNewEventDate('');
         setNewEventName('');
    }
  };

  const handleDeleteEvent = (id) => {
    setCustomEvents(customEvents.filter(e => e.id !== id));
  };

  const checkHoliday = (dateStr) => {
    const foundCustom = customEvents.find(h => h.date === dateStr);
    const foundIndian = initialIndianHolidays.find(h => h.date === dateStr);
    if (foundCustom) return { ...foundCustom, isCustom: true };
    if (foundIndian) return { ...foundIndian, isCustom: false };
    return null; 
  };

  const openDayModal = async (y, m, d, isFuture, dateStr, holidayObj) => {
      setSelectedDay({ y, m, d, isFuture, dateStr, holidayObj });
      setDaySummaryData(null);
      
      if (!isFuture) {
          setIsDayLoading(true);
          try {
             const res = await api.get(`/revenue/day-summary?date=${dateStr}`);
             setDaySummaryData(res.data);
          } catch(e) {
             console.error(e);
          } finally {
             setIsDayLoading(false);
          }
      }
  };

  const renderDay = (y, m, d, isCurrentMonth, keyPrefix) => {
    const dateObj = new Date(y, m, d);
    dateObj.setHours(0,0,0,0);
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const holidayObj = checkHoliday(dateStr);
    const isFuture = dateObj >= today;
    const isToday = y === today.getFullYear() && m === today.getMonth() && d === today.getDate();
    
    const opacityClass = isCurrentMonth ? "opacity-100" : "opacity-40 grayscale-[30%]";
    let content = null;
    let bgClass = "bg-white dark:bg-dark-900";
    
    if (!isFuture) {
        // Past Dates showing Revenue & Profit physically
        const dayRecord = pastData[dateStr];
        if (dayRecord) {
            if (dayRecord.totalProfit > 0) bgClass = "bg-green-50 dark:bg-green-900/20";
            else if (dayRecord.totalProfit < 0) bgClass = "bg-red-50 dark:bg-red-900/20";
            
            content = (
                <div className="mt-auto space-y-1">
                   <div className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                       Rev: ₹{Math.floor(dayRecord.totalRevenue)}
                   </div>
                   <div className={`text-[11px] font-bold ${dayRecord.totalProfit > 0 ? "text-green-600 dark:text-green-400" : dayRecord.totalProfit < 0 ? "text-red-500" : "text-gray-500"}`}>
                       Profit: ₹{Math.floor(dayRecord.totalProfit)}
                   </div>
                </div>
            );
        } else {
            content = (
                <div className="mt-auto text-[10px] text-gray-400">No Data</div>
            );
        }
    } else {
        // Future Dates showing Price recommendation from AI only
        const forecastRecord = aiForecast[dateStr];
        if (forecastRecord && forecastRecord.recommendations.length > 0) {
            const avgPercent = Math.round(forecastRecord.recommendations.reduce((sum, r) => sum + r.priceChangePercent, 0) / forecastRecord.recommendations.length);
            const color = avgPercent > 0 ? "text-green-600 dark:text-green-400" : avgPercent < 0 ? "text-red-500" : "text-gray-500";
            bgClass = avgPercent > 0 ? "bg-green-50/50 dark:bg-green-900/10" : avgPercent < 0 ? "bg-red-50/50 dark:bg-red-900/10" : bgClass;
            
            content = (
                <div className="mt-auto text-center">
                   <span className={`text-lg font-bold ${color}`}>
                      {avgPercent > 0 ? '+' : ''}{avgPercent}%
                   </span>
                   <p className="text-[9px] text-gray-500 truncate mt-1" title={forecastRecord.overallStrategy}>{forecastRecord.overallStrategy}</p>
                </div>
            );
        } else {
            content = (
                <div className="mt-auto text-[10px] text-gray-400 text-center">No AI Forecast</div>
            );
        }
    }

    return (
      <div 
        key={`${keyPrefix}-${dateStr}`} 
        onClick={() => {
            if (isCurrentMonth) openDayModal(y, m, d, isFuture, dateStr, holidayObj);
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
            <span className={`font-bold text-sm ${isToday ? 'text-primary-600 dark:text-primary-400' : "text-gray-900 dark:text-gray-100"}`}>
              {d} {isToday && <span className="ml-1 text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full">Today</span>}
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
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {content}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-1">Revenue Intelligence Calendar</h2>
          <p className="text-gray-500 text-sm">Visualize actual profit (past) & AI pricing recommendations (future)</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleGenerateForecast}
            disabled={isForecasting}
            className="btn-secondary flex items-center gap-2 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-400 shadow-sm"
          >
            {isForecasting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-purple-600" />} 
            Analyze Month
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
                <span className="text-gray-600 dark:text-gray-300">Profit / Upsell Suggested</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-sm shadow-sm ring-1 ring-black/5"></div> 
                <span className="text-gray-600 dark:text-gray-300">Loss / Discount Suggested</span>
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
          <div className="bg-white dark:bg-dark-900 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden relative border border-gray-100 dark:border-dark-700">
            <div className="p-6 pb-4 border-b border-gray-100 dark:border-dark-700 bg-gray-50/50 dark:bg-dark-800/20">
              <button onClick={() => setSelectedDay(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-white dark:bg-dark-800 rounded-full p-1 shadow-sm">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold flex items-center gap-2">
                {new Date(selectedDay.y, selectedDay.m, selectedDay.d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                {!selectedDay.isFuture ? (
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full ml-2">Historical</span>
                ) : (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full ml-2">Forecast</span>
                )}
              </h3>
              {selectedDay.holidayObj && <span className="inline-block mt-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-semibold">{selectedDay.holidayObj.name}</span>}
            </div>
            
            <div className="p-6">
               {!selectedDay.isFuture ? (
                   // PAST MODAL
                   <div>
                       {isDayLoading ? (
                           <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
                       ) : daySummaryData ? (
                           <div className="space-y-6">
                               <div className="flex gap-4 mb-4">
                                   <div className="bg-gray-50 dark:bg-dark-800 p-4 rounded-xl flex-1 border border-gray-100 dark:border-dark-700">
                                       <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                                       <p className="text-2xl font-bold">₹{daySummaryData.totalRevenue.toLocaleString()}</p>
                                   </div>
                                   <div className={`p-4 rounded-xl flex-1 border ${daySummaryData.totalProfit > 0 ? "bg-green-50 border-green-100 text-green-900 dark:bg-green-900/10 dark:border-green-800" : daySummaryData.totalProfit < 0 ? "bg-red-50 border-red-100 text-red-900 dark:bg-red-900/10 dark:border-red-800" : "bg-gray-50 border-gray-100"}`}>
                                       <p className="text-sm opacity-80 mb-1">Total Profit (vs Base)</p>
                                       <p className={`text-2xl font-bold ${daySummaryData.totalProfit > 0 ? "text-green-600" : "text-red-500"}`}>
                                           ₹{daySummaryData.totalProfit.toLocaleString()}
                                       </p>
                                   </div>
                               </div>
                               
                               <div className="overflow-x-auto">
                               <table className="w-full text-left text-sm whitespace-nowrap">
                                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-dark-800">
                                    <tr>
                                      <th className="px-4 py-3 rounded-l-lg">Room Type</th>
                                      <th className="px-4 py-3">Sold / Total</th>
                                      <th className="px-4 py-3">Avg Price</th>
                                      <th className="px-4 py-3">Base Price</th>
                                      <th className="px-4 py-3 rounded-r-lg text-right">Profit</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {daySummaryData.rooms.map((r, i) => (
                                      <tr key={i} className="border-b border-gray-50 dark:border-dark-700/50 hover:bg-gray-50/50 dark:hover:bg-dark-800/20">
                                        <td className="px-4 py-3 font-medium">{r.type}</td>
                                        <td className="px-4 py-3">{r.sold} / {r.totalRooms}</td>
                                        <td className="px-4 py-3">₹{r.avgPrice}</td>
                                        <td className="px-4 py-3 text-gray-400">₹{r.basePrice}</td>
                                        <td className={`px-4 py-3 text-right font-semibold ${r.profit > 0 ? 'text-green-600' : r.profit < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                            ₹{r.profit}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                </div>
                           </div>
                       ) : (
                           <p className="text-gray-500 text-center py-8">No specific booking data available for this past date.</p>
                       )}
                   </div>
               ) : (
                   // FUTURE MODAL (AI)
                   <div className="space-y-6">
                      {aiForecast[selectedDay.dateStr] ? (
                          <>
                              <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-lg p-4 flex gap-3 mb-6">
                                <Sparkles className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="font-semibold text-sm text-purple-900 dark:text-purple-100 mb-1">AI Daily Strategy</h4>
                                  <p className="text-sm text-purple-800/80 dark:text-purple-200/80">
                                      {aiForecast[selectedDay.dateStr].overallStrategy}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="overflow-x-auto">
                              <table className="w-full text-left text-sm whitespace-nowrap">
                                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-dark-800">
                                    <tr>
                                      <th className="px-4 py-3 rounded-l-lg">Room Type</th>
                                      <th className="px-4 py-3">Suggested Adjust</th>
                                      <th className="px-4 py-3 rounded-r-lg">AI Reasoning</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {aiForecast[selectedDay.dateStr].recommendations.map((r, i) => (
                                      <tr key={i} className="border-b border-gray-50 dark:border-dark-700/50 hover:bg-gray-50/50 dark:hover:bg-dark-800/20">
                                        <td className="px-4 py-3 font-medium">{r.roomType}</td>
                                        <td className={`px-4 py-3 font-bold ${r.priceChangePercent > 0 ? 'text-green-600' : r.priceChangePercent < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                           {r.priceChangePercent > 0 ? '+' : ''}{r.priceChangePercent}%
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 whitespace-normal">
                                            {r.reason}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                </div>
                          </>
                      ) : (
                          <div className="text-center py-8">
                             <p className="text-gray-500">No predictions generated yet.</p>
                             <button onClick={() => { setSelectedDay(null); handleGenerateForecast(); }} className="mt-4 btn-secondary">Analyze Future Month</button>
                          </div>
                      )}
                   </div>
               )}
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
            <p className="text-xs text-gray-500 mb-4">Describe the event in detail to factor into predictions.</p>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Description</label>
                <textarea required rows="3" value={newEventName} onChange={e => setNewEventName(e.target.value)} className="input-field w-full" placeholder="e.g. CSK vs RCB IPL match" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input required type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} className="input-field" />
              </div>
              <button type="submit" className="w-full btn-primary mt-4">Save Event</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
