import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, CheckCircle2, Clock, XCircle, Hotel } from 'lucide-react';
import api from '../utils/api';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filterPlatform, setFilterPlatform] = useState('All Platforms');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch(err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>;
      case 'pending':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold"><Clock className="w-3 h-3" /> Pending</span>;
      case 'cancelled':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold"><XCircle className="w-3 h-3" /> Cancelled</span>;
      case 'completed':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      default:
        return null;
    }
  };

  const getPlatformBadge = (platform) => {
    const map = {
      'Booking.com': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Agoda': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'MakeMyTrip': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Goibibo': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      'Direct': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 w-fit ${map[platform] || map['Direct']}`}>
        <Hotel className="w-3 h-3" /> {platform}
      </span>
    );
  };

  const filteredBookings = filterPlatform === 'All Platforms' 
    ? bookings 
    : bookings.filter(b => b.ota_source === filterPlatform);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Unified Bookings</h2>
          <p className="text-gray-500 text-sm">Manage all reservations from one place</p>
        </div>
        
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search guest name..." 
              className="pl-9 pr-4 py-2 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>

          <select 
            value={filterPlatform} 
            onChange={e => setFilterPlatform(e.target.value)} 
            className="input-field py-2 flex-grow-0 w-auto text-sm"
          >
            <option value="All Platforms">All Platforms</option>
            <option value="Booking.com">Booking.com</option>
            <option value="Agoda">Agoda</option>
            <option value="MakeMyTrip">MakeMyTrip</option>
            <option value="Goibibo">Goibibo</option>
          </select>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-dark-700 text-gray-500 dark:text-gray-400">
              <th className="pb-3 px-4 font-medium text-sm">Guest Details</th>
              <th className="pb-3 px-4 font-medium text-sm">Platform</th>
              <th className="pb-3 px-4 font-medium text-sm">Dates</th>
              <th className="pb-3 px-4 font-medium text-sm">Total Price (₹)</th>
              <th className="pb-3 px-4 font-medium text-sm">Status</th>
              <th className="pb-3 px-4 font-medium text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">No bookings found.</td>
              </tr>
            ) : filteredBookings.map((b) => (
              <tr key={b.id} className="border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                <td className="py-4 px-4 text-sm">
                  <p className="font-semibold text-gray-900 dark:text-white">{b.guest_name}</p>
                  <p className="text-gray-500 text-xs">{b.room_type}</p>
                </td>
                <td className="py-4 px-4 text-sm">
                  {getPlatformBadge(b.ota_source)}
                </td>
                <td className="py-4 px-4 text-sm">
                  <p className="text-gray-900 dark:text-gray-200">{b.check_in}</p>
                  <p className="text-gray-500 text-xs">to {b.check_out}</p>
                </td>
                <td className="py-4 px-4 text-sm font-semibold text-primary-600 dark:text-primary-400">₹{b.price.toLocaleString('en-IN')}</td>
                <td className="py-4 px-4">
                  {getStatusBadge(b.status)}
                </td>
                <td className="py-4 px-4 text-right">
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
