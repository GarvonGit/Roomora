import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';

const occupancyData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 70 },
  { name: 'Mar', value: 85 },
  { name: 'Apr', value: 82 },
  { name: 'May', value: 90 },
  { name: 'Jun', value: 95 },
];

export default function Analytics() {
  const [data] = useState(occupancyData);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Analytics & Reporting</h2>
          <p className="text-gray-500 text-sm">Actionable insights from your booking data</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <InsightCard 
          title="Best Performing OTA" 
          value="Booking.com" 
          subtitle="45% of total revenue" 
          trend="up" 
        />
        <InsightCard 
          title="Peak Booking Period" 
          value="Mid-June" 
          subtitle="95% anticipated occupancy" 
          trend="up" 
        />
        <InsightCard 
          title="Underperforming Asset" 
          value="Standard Rooms" 
          subtitle="Conversion dropped by 5%" 
          trend="down" 
        />
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-6">Occupancy Rate (%)</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Monthly Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-700 text-gray-500 dark:text-gray-400">
                <th className="pb-3 px-4 font-medium text-sm">Month</th>
                <th className="pb-3 px-4 font-medium text-sm">Revenue (₹)</th>
                <th className="pb-3 px-4 font-medium text-sm">ADR (Avg Daily Rate)</th>
                <th className="pb-3 px-4 font-medium text-sm">RevPAR</th>
              </tr>
            </thead>
            <tbody>
              {['March 2026', 'February 2026', 'January 2026'].map((month, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-sm">{month}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-primary-600 dark:text-primary-400">₹{(250000 - i * 15000).toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4 text-sm">₹{(2000 - i * 50).toLocaleString()}</td>
                  <td className="py-4 px-4 text-sm">₹{(1600 - i * 40).toLocaleString()}</td>
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
    <div className="card group hover:-translate-y-1 transition-transform">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        {trend === 'up' ? 
          <TrendingUp className="w-5 h-5 text-green-500" /> : 
          <TrendingDown className="w-5 h-5 text-red-500" />
        }
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{value}</p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}
