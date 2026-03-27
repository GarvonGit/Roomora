import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, TrendingDown, Calendar as CalendarIcon } from 'lucide-react';
import api from '../utils/api';

const currentDate = new Date();
const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

export default function Analytics() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [data, setData] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    // 1. Fetch targeted selected month to build pure Daily Sales Data graph
    api.get(`/dashboard/analytics?month=${selectedMonth}`)
      .then(res => {
        // Automatically repair payload keys backward compatibility in case the node API process hasn't rebooted
        const refinedData = (res.data.revenueTrends || []).map(item => ({
            ...item,
            name: item.name || item.month || '?',
            value: Number(item.value || item.revenue || 0)
        }));
        setData(refinedData);
        setKpis(res.data.kpis);
      }).catch(err => console.error(err));

    // 2. Fetch global unstructured generic overview to calculate recent Monthly breakdown table
    api.get('/dashboard/analytics')
      .then(res => {
        setMonthlySummary(res.data.revenueTrends.reverse());
      }).catch(err => console.error(err));
  }, [selectedMonth]);

  // Construct standard exact rolling 6-month selector list
  const monthOptions = [];
  for(let i=0; i<6; i++) {
     const d = new Date();
     d.setMonth(d.getMonth() - i);
     const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
     const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
     monthOptions.push({ value: val, label });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Analytics & Reporting</h2>
          <p className="text-gray-500 text-sm">Actionable insights from your verified booking sales</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg px-3 py-2 text-sm shadow-sm">
            <CalendarIcon className="w-4 h-4 text-gray-500 mr-2" />
            <select 
              value={selectedMonth} 
              onChange={e => setSelectedMonth(e.target.value)} 
              className="bg-transparent border-none outline-none focus:ring-0 cursor-pointer font-medium"
            >
              {monthOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 animate-in fade-in zoom-in-95 duration-500 delay-100">
        <InsightCard 
          title="Current Period Revenue" 
          value={kpis ? `₹${kpis.revenue.toLocaleString('en-IN')}` : '₹0'} 
          subtitle="Dynamic recorded sales inside period" 
          trend="up" 
        />
        <InsightCard 
          title="Period Bookings" 
          value={kpis ? kpis.totalBookings : '0'} 
          subtitle="Customer reservations mapped to timeframe" 
          trend="up" 
        />
        <InsightCard 
          title="Active Connected Channels" 
          value={kpis ? kpis.activeChannels : '0'} 
          subtitle="Total live OTA integrations streaming" 
          trend="up" 
        />
      </div>

      <div className="card animate-in fade-in duration-500 delay-200">
        <h3 className="text-lg font-semibold mb-6 flex justify-between items-center">
          <span>Daily Revenue Trend (Sales)</span>
          <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-dark-700 py-1 px-2 rounded">{monthOptions.find(o => o.value === selectedMonth)?.label}</span>
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tickFormatter={(v) => `₹${v/1000}k`} tick={{ fontSize: 12 }} />
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
              <Tooltip 
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Daily Sales']}
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} 
              />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h3 className="text-lg font-semibold mb-4">Historical Monthly Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-700 text-gray-500 dark:text-gray-400">
                <th className="pb-3 px-4 font-medium text-sm">Month</th>
                <th className="pb-3 px-4 font-medium text-sm">Total Revenue (₹)</th>
                <th className="pb-3 px-4 font-medium text-sm">Estimated ADR</th>
                <th className="pb-3 px-4 font-medium text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {monthlySummary.length === 0 ? (
                <tr><td colSpan="4" className="py-4 text-center text-gray-500">No historical sales logic computed.</td></tr>
              ) : monthlySummary.map((m, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-sm text-gray-900 dark:text-white capitalize">{m.name}</td>
                  <td className="py-4 px-4 text-sm font-bold text-primary-600 dark:text-primary-400">₹{m.revenue?.toLocaleString('en-IN') || 0}</td>
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">₹{Math.round((m.revenue || 0) / 10).toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4 text-sm">
                    <span className="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 px-2.5 py-1 rounded text-xs font-semibold">Processed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ title, value, subtitle, trend }) {
  return (
    <div className="card group hover:-translate-y-1 transition-transform relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-2">{title}</h3>
        {trend === 'up' ? 
          <TrendingUp className="w-5 h-5 text-green-500" /> : 
          <TrendingDown className="w-5 h-5 text-red-500" />
        }
      </div>
      <div className="ml-2">
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{value}</p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}
