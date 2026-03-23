import { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Users, CalendarCheck, Activity } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/analytics').then(res => setData(res.data)).catch(err => console.error(err));
  }, []);

  if (!data) return <div className="p-8">Loading dashboard analytics...</div>;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Bookings" value={data.kpis.totalBookings} icon={Users} trend="+12%" />
        <KPICard title="Revenue (Monthly)" value={`₹${data.kpis.revenue.toLocaleString('en-IN')}`} icon={TrendingUp} trend="+8%" />
        <KPICard title="Occupancy Rate" value={`${data.kpis.occupancyRate}%`} icon={CalendarCheck} trend="+3%" />
        <KPICard title="Active Channels" value={data.kpis.activeChannels} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trends Chart */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6">Revenue Trends (₹)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.revenueTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Share Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-6">Bookings by Platform</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.platformBookings}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.platformBookings.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {data.platformBookings.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, trend }) {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        {trend && (
          <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
            {trend} from last month
          </p>
        )}
      </div>
      <div className="h-12 w-12 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
